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

export async function strmv(device, uplo, trans, diag, n, A, lda, x, incx, y, incy, layout = "row-major") {
  const xIsGpu = x instanceof GpuVector;
  const yIsGpu = y instanceof GpuVector;
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
  if (
    !Number.isInteger(n) ||
    !Number.isInteger(incx) ||
    !Number.isInteger(incy) ||
    !Number.isInteger(lda)
  )
    throw new Error("n, incx, incy, and lda must be integers.");
  if (incx <= 0 || incy <= 0)
    throw new Error("incx and incy must be positive.");
  if (lda < n) throw new Error("lda must be >= n.");
  if (!AIsGpu && !(A instanceof Float32Array))
    throw new Error("A must be a Float32Array or GpuMatrix.");
  if (!xIsGpu && !(x instanceof Float32Array))
    throw new Error("x must be a Float32Array or GpuVector.");
  if (!yIsGpu && !(y instanceof Float32Array))
    throw new Error("y must be a Float32Array or GpuVector.");
  if (xIsGpu !== yIsGpu)
    throw new Error(
      "x and y must be the same type (both Float32Array or both GpuVector).",
    );
  if (xIsGpu && x._buf === y._buf)
    throw new Error(
      "x and y must not reference the same GPU buffer when both are GpuVectors.",
    );
  if (xIsGpu && !AIsGpu)
    throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
  if (AIsGpu && !xIsGpu)
    throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
  if (AIsGpu && yIsGpu && A._buf === y._buf)
    throw new Error("A and y must not reference the same GPU buffer.");
  if (AIsGpu && lda !== A.lda)
    throw new Error("lda must match A.lda when A is a GpuMatrix.");
  if (AIsGpu && (A.rows < n || A.cols < n))
    throw new Error("A is too small for the given n.");
  if (n < 0) throw new Error("n must be non-negative.");
  if (n === 0) return yIsGpu ? {} : { y };

  if (!AIsGpu && A.length < (n - 1) * lda + n)
    throw new Error(
      "A does not have enough elements for the given n and lda.",
    );
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  if (y.length < (n - 1) * incy + 1)
    throw new Error(
      "y does not have enough elements for the given n and incy.",
    );

  // GpuMatrix's own layout wins over the argument; column-major A reinterpreted row-major is A^T, so flip both uplo and trans to reproduce the requested op(A).
  const effLayout = AIsGpu ? A.layout : layout;
  const isColMajor = effLayout === "column-major";
  const isLower = isColMajor ? uplo === "upper" : uplo === "lower";
  const isNoTrans = isColMajor ? trans === "transpose" : trans === "no-transpose";

  const pipeline = await getPipeline(device, "strmv");

  let ABuffer = null;
  let xBuffer = null;
  let yBuffer = null;
  let paramsBuffer = null;

  try {
    ABuffer = AIsGpu ? A._buf : uploadBuffer(A, "strmv-A", false);
    xBuffer = xIsGpu ? x._buf : uploadBuffer(x, "strmv-x", false);
    yBuffer = yIsGpu ? y._buf : uploadBuffer(y, "strmv-y", true);
    paramsBuffer = createParamsBuffer(
      [
        { value: n,             type: "u32" },
        { value: incx,          type: "u32" },
        { value: incy,          type: "u32" },
        { value: lda,           type: "u32" },
        { value: isNoTrans ? 0 : 1, type: "u32" },
        { value: isLower ? 0 : 1,   type: "u32" },
        { value: isUnit ? 1 : 0,    type: "u32" },
      ],
      "strmv-params",
    );

    const bindGroup = createBindGroup(pipeline.getBindGroupLayout(0), [
      ABuffer,
      xBuffer,
      yBuffer,
      paramsBuffer,
    ]);

    const wgCount = Math.min(n, device.limits.maxComputeWorkgroupsPerDimension);
    const { commandEncoder, ts } = runComputePass(pipeline, bindGroup, wgCount);
    const readBuffer = yIsGpu ? null : stageReadback(commandEncoder, yBuffer);

    submit(commandEncoder);

    const gpuTimeMs = await extractTimestamp(ts);

    if (yIsGpu) {
      if (gpuTimeMs !== undefined) return { gpuTimeMs };
      return {};
    }

    const result = await extractResult(readBuffer, Float32Array);
    if (gpuTimeMs !== undefined) return { y: result, gpuTimeMs };
    return { y: result };
  } finally {
    if (!AIsGpu && ABuffer) destroyBuffers(ABuffer);
    if (!xIsGpu && xBuffer) destroyBuffers(xBuffer);
    if (!yIsGpu && yBuffer) destroyBuffers(yBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
  }
}
