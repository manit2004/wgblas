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

export async function sger(device, m, n, alpha, x, incx, y, incy, A, lda, layout = "row-major") {
  const AIsGpu = A instanceof GpuMatrix;

  if (!(device instanceof GPUDevice))
    throw new Error("device must be a GPUDevice.");
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (typeof alpha !== "number")
    throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
  if (
    !Number.isInteger(m) ||
    !Number.isInteger(n) ||
    !Number.isInteger(incx) ||
    !Number.isInteger(incy) ||
    !Number.isInteger(lda)
  )
    throw new Error("m, n, incx, incy, and lda must be integers.");
  if (incx <= 0 || incy <= 0)
    throw new Error("incx and incy must be positive.");
  if (!AIsGpu && !(A instanceof Float32Array))
    throw new Error("A must be a Float32Array or GpuMatrix.");
  if (AIsGpu && lda !== A.lda)
    throw new Error("lda must match A.lda when A is a GpuMatrix.");
  // A.rows/A.cols are fixed regardless of layout — check against original m/n before the swap below.
  if (AIsGpu && (A.rows < m || A.cols < n))
    throw new Error("A is too small for the given m and n.");

  // GpuMatrix's own layout wins over the argument; column-major A reinterpreted row-major is A^T, so swap x/y and m/n to reproduce it (transpose of a rank-1 update swaps its two vectors).
  const effLayout = AIsGpu ? A.layout : layout;
  if (effLayout === "column-major") {
    [m, n] = [n, m];
    [x, y] = [y, x];
    [incx, incy] = [incy, incx];
  }

  const xIsGpu = x instanceof GpuVector;
  const yIsGpu = y instanceof GpuVector;

  if (lda < n) throw new Error("lda must be >= n.");
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
  if (AIsGpu && xIsGpu && A._buf === x._buf)
    throw new Error("A and x must not reference the same GPU buffer.");
  if (AIsGpu && yIsGpu && A._buf === y._buf)
    throw new Error("A and y must not reference the same GPU buffer.");
  if (m < 0 || n < 0) throw new Error("m and n must be non-negative.");
  if (m === 0 || n === 0) return AIsGpu ? {} : { A };

  if (!AIsGpu && A.length < (m - 1) * lda + n)
    throw new Error(
      "A does not have enough elements for the given m, n, and lda.",
    );
  if (x.length < (m - 1) * incx + 1)
    throw new Error("x does not have enough elements for the given m and incx.");
  if (y.length < (n - 1) * incy + 1)
    throw new Error("y does not have enough elements for the given n and incy.");

  const pipeline = await getPipeline(device, "sger");

  let xBuffer = null;
  let yBuffer = null;
  let ABuffer = null;
  let paramsBuffer = null;

  try {
    xBuffer = xIsGpu ? x._buf : uploadBuffer(x, "sger-x", false);
    yBuffer = yIsGpu ? y._buf : uploadBuffer(y, "sger-y", false);
    ABuffer = AIsGpu ? A._buf : uploadBuffer(A, "sger-A", true);
    paramsBuffer = createParamsBuffer(
      [
        { value: m,     type: "u32" },
        { value: n,     type: "u32" },
        { value: alpha, type: "f32" },
        { value: incx,  type: "u32" },
        { value: incy,  type: "u32" },
        { value: lda,   type: "u32" },
      ],
      "sger-params",
    );

    const bindGroup = createBindGroup(pipeline.getBindGroupLayout(0), [
      xBuffer,
      yBuffer,
      ABuffer,
      paramsBuffer,
    ]);

    // One workgroup per row of A; clamped to device limit — the shader's
    // grid-stride loop handles remaining rows when m > dispatch count.
    const wgCount = Math.min(m, device.limits.maxComputeWorkgroupsPerDimension);
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
