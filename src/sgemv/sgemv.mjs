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
import { requireWorkgroups } from "../util/workgroup.mjs";
import { GpuVector } from "../classes/GpuVector.mjs";
import { GpuMatrix } from "../classes/GpuMatrix.mjs";

export async function sgemv(device, trans, m, n, alpha, A, lda, x, incx, beta, y, incy, layout = "row-major") {
  const AIsGpu = A instanceof GpuMatrix;
  const xIsGpu = x instanceof GpuVector;
  const yIsGpu = y instanceof GpuVector;

  if (!(device instanceof GPUDevice))
    throw new Error("device must be a GPUDevice.");
  if (trans !== "no-transpose" && trans !== "transpose")
    throw new Error("trans must be 'no-transpose' or 'transpose'.");
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (typeof alpha !== "number")
    throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
  if (typeof beta !== "number")
    throw new Error("beta must be a number.");
  if (Number.isNaN(beta)) throw new Error("beta must not be NaN.");
  if (!Number.isFinite(beta)) throw new Error("beta must be finite.");
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
  if (AIsGpu && !xIsGpu)
    throw new Error(
      "x and y must be GpuVectors when A is a GpuMatrix.",
    );
  if (xIsGpu && x._buf === y._buf)
    throw new Error("x and y must not reference the same GPU buffer when both are GpuVectors.");
  if (AIsGpu && yIsGpu && A._buf === y._buf)
    throw new Error("A and y must not reference the same GPU buffer.");
  if (AIsGpu && lda !== A.lda)
    throw new Error("lda must match A.lda when A is a GpuMatrix.");
  if (AIsGpu && (A.rows < m || A.cols < n))
    throw new Error("A is too small for the given m and n.");
  if (m < 0 || n < 0) throw new Error("m and n must be non-negative.");
  if (m === 0 || n === 0) return yIsGpu ? {} : { y };

  // Column-major A reinterpreted row-major is A^T — swap to the kernel's
  // view of m/n/trans now that the shape checks above are done.
  const effLayout = AIsGpu ? A.layout : layout;
  if (effLayout === "column-major") {
    [m, n] = [n, m];
    trans = trans === "no-transpose" ? "transpose" : "no-transpose";
  }
  const isNoTrans = trans === "no-transpose";

  // NoTrans: x has n elements, y has m elements; Trans: x has m elements, y has n elements.
  const xLen = isNoTrans ? n : m;
  const yLen = isNoTrans ? m : n;

  if (lda < n) throw new Error("lda must be >= n.");
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

  let ABuffer = null;
  let xBuffer = null;
  let yBuffer = null;
  let paramsBuffer = null;

  try {
    ABuffer = AIsGpu ? A._buf : uploadBuffer(A, "sgemv-A", false);
    xBuffer = xIsGpu ? x._buf : uploadBuffer(x, "sgemv-x", false);
    yBuffer = yIsGpu ? y._buf : uploadBuffer(y, "sgemv-y", true);
    paramsBuffer = createParamsBuffer(
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

    const bindGroup = createBindGroup(pipeline.getBindGroupLayout(0), [
      ABuffer,
      xBuffer,
      yBuffer,
      paramsBuffer,
    ]);

    // NoTrans: one workgroup per row — sgemv_n.wgsl is a grid-stride loop, so
    // clamping here only costs parallelism. Trans: one thread per output
    // column, and sgemv_t.wgsl indexes straight off global_invocation_id with
    // no fallback, so an over-limit dispatch must be refused, not truncated.
    const wgCount = isNoTrans
      ? Math.min(m, device.limits.maxComputeWorkgroupsPerDimension)
      : requireWorkgroups("sgemv", yLen);
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
