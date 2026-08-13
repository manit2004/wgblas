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

// Blocked triangular solve via explicit block inversion (invert/apply/update passes) instead of barrier-per-row substitution.
const BLOCK_SIZE = 64;

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

export async function strsv(device, uplo, trans, diag, n, A, lda, x, incx, layout = "row-major") {
  const xIsGpu = x instanceof GpuVector;
  const AIsGpu = A instanceof GpuMatrix;
  const isUnit = diag === "unit";

  if (!(device instanceof GPUDevice))
    throw new Error("device must be a GPUDevice.");
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
  if (!AIsGpu && !(A instanceof Float32Array))
    throw new Error("A must be a Float32Array or GpuMatrix.");
  if (!xIsGpu && !(x instanceof Float32Array))
    throw new Error("x must be a Float32Array or GpuVector.");
  if (xIsGpu && !AIsGpu)
    throw new Error("A must be a GpuMatrix when x is a GpuVector.");
  if (AIsGpu && !xIsGpu)
    throw new Error("x must be a GpuVector when A is a GpuMatrix.");
  if (AIsGpu && lda !== A.lda)
    throw new Error("lda must match A.lda when A is a GpuMatrix.");
  if (AIsGpu && (A.rows < n || A.cols < n))
    throw new Error("A is too small for the given n.");
  if (n < 0) throw new Error("n must be non-negative.");
  if (n === 0) return xIsGpu ? {} : { x };

  if (!AIsGpu && A.length < (n - 1) * lda + n)
    throw new Error(
      "A does not have enough elements for the given n and lda.",
    );
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );

  // GpuMatrix's own layout wins over the argument; column-major A reinterpreted row-major is A^T, so flip both uplo and trans to reproduce the requested system.
  const effLayout = AIsGpu ? A.layout : layout;
  const isColMajor = effLayout === "column-major";
  const isLower = isColMajor ? uplo === "upper" : uplo === "lower";
  const isNoTrans = isColMajor ? trans === "transpose" : trans === "no-transpose";

  const invertPipeline = await getPipeline(device, "strsv_invert_block");
  const applyPipeline = await getPipeline(device, "strsv_apply_inverse");
  const updatePipeline = await getPipeline(device, "strsv_update");

  // Same forward/backward pairing the shaders use.
  const forward = isNoTrans === isLower;
  const blockStarts = [];
  for (let s = 0; s < n; s += BLOCK_SIZE) blockStarts.push(s);
  if (!forward) blockStarts.reverse();
  const numBlocks = blockStarts.length;

  const maxWg = device.limits.maxComputeWorkgroupsPerDimension;
  const stride = device.limits.minUniformBufferOffsetAlignment;

  let ABuffer = null;
  let xBuffer = null;
  let AinvBuffer = null;
  let applyParamsBuffer = null;
  let updateParamsBuffer = null;
  let invertParams = null;

  try {
    ABuffer = AIsGpu ? A._buf : uploadBuffer(A, "strsv-A", false);
    xBuffer = xIsGpu ? x._buf : uploadBuffer(x, "strsv-x", true);
    // One BLOCK_SIZE x BLOCK_SIZE dense region per block (row-major), even
    // though only a triangular half is ever nonzero — see strsv_invert_block.wgsl.
    AinvBuffer = createStorageBuffer(
      numBlocks * BLOCK_SIZE * BLOCK_SIZE * 4,
      "strsv-Ainv",
    );

    // Every block's {blockStart, blockEnd} is fixed by its natural index
    // regardless of traversal direction, so both packed buffers are indexed
    // by blockIndex (0..numBlocks-1), not by loop position.
    const applyData = packBlockParams(numBlocks, stride, (blockIndex) => {
      const blockStart = blockIndex * BLOCK_SIZE;
      const blockEnd = Math.min(blockStart + BLOCK_SIZE, n);
      return [incx, blockIndex, blockStart, blockEnd];
    });
    applyParamsBuffer = createSharedParamsBuffer(device, applyData, "strsv-apply-params");

    const updateData = packBlockParams(numBlocks, stride, (blockIndex) => {
      const blockStart = blockIndex * BLOCK_SIZE;
      const blockEnd = Math.min(blockStart + BLOCK_SIZE, n);
      return [n, incx, lda, isNoTrans ? 0 : 1, isLower ? 0 : 1, blockStart, blockEnd];
    });
    updateParamsBuffer = createSharedParamsBuffer(device, updateData, "strsv-update-params");

    const { commandEncoder, querySet } = beginTimedEncoder();

    // Pre-pass: every block's inverse, fully parallel, one dispatch.
    invertParams = createParamsBuffer(
      [
        { value: n,                 type: "u32" },
        { value: lda,               type: "u32" },
        { value: isNoTrans ? 0 : 1, type: "u32" },
        { value: isLower ? 0 : 1,   type: "u32" },
        { value: isUnit ? 1 : 0,    type: "u32" },
      ],
      "strsv-invert-params",
    );
    const invertBindGroup = createBindGroup(invertPipeline.getBindGroupLayout(0), [
      ABuffer, AinvBuffer, invertParams,
    ]);
    const invertDesc = querySet
      ? { timestampWrites: { querySet, beginningOfPassWriteIndex: 0 } }
      : undefined;
    encodePass(commandEncoder, invertPipeline, invertBindGroup, { x: BLOCK_SIZE, y: numBlocks }, invertDesc);

    for (let bi = 0; bi < blockStarts.length; bi++) {
      const blockStart = blockStarts[bi];
      const blockEnd = Math.min(blockStart + BLOCK_SIZE, n);
      const blockIndex = blockStart / BLOCK_SIZE;
      const isLastPass = bi === blockStarts.length - 1;
      const paramsOffset = blockIndex * stride;

      const applyBindGroup = createBindGroup(applyPipeline.getBindGroupLayout(0), [
        AinvBuffer, xBuffer, { buffer: applyParamsBuffer, offset: paramsOffset, size: 16 },
      ]);

      const applyDesc = isLastPass && querySet
        ? { timestampWrites: { querySet, endOfPassWriteIndex: 1 } }
        : undefined;
      encodePass(commandEncoder, applyPipeline, applyBindGroup, 1, applyDesc);

      const remaining = forward ? n - blockEnd : blockStart;
      if (remaining === 0) continue;

      const updateBindGroup = createBindGroup(updatePipeline.getBindGroupLayout(0), [
        ABuffer, xBuffer, { buffer: updateParamsBuffer, offset: paramsOffset, size: 32 },
      ]);

      const wgCount = Math.min(remaining, maxWg);
      encodePass(commandEncoder, updatePipeline, updateBindGroup, wgCount);
    }

    const ts = resolveTimestamp(commandEncoder, querySet);
    const readBuffer = xIsGpu ? null : stageReadback(commandEncoder, xBuffer);

    submit(commandEncoder);

    const gpuTimeMs = await extractTimestamp(ts);

    if (xIsGpu) {
      if (gpuTimeMs !== undefined) return { gpuTimeMs };
      return {};
    }

    const result = await extractResult(readBuffer, Float32Array);
    if (gpuTimeMs !== undefined) return { x: result, gpuTimeMs };
    return { x: result };
  } finally {
    if (!AIsGpu && ABuffer) destroyBuffers(ABuffer);
    if (!xIsGpu && xBuffer) destroyBuffers(xBuffer);
    if (AinvBuffer) destroyBuffers(AinvBuffer);
    if (applyParamsBuffer) destroyBuffers(applyParamsBuffer);
    if (updateParamsBuffer) destroyBuffers(updateParamsBuffer);
    if (invertParams) destroyBuffers(invertParams);
  }
}
