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

export async function ssyr2(device, uplo, n, alpha, x, incx, y, incy, A, lda, layout = "row-major") {
  const xIsGpu = x instanceof GpuVector;
  const yIsGpu = y instanceof GpuVector;
  const AIsGpu = A instanceof GpuMatrix;

  if (!(device instanceof GPUDevice))
    throw new Error("device must be a GPUDevice.");
  if (uplo !== "lower" && uplo !== "upper")
    throw new Error("uplo must be 'lower' or 'upper'.");
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (
    !Number.isInteger(n) ||
    !Number.isInteger(incx) ||
    !Number.isInteger(incy) ||
    !Number.isInteger(lda)
  )
    throw new Error("n, incx, incy, and lda must be integers.");
  if (typeof alpha !== "number")
    throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
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
  if (xIsGpu && !AIsGpu)
    throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
  if (AIsGpu && !xIsGpu)
    throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
  if (AIsGpu && xIsGpu && A._buf === x._buf)
    throw new Error("A and x must not reference the same GPU buffer.");
  if (AIsGpu && yIsGpu && A._buf === y._buf)
    throw new Error("A and y must not reference the same GPU buffer.");
  if (xIsGpu && x._buf === y._buf)
    throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");
  if (AIsGpu && lda !== A.lda)
    throw new Error("lda must match A.lda when A is a GpuMatrix.");
  if (AIsGpu && (A.rows < n || A.cols < n))
    throw new Error("A is too small for the given n.");
  if (n < 0) throw new Error("n must be non-negative.");
  if (n === 0) return AIsGpu ? {} : { A };

  if (!AIsGpu && A.length < (n - 1) * lda + n)
    throw new Error("A does not have enough elements for the given n and lda.");
  if (x.length < (n - 1) * incx + 1)
    throw new Error("x does not have enough elements for the given n and incx.");
  if (y.length < (n - 1) * incy + 1)
    throw new Error("y does not have enough elements for the given n and incy.");

  // GpuMatrix's own layout wins over the argument; A is symmetric, so column-major A reinterpreted row-major just flips which triangle is stored (no x/y swap needed — x*y^T+y*x^T is already symmetric under swapping them).
  const effLayout = AIsGpu ? A.layout : layout;
  const isLower = effLayout === "column-major" ? uplo === "upper" : uplo === "lower";

  const pipeline = await getPipeline(device, "ssyr2");

  let xBuffer = null;
  let yBuffer = null;
  let ABuffer = null;
  let paramsBuffer = null;

  try {
    xBuffer = xIsGpu ? x._buf : uploadBuffer(x, "ssyr2-x", false);
    yBuffer = yIsGpu ? y._buf : uploadBuffer(y, "ssyr2-y", false);
    ABuffer = AIsGpu ? A._buf : uploadBuffer(A, "ssyr2-A", true);
    paramsBuffer = createParamsBuffer(
      [
        { value: n,               type: "u32" },
        { value: alpha,           type: "f32" },
        { value: incx,            type: "u32" },
        { value: incy,            type: "u32" },
        { value: lda,             type: "u32" },
        { value: isLower ? 0 : 1, type: "u32" },
      ],
      "ssyr2-params",
    );

    const bindGroup = createBindGroup(pipeline.getBindGroupLayout(0), [
      xBuffer,
      yBuffer,
      ABuffer,
      paramsBuffer,
    ]);

    // One workgroup per row of A; clamped to device limit — the shader's
    // grid-stride loop handles remaining rows when n > dispatch count.
    const wgCount = Math.min(n, device.limits.maxComputeWorkgroupsPerDimension);
    const { commandEncoder, ts } = runComputePass(pipeline, bindGroup, wgCount);
    const readBuffer = AIsGpu ? null : stageReadback(commandEncoder, ABuffer);

    submit(commandEncoder);

    const gpuTimeMs = await extractTimestamp(ts);

    if (AIsGpu) {
      if (gpuTimeMs !== undefined) return { gpuTimeMs };
      return {};
    }

    const result = await extractResult(readBuffer, Float32Array);
    if (gpuTimeMs !== undefined) return { A: result, gpuTimeMs };
    return { A: result };
  } finally {
    if (!xIsGpu && xBuffer) destroyBuffers(xBuffer);
    if (!yIsGpu && yBuffer) destroyBuffers(yBuffer);
    if (!AIsGpu && ABuffer) destroyBuffers(ABuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
  }
}
