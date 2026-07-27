import {
  uploadBuffer,
  createParamsBuffer,
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

// Blocked triangular solve: BLOCK_SIZE-row diagonal blocks are solved
// sequentially (strsv_block.wgsl), then propagated onto remaining rows in
// parallel (strsv_update.wgsl) — turns n sequential stages into n/BLOCK_SIZE.
const BLOCK_SIZE = 64;

export async function strsv(device, uplo, trans, diag, n, A, lda, x, incx) {
  const xIsGpu = x instanceof GpuVector;
  const AIsGpu = A instanceof GpuMatrix;
  const isLower = uplo === "lower";
  const isNoTrans = trans === "no-transpose";
  const isUnit = diag === "unit";

  if (!(device instanceof GPUDevice))
    throw new Error("device must be a GPUDevice.");
  if (!isLower && uplo !== "upper")
    throw new Error("uplo must be 'lower' or 'upper'.");
  if (!isNoTrans && trans !== "transpose")
    throw new Error("trans must be 'no-transpose' or 'transpose'.");
  if (!isUnit && diag !== "non-unit")
    throw new Error("diag must be 'unit' or 'non-unit'.");
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

  const blockPipeline = await getPipeline(device, "strsv_block");
  const updatePipeline = await getPipeline(device, "strsv_update");

  // Same forward/backward pairing strsv_block.wgsl/strsv_update.wgsl use.
  const forward = isNoTrans === isLower;
  const blockStarts = [];
  for (let s = 0; s < n; s += BLOCK_SIZE) blockStarts.push(s);
  if (!forward) blockStarts.reverse();

  const maxWg = device.limits.maxComputeWorkgroupsPerDimension;

  let ABuffer = null;
  let xBuffer = null;
  const paramsBuffers = [];

  try {
    ABuffer = AIsGpu ? A._buf : uploadBuffer(A, "strsv-A", false);
    xBuffer = xIsGpu ? x._buf : uploadBuffer(x, "strsv-x", true);

    const { commandEncoder, querySet } = beginTimedEncoder();

    for (let bi = 0; bi < blockStarts.length; bi++) {
      const blockStart = blockStarts[bi];
      const blockEnd = Math.min(blockStart + BLOCK_SIZE, n);
      const isFirstPass = bi === 0;

      const blockParams = createParamsBuffer(
        [
          { value: n,                 type: "u32" },
          { value: incx,              type: "u32" },
          { value: lda,               type: "u32" },
          { value: isNoTrans ? 0 : 1, type: "u32" },
          { value: isLower ? 0 : 1,   type: "u32" },
          { value: isUnit ? 1 : 0,    type: "u32" },
          { value: blockStart,        type: "u32" },
          { value: blockEnd,          type: "u32" },
        ],
        "strsv-block-params",
      );
      paramsBuffers.push(blockParams);
      const blockBindGroup = createBindGroup(blockPipeline.getBindGroupLayout(0), [
        ABuffer, xBuffer, blockParams,
      ]);

      // Blocks partition [0,n), so the last block always has remaining===0 —
      // its own solve pass, not its (skipped) update, is the true last pass.
      const remaining = forward ? n - blockEnd : blockStart;
      const isLastPass = remaining === 0;

      let blockDesc;
      if (querySet) {
        if (isFirstPass && isLastPass) {
          blockDesc = { timestampWrites: { querySet, beginningOfPassWriteIndex: 0, endOfPassWriteIndex: 1 } };
        } else if (isFirstPass) {
          blockDesc = { timestampWrites: { querySet, beginningOfPassWriteIndex: 0 } };
        } else if (isLastPass) {
          blockDesc = { timestampWrites: { querySet, endOfPassWriteIndex: 1 } };
        }
      }
      encodePass(commandEncoder, blockPipeline, blockBindGroup, 1, blockDesc);

      if (remaining === 0) continue;

      const updateParams = createParamsBuffer(
        [
          { value: n,                 type: "u32" },
          { value: incx,              type: "u32" },
          { value: lda,               type: "u32" },
          { value: isNoTrans ? 0 : 1, type: "u32" },
          { value: isLower ? 0 : 1,   type: "u32" },
          { value: blockStart,        type: "u32" },
          { value: blockEnd,          type: "u32" },
        ],
        "strsv-update-params",
      );
      paramsBuffers.push(updateParams);
      const updateBindGroup = createBindGroup(updatePipeline.getBindGroupLayout(0), [
        ABuffer, xBuffer, updateParams,
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
    destroyBuffers(paramsBuffers);
  }
}
