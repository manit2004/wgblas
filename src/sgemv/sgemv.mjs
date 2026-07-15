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
import { calcWorkgroups } from "../util/workgroup.mjs";
import { GpuVector } from "../classes/GpuVector.mjs";
import { GpuMatrix } from "../classes/GpuMatrix.mjs";

export async function sgemv(device, trans, m, n, alpha, A, lda, x, incx, beta, y, incy) {
  const xIsGpu = x instanceof GpuVector;
  const yIsGpu = y instanceof GpuVector;
  const AIsGpu = A instanceof GpuMatrix;
  const isNoTrans = trans === "no-transpose";

  if (!(device instanceof GPUDevice))
    throw new Error("device must be a GPUDevice.");
  if (!isNoTrans && trans !== "transpose")
    throw new Error("trans must be 'no-transpose' or 'transpose'.");
  if (
    !Number.isInteger(m) ||
    !Number.isInteger(n) ||
    !Number.isInteger(incx) ||
    !Number.isInteger(incy) ||
    !Number.isInteger(lda)
  )
    throw new Error("m, n, incx, incy, and lda must be integers.");
  if (isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!isFinite(alpha)) throw new Error("alpha must be finite.");
  if (isNaN(beta)) throw new Error("beta must not be NaN.");
  if (!isFinite(beta)) throw new Error("beta must be finite.");
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
    throw new Error(
      "A must be a GpuMatrix when x and y are GpuVectors.",
    );
  if (AIsGpu && lda !== A.lda)
    throw new Error("lda must match A.lda when A is a GpuMatrix.");
  if (AIsGpu && (A.rows < m || A.cols < n))
    throw new Error("A is too small for the given m and n.");
  if (m <= 0 || n <= 0) return yIsGpu ? {} : { y };

  // NoTrans: x has n elements, y has m elements
  // Trans:   x has m elements, y has n elements
  const xLen = isNoTrans ? n : m;
  const yLen = isNoTrans ? m : n;

  if (!AIsGpu && A.length < (m - 1) * lda + n)
    throw new Error(
      "A does not have enough elements for the given m, n, and lda.",
    );
  if (x.length < (xLen - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given dimensions and incx.",
    );
  if (y.length < (yLen - 1) * incy + 1)
    throw new Error(
      "y does not have enough elements for the given dimensions and incy.",
    );

  const shaderName = isNoTrans ? "sgemv_n" : "sgemv_t";
  const pipeline   = await getPipeline(device, shaderName);

  const ABuffer = AIsGpu ? A._buf : uploadBuffer(A, "sgemv-A", false);
  const xBuffer = xIsGpu ? x._buf : uploadBuffer(x, "sgemv-x", false);
  const yBuffer = yIsGpu ? y._buf : uploadBuffer(y, "sgemv-y", true);
  const paramsBuffer = createParamsBuffer(
    [
      { value: m,     type: "u32" },
      { value: n,     type: "u32" },
      { value: alpha, type: "f32" },
      { value: beta,  type: "f32" },
      { value: incx,  type: "u32" },
      { value: incy,  type: "u32" },
      { value: lda,   type: "u32" },
    ],
    "sgemv-params",
  );

  try {
    const bindGroup = createBindGroup(pipeline.getBindGroupLayout(0), [
      ABuffer,
      xBuffer,
      yBuffer,
      paramsBuffer,
    ]);

    // NoTrans: one workgroup per row; clamped to device limit — the shader's
    // grid-stride loop handles remaining rows when m > dispatch count.
    // Trans:   one thread per output column → dispatch ceil(n/64)
    const wgCount = isNoTrans
      ? Math.min(m, device.limits.maxComputeWorkgroupsPerDimension)
      : calcWorkgroups(yLen);
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
    if (!AIsGpu) destroyBuffers(ABuffer);
    if (!xIsGpu) destroyBuffers(xBuffer);
    if (!yIsGpu) destroyBuffers(yBuffer);
    destroyBuffers(paramsBuffer);

  }
}
