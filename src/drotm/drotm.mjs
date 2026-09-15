import {
  uploadBuffer,
  createParamsBuffer,
  stageReadback,
  destroyBuffers,
} from "../util/buffer.mjs";
import { createBindGroup } from "../util/bindgroup.mjs";
import { runComputePass, submit } from "../util/compute.mjs";
import { extractTimestamp } from "../util/benchmark.mjs";
import { extractResult } from "../util/result.mjs";
import { getPipeline } from "../util/pipeline.mjs";
import { calcWorkgroups } from "../util/workgroup.mjs";
import { GpuVector } from "../classes/GpuVector.mjs";
import { splitDoubleDouble, mergeDoubleDouble } from "../util/f64.mjs";
import { requireGpuDevice, requireSameDevice } from "../util/device.mjs";

// drotm: applies a modified Givens rotation H to vectors x and y —
// double-double (Dekker) f64 emulation of srotm. x, y, and every entry of
// param are each split into an f32 (hi, lo) pair; WGSL has no f64 type.
export async function drotm(device, n, x, incx, y, incy, param) {
  const xIsGpu = x instanceof GpuVector;
  const yIsGpu = y instanceof GpuVector;

  requireGpuDevice(device);
  requireSameDevice(device, "drotm", { x, y });
  if (
    !Number.isInteger(n) ||
    !Number.isInteger(incx) ||
    !Number.isInteger(incy)
  )
    throw new Error("n, incx, and incy must be integers.");
  if (!(param instanceof Float64Array) || param.length !== 5)
    throw new Error("param must be a Float64Array of length 5.");
  if (param[0] !== -2 && param[0] !== -1 && param[0] !== 0 && param[0] !== 1)
    throw new Error("param[0] (flag) must be one of -2, -1, 0, or 1.");
  if (incx <= 0 || incy <= 0)
    throw new Error("incx and incy must be positive.");
  if (!(x instanceof Float64Array) && !xIsGpu)
    throw new Error("x must be a Float64Array or GpuVector.");
  if (!(y instanceof Float64Array) && !yIsGpu)
    throw new Error("y must be a Float64Array or GpuVector.");
  if (xIsGpu && x.dtype !== Float64Array)
    throw new Error("x must be a Float64Array-backed GpuVector.");
  if (yIsGpu && y.dtype !== Float64Array)
    throw new Error("y must be a Float64Array-backed GpuVector.");
  if (xIsGpu !== yIsGpu)
    throw new Error(
      "x and y must be the same type (both Float64Array or both GpuVector).",
    );
  if (n <= 0 || param[0] === -2.0) return xIsGpu ? {} : { x, y };
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  if (y.length < (n - 1) * incy + 1)
    throw new Error(
      "y does not have enough elements for the given n and incy.",
    );

  // Concatenated with f64/dekker.wgsl (DD struct), f64/utils/add.wgsl
  // (fsub/negf/fastTwoSumProtected/ddAddProtected), and f64/utils/multiply.wgsl
  // (ddMulProtected) — WGSL has no #include.
  const f64Deps = ["f64/dekker", "f64/utils/add", "f64/utils/multiply"];
  const pipeline = await getPipeline(device, [...f64Deps, "drotm"]);

  const { hi: paramHi, lo: paramLo } = splitDoubleDouble(param);

  let xHiBuffer = null;
  let xLoBuffer = null;
  let yHiBuffer = null;
  let yLoBuffer = null;
  let paramHiBuffer = null;
  let paramLoBuffer = null;
  let paramsBuffer = null;
  let xReadHiBuffer = null;
  let xReadLoBuffer = null;
  let yReadHiBuffer = null;
  let yReadLoBuffer = null;

  try {
    if (xIsGpu) {
      xHiBuffer = x._buf;
      xLoBuffer = x._loBuf;
      yHiBuffer = y._buf;
      yLoBuffer = y._loBuf;
    } else {
      const xSplit = splitDoubleDouble(x);
      const ySplit = splitDoubleDouble(y);
      xHiBuffer = uploadBuffer(device, xSplit.hi, "drotm-xHi", true);
      xLoBuffer = uploadBuffer(device, xSplit.lo, "drotm-xLo", true);
      yHiBuffer = uploadBuffer(device, ySplit.hi, "drotm-yHi", true);
      yLoBuffer = uploadBuffer(device, ySplit.lo, "drotm-yLo", true);
    }
    paramHiBuffer = uploadBuffer(device, paramHi, "drotm-paramHi", false);
    paramLoBuffer = uploadBuffer(device, paramLo, "drotm-paramLo", false);
    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" },
        { value: incx, type: "u32" },
        { value: incy, type: "u32" },
      ],
      "drotm-params",
    );

    const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [
      xHiBuffer,
      xLoBuffer,
      yHiBuffer,
      yLoBuffer,
      paramHiBuffer,
      paramLoBuffer,
      paramsBuffer,
    ]);
    const { commandEncoder, ts } = runComputePass(
      device,
      pipeline,
      bindGroup,
      calcWorkgroups(device, n),
    );
    xReadHiBuffer = xIsGpu
      ? null
      : stageReadback(device, commandEncoder, xHiBuffer);
    xReadLoBuffer = xIsGpu
      ? null
      : stageReadback(device, commandEncoder, xLoBuffer);
    yReadHiBuffer = yIsGpu
      ? null
      : stageReadback(device, commandEncoder, yHiBuffer);
    yReadLoBuffer = yIsGpu
      ? null
      : stageReadback(device, commandEncoder, yLoBuffer);

    submit(device, commandEncoder);

    const gpuTimeMs = await extractTimestamp(ts);

    if (xIsGpu) {
      // xIsGpu === yIsGpu, enforced above
      if (gpuTimeMs !== undefined) return { gpuTimeMs };
      return {};
    }

    const xHi = await extractResult(xReadHiBuffer, Float32Array);
    xReadHiBuffer = null; // extractResult already destroyed it
    const xLo = await extractResult(xReadLoBuffer, Float32Array);
    xReadLoBuffer = null;
    const yHi = await extractResult(yReadHiBuffer, Float32Array);
    yReadHiBuffer = null;
    const yLo = await extractResult(yReadLoBuffer, Float32Array);
    yReadLoBuffer = null;
    const resultX = mergeDoubleDouble(xHi, xLo);
    const resultY = mergeDoubleDouble(yHi, yLo);
    if (gpuTimeMs !== undefined) return { x: resultX, y: resultY, gpuTimeMs };
    return { x: resultX, y: resultY };
  } finally {
    if (!xIsGpu && xHiBuffer) destroyBuffers(xHiBuffer);
    if (!xIsGpu && xLoBuffer) destroyBuffers(xLoBuffer);
    if (!yIsGpu && yHiBuffer) destroyBuffers(yHiBuffer);
    if (!yIsGpu && yLoBuffer) destroyBuffers(yLoBuffer);
    if (paramHiBuffer) destroyBuffers(paramHiBuffer);
    if (paramLoBuffer) destroyBuffers(paramLoBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    // Only reached if extractTimestamp or extractResult threw before
    // clearing these — on the success path they're already null.
    if (xReadHiBuffer) destroyBuffers(xReadHiBuffer);
    if (xReadLoBuffer) destroyBuffers(xReadLoBuffer);
    if (yReadHiBuffer) destroyBuffers(yReadHiBuffer);
    if (yReadLoBuffer) destroyBuffers(yReadLoBuffer);
  }
}
