import {
  uploadBuffer,
  createParamsBuffer,
  createStorageBuffer,
  stageReadback,
  destroyBuffers,
} from "../util/buffer.mjs";
import { createBindGroup } from "../util/bindgroup.mjs";
import { beginTimedEncoder, submit } from "../util/compute.mjs";
import { extractResult } from "../util/result.mjs";
import { resolveTimestamp, extractTimestamp } from "../util/benchmark.mjs";
import { getPipeline } from "../util/pipeline.mjs";
import { GpuVector } from "../classes/GpuVector.mjs";
import { GpuMatrix } from "../classes/GpuMatrix.mjs";
import { BLOCK_SIZE, STRSV_TILE_ROWS, WGS } from "../util/constants.mjs";
import { requireWorkgroupCount } from "../util/workgroup.mjs";
import { requireGpuDevice, requireSameDevice } from "../util/device.mjs";

// Blocked triangular solve via explicit block inversion instead of barrier-per-row substitution: one invert pre-pass, then one fused solve-and-update dispatch per block (strsv_step.wgsl), then a copy of the solution into x.

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

export async function strsv(
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
  requireSameDevice(device, "strsv", { A, x });
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

  const invertPipeline = await getPipeline(device, "strsv_invert_block");
  const stepPipeline = await getPipeline(device, "strsv_step");
  const scatterPipeline = await getPipeline(device, "scatter_strided");

  // Same forward/backward pairing the shaders use.
  const forward = isNoTrans === isLower;
  const blockStarts = [];
  for (let s = 0; s < n; s += BLOCK_SIZE) blockStarts.push(s);
  if (!forward) blockStarts.reverse();
  const numBlocks = blockStarts.length;

  const stride = device.limits.minUniformBufferOffsetAlignment;

  let ABuffer = null;
  let xBuffer = null;
  let AinvBuffer = null;
  let solBuffer = null;
  let stepParamsBuffer = null;
  let invertParams = null;
  let scatterParams = null;

  try {
    ABuffer = AIsGpu ? A._buf : uploadBuffer(device, A, "strsv-A", false);
    xBuffer = xIsGpu ? x._buf : uploadBuffer(device, x, "strsv-x", true);
    // One BLOCK_SIZE x BLOCK_SIZE dense region per block (row-major), even
    // though only a triangular half is ever nonzero — see strsv_invert_block.wgsl.
    AinvBuffer = createStorageBuffer(
      device,
      numBlocks * BLOCK_SIZE * BLOCK_SIZE * 4,
      "strsv-Ainv",
    );
    // Contiguous solution, written block by block and copied into x at the
    // end — see strsv_step.wgsl for why it can't go straight into x.
    solBuffer = createStorageBuffer(device, n * 4, "strsv-sol");

    // Every block's params are fixed by its natural index regardless of
    // traversal direction, so the packed buffer is indexed by blockIndex
    // (0..numBlocks-1), not by loop position.
    const stepData = packBlockParams(numBlocks, stride, (blockIndex) => {
      const blockStart = blockIndex * BLOCK_SIZE;
      const blockEnd = Math.min(blockStart + BLOCK_SIZE, n);
      // forward: remaining rows are [blockEnd, n); backward: [0, blockStart).
      const rangeStart = forward ? blockEnd : 0;
      const rowCount = forward ? n - blockEnd : blockStart;
      return [
        incx,
        lda,
        isNoTrans ? 0 : 1,
        blockIndex,
        blockStart,
        blockEnd,
        rangeStart,
        rowCount,
      ];
    });
    stepParamsBuffer = createSharedParamsBuffer(
      device,
      stepData,
      "strsv-step-params",
    );

    invertParams = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" },
        { value: lda, type: "u32" },
        { value: isNoTrans ? 0 : 1, type: "u32" },
        { value: isLower ? 0 : 1, type: "u32" },
        { value: isUnit ? 1 : 0, type: "u32" },
      ],
      "strsv-invert-params",
    );
    scatterParams = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" },
        { value: incx, type: "u32" },
      ],
      "strsv-scatter-params",
    );

    // Every dispatch goes in ONE compute pass: each dispatch is still its own
    // synchronization scope (WebGPU orders them and makes each one's storage
    // writes visible to the next), but the solve is a long chain of small
    // dependent dispatches, and a separate pass per dispatch added a fixed
    // per-pass cost that dominated it.
    const { commandEncoder, querySet, passDescriptor } =
      beginTimedEncoder(device);
    const pass = commandEncoder.beginComputePass(passDescriptor);

    // Every block's inverse, fully parallel, one workgroup per block.
    pass.setPipeline(invertPipeline);
    pass.setBindGroup(
      0,
      createBindGroup(device, invertPipeline.getBindGroupLayout(0), [
        ABuffer,
        AinvBuffer,
        invertParams,
      ]),
    );
    pass.dispatchWorkgroups(numBlocks);

    // One fused solve-and-update dispatch per block, in dependency order.
    pass.setPipeline(stepPipeline);
    for (const blockStart of blockStarts) {
      const blockIndex = blockStart / BLOCK_SIZE;
      const blockEnd = Math.min(blockStart + BLOCK_SIZE, n);
      const rowCount = forward ? n - blockEnd : blockStart;
      pass.setBindGroup(
        0,
        createBindGroup(device, stepPipeline.getBindGroupLayout(0), [
          ABuffer,
          AinvBuffer,
          xBuffer,
          solBuffer,
          { buffer: stepParamsBuffer, offset: blockIndex * stride, size: 32 },
        ]),
      );
      pass.dispatchWorkgroups(
        requireWorkgroupCount(
          device,
          Math.max(1, Math.ceil(rowCount / STRSV_TILE_ROWS)),
          "strsv",
        ),
      );
    }

    // Copy the solution into x (leaving any stride gaps untouched).
    pass.setPipeline(scatterPipeline);
    pass.setBindGroup(
      0,
      createBindGroup(device, scatterPipeline.getBindGroupLayout(0), [
        solBuffer,
        xBuffer,
        scatterParams,
      ]),
    );
    pass.dispatchWorkgroups(
      Math.min(
        Math.ceil(n / WGS),
        device.limits.maxComputeWorkgroupsPerDimension,
      ),
    );
    pass.end();

    const ts = resolveTimestamp(device, commandEncoder, querySet);
    const readBuffer = xIsGpu
      ? null
      : stageReadback(device, commandEncoder, xBuffer);

    submit(device, commandEncoder);

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
    if (solBuffer) destroyBuffers(solBuffer);
    if (stepParamsBuffer) destroyBuffers(stepParamsBuffer);
    if (invertParams) destroyBuffers(invertParams);
    if (scatterParams) destroyBuffers(scatterParams);
  }
}
