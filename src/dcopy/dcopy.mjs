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
import { splitDoubleDouble, mergeDoubleDouble } from "../util/f64.mjs";
import { requireGpuDevice, requireSameDevice } from "../util/device.mjs";

// dcopy: y := x, double-double (Dekker) f64 emulation of scopy — x and y are
// each split into an f32 (hi, lo) pair; WGSL has no f64 type. Unlike
// dscal/daxpy/ddot, a copy has no arithmetic at all, so it needs no Dekker
// shader dependencies (dekker.wgsl/add.wgsl/multiply.wgsl) — dcopy.wgsl is
// entirely self-contained.
export async function dcopy(device, n, x, incx, y, incy) {
  const xIsGpu = x instanceof GpuVector;
  const yIsGpu = y instanceof GpuVector;

  requireGpuDevice(device);
  requireSameDevice(device, "dcopy", { x, y });
  if (
    !Number.isInteger(n) ||
    !Number.isInteger(incx) ||
    !Number.isInteger(incy)
  )
    throw new Error("n, incx, and incy must be integers.");
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
  if (n <= 0) return yIsGpu ? {} : { y };
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  if (y.length < (n - 1) * incy + 1)
    throw new Error(
      "y does not have enough elements for the given n and incy.",
    );

  const pipeline = await getPipeline(device, "dcopy");

  let xHiBuffer = null;
  let xLoBuffer = null;
  let yHiBuffer = null;
  let yLoBuffer = null;
  let paramsBuffer = null;
  let readHiBuffer = null;
  let readLoBuffer = null;

  try {
    if (xIsGpu) {
      xHiBuffer = x._buf;
      xLoBuffer = x._loBuf;
      yHiBuffer = y._buf;
      yLoBuffer = y._loBuf;
    } else {
      const xSplit = splitDoubleDouble(x);
      const ySplit = splitDoubleDouble(y);
      xHiBuffer = uploadBuffer(device, xSplit.hi, "dcopy-xHi", false);
      xLoBuffer = uploadBuffer(device, xSplit.lo, "dcopy-xLo", false);
      yHiBuffer = uploadBuffer(device, ySplit.hi, "dcopy-yHi", true);
      yLoBuffer = uploadBuffer(device, ySplit.lo, "dcopy-yLo", true);
    }
    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" },
        { value: incx, type: "u32" },
        { value: incy, type: "u32" },
      ],
      "dcopy-params",
    );

    const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [
      xHiBuffer,
      xLoBuffer,
      yHiBuffer,
      yLoBuffer,
      paramsBuffer,
    ]);
    const { commandEncoder, ts } = runComputePass(
      device,
      pipeline,
      bindGroup,
      calcWorkgroups(device, n),
    );
    readHiBuffer = yIsGpu
      ? null
      : stageReadback(device, commandEncoder, yHiBuffer);
    readLoBuffer = yIsGpu
      ? null
      : stageReadback(device, commandEncoder, yLoBuffer);

    submit(device, commandEncoder);

    const gpuTimeMs = await extractTimestamp(ts);

    if (yIsGpu) {
      // xIsGpu === yIsGpu, enforced above
      if (gpuTimeMs !== undefined) return { gpuTimeMs };
      return {};
    }

    const hi = await extractResult(readHiBuffer, Float32Array);
    readHiBuffer = null; // extractResult already destroyed it
    const lo = await extractResult(readLoBuffer, Float32Array);
    readLoBuffer = null;
    const result = mergeDoubleDouble(hi, lo);
    if (gpuTimeMs !== undefined) return { y: result, gpuTimeMs };
    return { y: result };
  } finally {
    if (!xIsGpu && xHiBuffer) destroyBuffers(xHiBuffer);
    if (!xIsGpu && xLoBuffer) destroyBuffers(xLoBuffer);
    if (!yIsGpu && yHiBuffer) destroyBuffers(yHiBuffer);
    if (!yIsGpu && yLoBuffer) destroyBuffers(yLoBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    // Only reached if extractTimestamp or extractResult threw before
    // clearing these — on the success path they're already null.
    if (readHiBuffer) destroyBuffers(readHiBuffer);
    if (readLoBuffer) destroyBuffers(readLoBuffer);
  }
}
