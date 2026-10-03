import {
  uploadBuffer,
  createParamsBuffer,
  createStorageBuffer,
  stageReadback,
  destroyBuffers,
} from "../util/buffer.mjs";
import { createBindGroup } from "../util/bindgroup.mjs";
import { beginTimedEncoder, encodePass, submit } from "../util/compute.mjs";
import { extractResult } from "../util/result.mjs";
import { resolveTimestamp, extractTimestamp } from "../util/benchmark.mjs";
import { getPipeline } from "../util/pipeline.mjs";
import { GpuVector } from "../classes/GpuVector.mjs";
import { GpuMatrix } from "../classes/GpuMatrix.mjs";
import { BLOCK_SIZE } from "../util/constants.mjs";
import { splitDoubleDouble, mergeDoubleDouble } from "../util/f64.mjs";
import { requireGpuDevice, requireSameDevice } from "../util/device.mjs";

// Blocked triangular solve via explicit block inversion (invert/apply/update
// passes), double-double (Dekker) f64 emulation of strsv — A, Ainv, and x
// are each split into an f32 (hi, lo) pair; WGSL has no f64 type.

// One shared buffer holds all blocks' params (offset blockIndex*stride) instead of one buffer per block — avoids the O(numBlocks) createBuffer/writeBuffer calls that dominated CPU time.
function packBlockParams(numBlocks, stride, fieldsPerBlock) {
  const data = new ArrayBuffer(numBlocks * stride);
  const view = new DataView(data);
  for (let blockIndex = 0; blockIndex < numBlocks; blockIndex++) {
    const fields = fieldsPerBlock(blockIndex);
    const base = blockIndex * stride;
    fields.forEach((value, i) => view.setUint32(base + i * 4, value, true));
  }
  return data;
}

