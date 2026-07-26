import {
  uploadBuffer,
  createParamsBuffer,
  stageReadback,
  destroyBuffers,
} from "../util/buffer.mjs";
import { createBindGroup } from "../util/bindgroup.mjs";
import { runComputePass, submit } from "../util/compute.mjs";
import { extractResult } from "../util/result.mjs";
import { extractTimestamp } from "../util/benchmark.mjs";
import { getPipeline } from "../util/pipeline.mjs";
import { GpuVector } from "../classes/GpuVector.mjs";
import { GpuMatrix } from "../classes/GpuMatrix.mjs";

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

  const pipeline = await getPipeline(device, "strsv");

  let ABuffer = null;
  let xBuffer = null;
  let paramsBuffer = null;

  try {
    ABuffer = AIsGpu ? A._buf : uploadBuffer(A, "strsv-A", false);
    xBuffer = xIsGpu ? x._buf : uploadBuffer(x, "strsv-x", true);
    paramsBuffer = createParamsBuffer(
      [
        { value: n,                 type: "u32" },
        { value: incx,              type: "u32" },
        { value: lda,               type: "u32" },
        { value: isNoTrans ? 0 : 1, type: "u32" },
        { value: isLower ? 0 : 1,   type: "u32" },
        { value: isUnit ? 1 : 0,    type: "u32" },
      ],
      "strsv-params",
    );

    const bindGroup = createBindGroup(pipeline.getBindGroupLayout(0), [
      ABuffer,
      xBuffer,
      paramsBuffer,
    ]);

    // Single workgroup, always — every row's solution depends on the
    // previous one, so this can't be farmed out to multiple independent
    // workgroups the way strmv's row-parallel dispatch is (see strsv.wgsl).
    const { commandEncoder, ts } = runComputePass(pipeline, bindGroup, 1);
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
    if (paramsBuffer) destroyBuffers(paramsBuffer);
  }
}
