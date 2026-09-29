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
import { splitDoubleDouble, mergeDoubleDouble } from "../util/f64.mjs";
import { requireGpuDevice, requireSameDevice } from "../util/device.mjs";

// dsyr: A := alpha * x * x^T + A, double-double (Dekker) f64 emulation of
// ssyr — x, A, and alpha are each split into an f32 (hi, lo) pair; WGSL has
// no f64 type.
export async function dsyr(
  device,
  uplo,
  n,
  alpha,
  x,
  incx,
  A,
  lda,
  layout = "row-major",
) {
  const xIsGpu = x instanceof GpuVector;
  const AIsGpu = A instanceof GpuMatrix;

  requireGpuDevice(device);
  requireSameDevice(device, "dsyr", { A, x });
  if (uplo !== "lower" && uplo !== "upper")
    throw new Error("uplo must be 'lower' or 'upper'.");
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (!Number.isInteger(n) || !Number.isInteger(incx) || !Number.isInteger(lda))
    throw new Error("n, incx, and lda must be integers.");
  if (typeof alpha !== "number") throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
  if (incx <= 0) throw new Error("incx must be positive.");
  if (lda < n) throw new Error("lda must be >= n.");
  if (!AIsGpu && !(A instanceof Float64Array))
    throw new Error("A must be a Float64Array or GpuMatrix.");
  if (AIsGpu && A.dtype !== Float64Array)
    throw new Error("A must be a Float64Array-backed GpuMatrix.");
  if (!xIsGpu && !(x instanceof Float64Array))
    throw new Error("x must be a Float64Array or GpuVector.");
  if (xIsGpu && x.dtype !== Float64Array)
    throw new Error("x must be a Float64Array-backed GpuVector.");
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
  if (n === 0) return AIsGpu ? {} : { A };

  if (!AIsGpu && A.length < (n - 1) * lda + n)
    throw new Error("A does not have enough elements for the given n and lda.");
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );

  // GpuMatrix's own layout wins over the argument; A is symmetric, so column-major A reinterpreted row-major just flips which triangle is stored — flip uplo to match.
  const effLayout = AIsGpu ? A.layout : layout;
  const isLower =
    effLayout === "column-major" ? uplo === "upper" : uplo === "lower";

  const f64Deps = ["f64/dekker", "f64/utils/add", "f64/utils/multiply"];
  const pipeline = await getPipeline(device, [...f64Deps, "dsyr"], "dsyr_main");

  const { hi: alphaHi, lo: alphaLo } = splitDoubleDouble(
    new Float64Array([alpha]),
  );

  let xHiBuffer = null;
  let xLoBuffer = null;
  let AHiBuffer = null;
  let ALoBuffer = null;
  let paramsBuffer = null;
  let readHiBuffer = null;
  let readLoBuffer = null;

  try {
    if (xIsGpu) {
      xHiBuffer = x._buf;
      xLoBuffer = x._loBuf;
      AHiBuffer = A._buf;
      ALoBuffer = A._loBuf;
    } else {
      const xSplit = splitDoubleDouble(x);
      const ASplit = splitDoubleDouble(A);
      xHiBuffer = uploadBuffer(device, xSplit.hi, "dsyr-xHi", false);
      xLoBuffer = uploadBuffer(device, xSplit.lo, "dsyr-xLo", false);
      AHiBuffer = uploadBuffer(device, ASplit.hi, "dsyr-AHi", true);
      ALoBuffer = uploadBuffer(device, ASplit.lo, "dsyr-ALo", true);
    }
    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" },
        { value: alphaHi[0], type: "f32" },
        { value: alphaLo[0], type: "f32" },
        { value: incx, type: "u32" },
        { value: lda, type: "u32" },
        { value: isLower ? 0 : 1, type: "u32" },
      ],
      "dsyr-params",
    );

    const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [
      xHiBuffer,
      xLoBuffer,
      AHiBuffer,
      ALoBuffer,
      paramsBuffer,
    ]);

    // One workgroup per row of A; clamped to device limit — the shader's
    // grid-stride loop handles remaining rows when n > dispatch count.
    const wgCount = Math.min(n, device.limits.maxComputeWorkgroupsPerDimension);
    const { commandEncoder, ts } = runComputePass(
      device,
      pipeline,
      bindGroup,
      wgCount,
    );
    readHiBuffer = AIsGpu
      ? null
      : stageReadback(device, commandEncoder, AHiBuffer);
    readLoBuffer = AIsGpu
      ? null
      : stageReadback(device, commandEncoder, ALoBuffer);

    submit(device, commandEncoder);

    const gpuTimeMs = await extractTimestamp(ts);

    if (AIsGpu) {
      if (gpuTimeMs !== undefined) return { gpuTimeMs };
      return {};
    }

    const hi = await extractResult(readHiBuffer, Float32Array);
    readHiBuffer = null;
    const lo = await extractResult(readLoBuffer, Float32Array);
    readLoBuffer = null;
    const result = mergeDoubleDouble(hi, lo);
    if (gpuTimeMs !== undefined) return { A: result, gpuTimeMs };
    return { A: result };
  } finally {
    if (!xIsGpu && xHiBuffer) destroyBuffers(xHiBuffer);
    if (!xIsGpu && xLoBuffer) destroyBuffers(xLoBuffer);
    if (!AIsGpu && AHiBuffer) destroyBuffers(AHiBuffer);
    if (!AIsGpu && ALoBuffer) destroyBuffers(ALoBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (readHiBuffer) destroyBuffers(readHiBuffer);
    if (readLoBuffer) destroyBuffers(readLoBuffer);
  }
}