function createSharedParamsBuffer(device, data, label) {
  const buffer = device.createBuffer({
    label,
    size: data.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(buffer, 0, data);
  return buffer;
}

export async function dtrsv(
  device,
  uplo,
  trans,
  diag,
  n,
  A,
  lda,
  x,
  incx,
  layout = "row-major",
) {
  const xIsGpu = x instanceof GpuVector;
  const AIsGpu = A instanceof GpuMatrix;
  const isUnit = diag === "unit";

  requireGpuDevice(device);
  requireSameDevice(device, "dtrsv", { A, x });
  if (uplo !== "lower" && uplo !== "upper")
    throw new Error("uplo must be 'lower' or 'upper'.");
  if (trans !== "no-transpose" && trans !== "transpose")
    throw new Error("trans must be 'no-transpose' or 'transpose'.");
  if (!isUnit && diag !== "non-unit")
    throw new Error("diag must be 'unit' or 'non-unit'.");
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (!Number.isInteger(n) || !Number.isInteger(incx) || !Number.isInteger(lda))
    throw new Error("n, incx, and lda must be integers.");
  if (incx <= 0) throw new Error("incx must be positive.");
  if (lda < n) throw new Error("lda must be >= n.");
  if (!AIsGpu && !(A instanceof Float64Array))
    throw new Error("A must be a Float64Array or GpuMatrix.");
  if (AIsGpu && A.dtype !== Float64Array)
    throw new Error("A must be a Float64Array-backed GpuMatrix.");
  if (!xIsGpu && !(x instanceof Float64Array))
    throw new Error("x must be a Float64Array or GpuVector.");
  if (xIsGpu && x.dtype !== Float64Array)
    throw new Error("x must be a Float64Array-backed GpuVector.");
  if (xIsGpu && !AIsGpu)
    throw new Error("A must be a GpuMatrix when x is a GpuVector.");
  if (AIsGpu && !xIsGpu)
    throw new Error("x must be a GpuVector when A is a GpuMatrix.");
  if (AIsGpu && xIsGpu && A._buf === x._buf)
    throw new Error("A and x must not reference the same GPU buffer.");
  if (AIsGpu && lda !== A.lda)
    throw new Error("lda must match A.lda when A is a GpuMatrix.");
  if (AIsGpu && (A.rows < n || A.cols < n))
    throw new Error("A is too small for the given n.");
  if (n < 0) throw new Error("n must be non-negative.");
  if (n === 0) return xIsGpu ? {} : { x };

  if (!AIsGpu && A.length < (n - 1) * lda + n)
    throw new Error("A does not have enough elements for the given n and lda.");
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );

  // GpuMatrix's own layout wins over the argument; column-major A reinterpreted row-major is A^T, so flip both uplo and trans to reproduce the requested system.
  const effLayout = AIsGpu ? A.layout : layout;
  const isColMajor = effLayout === "column-major";
  const isLower = isColMajor ? uplo === "upper" : uplo === "lower";
  const isNoTrans = isColMajor
    ? trans === "transpose"
    : trans === "no-transpose";

  const f64Deps = [
    "f64/dekker",
    "f64/utils/add",
    "f64/utils/multiply",
    "f64/utils/divide",
  ];
  const invertPipeline = await getPipeline(
    device,
    [...f64Deps, "dtrsv_invert_block"],
    "dtrsv_invert_block_main",
  );
  const applyPipeline = await getPipeline(
    device,
    [...f64Deps, "dtrsv_apply_inverse"],
    "dtrsv_apply_inverse_main",
  );
  const updatePipeline = await getPipeline(
    device,
    [...f64Deps, "dtrsv_update"],
    "dtrsv_update_main",
  );

  // Same forward/backward pairing the shaders use.
  const forward = isNoTrans === isLower;
  const blockStarts = [];
  for (let s = 0; s < n; s += BLOCK_SIZE) blockStarts.push(s);
  if (!forward) blockStarts.reverse();
  const numBlocks = blockStarts.length;

  const maxWg = device.limits.maxComputeWorkgroupsPerDimension;
  const stride = device.limits.minUniformBufferOffsetAlignment;

  let AHiBuffer = null;
  let ALoBuffer = null;
  let xHiBuffer = null;
  let xLoBuffer = null;
  let AinvHiBuffer = null;
  let AinvLoBuffer = null;
  let applyParamsBuffer = null;
  let updateParamsBuffer = null;
  let invertParams = null;
  let readHiBuffer = null;
  let readLoBuffer = null;

  try {
    if (AIsGpu) {
      AHiBuffer = A._buf;
      ALoBuffer = A._loBuf;
    } else {
      const ASplit = splitDoubleDouble(A);
      AHiBuffer = uploadBuffer(device, ASplit.hi, "dtrsv-AHi", false);
      ALoBuffer = uploadBuffer(device, ASplit.lo, "dtrsv-ALo", false);
    }
    if (xIsGpu) {
      xHiBuffer = x._buf;
      xLoBuffer = x._loBuf;
    } else {
      const xSplit = splitDoubleDouble(x);
      xHiBuffer = uploadBuffer(device, xSplit.hi, "dtrsv-xHi", true);
      xLoBuffer = uploadBuffer(device, xSplit.lo, "dtrsv-xLo", true);
    }
    // One BLOCK_SIZE x BLOCK_SIZE dense region per block (row-major), even
    // though only a triangular half is ever nonzero — see
    // dtrsv_invert_block.wgsl. Hi/Lo are two separate f32-element buffers,
    // same element count each as the f32 original's single Ainv buffer.
    AinvHiBuffer = createStorageBuffer(
      device,
      numBlocks * BLOCK_SIZE * BLOCK_SIZE * 4,
      "dtrsv-AinvHi",
    );
    AinvLoBuffer = createStorageBuffer(
      device,
      numBlocks * BLOCK_SIZE * BLOCK_SIZE * 4,
      "dtrsv-AinvLo",
    );

    // Every block's {blockStart, blockEnd} is fixed by its natural index
    // regardless of traversal direction, so both packed buffers are indexed
    // by blockIndex (0..numBlocks-1), not by loop position.
    const applyData = packBlockParams(numBlocks, stride, (blockIndex) => {
      const blockStart = blockIndex * BLOCK_SIZE;
      const blockEnd = Math.min(blockStart + BLOCK_SIZE, n);
      return [incx, blockIndex, blockStart, blockEnd];
    });
    applyParamsBuffer = createSharedParamsBuffer(
      device,
      applyData,
      "dtrsv-apply-params",
    );

    const updateData = packBlockParams(numBlocks, stride, (blockIndex) => {
      const blockStart = blockIndex * BLOCK_SIZE;
      const blockEnd = Math.min(blockStart + BLOCK_SIZE, n);
      return [
        n,
        incx,
        lda,
        isNoTrans ? 0 : 1,
        isLower ? 0 : 1,
        blockStart,
        blockEnd,
      ];
    });
    updateParamsBuffer = createSharedParamsBuffer(
      device,
      updateData,
      "dtrsv-update-params",
    );

    const { commandEncoder, querySet } = beginTimedEncoder(device);

    // Pre-pass: every block's inverse, fully parallel, one dispatch.
    invertParams = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" },
        { value: lda, type: "u32" },
        { value: isNoTrans ? 0 : 1, type: "u32" },
        { value: isLower ? 0 : 1, type: "u32" },
        { value: isUnit ? 1 : 0, type: "u32" },
      ],
      "dtrsv-invert-params",
    );
    const invertBindGroup = createBindGroup(
      device,
      invertPipeline.getBindGroupLayout(0),
      [AHiBuffer, ALoBuffer, AinvHiBuffer, AinvLoBuffer, invertParams],
    );
    const invertDesc = querySet
      ? { timestampWrites: { querySet, beginningOfPassWriteIndex: 0 } }
      : undefined;
    encodePass(
      commandEncoder,
      invertPipeline,
      invertBindGroup,
      { x: BLOCK_SIZE, y: numBlocks },
      invertDesc,
    );

    for (let bi = 0; bi < blockStarts.length; bi++) {
      const blockStart = blockStarts[bi];
      const blockEnd = Math.min(blockStart + BLOCK_SIZE, n);
      const blockIndex = blockStart / BLOCK_SIZE;
      const isLastPass = bi === blockStarts.length - 1;
      const paramsOffset = blockIndex * stride;

      const applyBindGroup = createBindGroup(
        device,
        applyPipeline.getBindGroupLayout(0),
        [
          AinvHiBuffer,
          AinvLoBuffer,
          xHiBuffer,
          xLoBuffer,
          { buffer: applyParamsBuffer, offset: paramsOffset, size: 16 },
        ],
      );

      const applyDesc =
        isLastPass && querySet
          ? { timestampWrites: { querySet, endOfPassWriteIndex: 1 } }
          : undefined;
      encodePass(commandEncoder, applyPipeline, applyBindGroup, 1, applyDesc);

      const remaining = forward ? n - blockEnd : blockStart;
      if (remaining === 0) continue;

      const updateBindGroup = createBindGroup(
        device,
        updatePipeline.getBindGroupLayout(0),
        [
          AHiBuffer,
          ALoBuffer,
          xHiBuffer,
          xLoBuffer,
          { buffer: updateParamsBuffer, offset: paramsOffset, size: 32 },
        ],
      );

      const wgCount = Math.min(remaining, maxWg);
      encodePass(commandEncoder, updatePipeline, updateBindGroup, wgCount);
    }

    const ts = resolveTimestamp(device, commandEncoder, querySet);
    readHiBuffer = xIsGpu
      ? null
      : stageReadback(device, commandEncoder, xHiBuffer);
    readLoBuffer = xIsGpu
      ? null
      : stageReadback(device, commandEncoder, xLoBuffer);

    submit(device, commandEncoder);

    const gpuTimeMs = await extractTimestamp(ts);

    if (xIsGpu) {
      if (gpuTimeMs !== undefined) return { gpuTimeMs };
      return {};
    }

    const hi = await extractResult(readHiBuffer, Float32Array);
    readHiBuffer = null;
    const lo = await extractResult(readLoBuffer, Float32Array);
    readLoBuffer = null;
    const result = mergeDoubleDouble(hi, lo);
    if (gpuTimeMs !== undefined) return { x: result, gpuTimeMs };
    return { x: result };
  } finally {
    if (!AIsGpu && AHiBuffer) destroyBuffers(AHiBuffer);
    if (!AIsGpu && ALoBuffer) destroyBuffers(ALoBuffer);
    if (!xIsGpu && xHiBuffer) destroyBuffers(xHiBuffer);
    if (!xIsGpu && xLoBuffer) destroyBuffers(xLoBuffer);
    if (AinvHiBuffer) destroyBuffers(AinvHiBuffer);
    if (AinvLoBuffer) destroyBuffers(AinvLoBuffer);
    if (applyParamsBuffer) destroyBuffers(applyParamsBuffer);
    if (updateParamsBuffer) destroyBuffers(updateParamsBuffer);
    if (invertParams) destroyBuffers(invertParams);
    if (readHiBuffer) destroyBuffers(readHiBuffer);
    if (readLoBuffer) destroyBuffers(readLoBuffer);
  }
}
