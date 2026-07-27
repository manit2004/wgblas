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

// Blocked triangular solve, explicit-inversion variant: a pre-pass inverts
// every diagonal block in parallel (strsv_invert_block.wgsl), then each
// block is solved via a dense matvec against its inverse (strsv_apply_inverse.wgsl)
// instead of a barrier-per-row substitution. strsv_update.wgsl (propagating
// a solved block onto remaining rows) is unchanged.
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

  let ABuffer = null;
  let xBuffer = null;
  let AinvBuffer = null;
  const paramsBuffers = [];

  try {
    ABuffer = AIsGpu ? A._buf : uploadBuffer(A, "strsv-A", false);
    xBuffer = xIsGpu ? x._buf : uploadBuffer(x, "strsv-x", true);
    // One BLOCK_SIZE x BLOCK_SIZE dense region per block (row-major), even
    // though only a triangular half is ever nonzero — see strsv_invert_block.wgsl.
    AinvBuffer = createStorageBuffer(
      numBlocks * BLOCK_SIZE * BLOCK_SIZE * 4,
      "strsv-Ainv",
    );

    const { commandEncoder, querySet } = beginTimedEncoder();

    // Pre-pass: every block's inverse, fully parallel, one dispatch.
    const invertParams = createParamsBuffer(
      [
        { value: n,                 type: "u32" },
        { value: lda,               type: "u32" },
        { value: isNoTrans ? 0 : 1, type: "u32" },
        { value: isLower ? 0 : 1,   type: "u32" },
        { value: isUnit ? 1 : 0,    type: "u32" },
      ],
      "strsv-invert-params",
    );
    paramsBuffers.push(invertParams);
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

      const applyParams = createParamsBuffer(
        [
          { value: incx,      type: "u32" },
          { value: blockIndex, type: "u32" },
          { value: blockStart, type: "u32" },
          { value: blockEnd,   type: "u32" },
        ],
        "strsv-apply-params",
      );
      paramsBuffers.push(applyParams);
      const applyBindGroup = createBindGroup(applyPipeline.getBindGroupLayout(0), [
        AinvBuffer, xBuffer, applyParams,
      ]);

      const applyDesc = isLastPass && querySet
        ? { timestampWrites: { querySet, endOfPassWriteIndex: 1 } }
        : undefined;
      encodePass(commandEncoder, applyPipeline, applyBindGroup, 1, applyDesc);

      const remaining = forward ? n - blockEnd : blockStart;
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
    if (AinvBuffer) destroyBuffers(AinvBuffer);
    destroyBuffers(paramsBuffers);
  }
}
