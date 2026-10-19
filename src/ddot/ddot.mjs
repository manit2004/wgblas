import {
  createStorageBuffer,
  createParamsBuffer,
  createResultBuffer,
  stageReadback,
  destroyBuffers,
  uploadBuffer,
} from "../util/buffer.mjs";
import { createBindGroup } from "../util/bindgroup.mjs";
import { runComputePasses, submit } from "../util/compute.mjs";
import { extractTimestamp } from "../util/benchmark.mjs";
import { extractResult } from "../util/result.mjs";
import { getPipeline } from "../util/pipeline.mjs";
import { GpuVector } from "../classes/GpuVector.mjs";
import { splitDoubleDouble, mergeDoubleDouble } from "../util/f64.mjs";
import { WGS } from "../util/constants.mjs";
import { requireGpuDevice, requireSameDevice } from "../util/device.mjs";

export async function ddot(device, n, x, incx, y, incy) {
  const xIsGpu = x instanceof GpuVector;
  const yIsGpu = y instanceof GpuVector;

  requireGpuDevice(device);
  requireSameDevice(device, "ddot", { x, y });
  if (
    !Number.isInteger(n) ||
    !Number.isInteger(incx) ||
    !Number.isInteger(incy)
  )
    throw new Error("n, incx, and incy must be integers.");
  if (incx <= 0 || incy <= 0)
    throw new Error("incx and incy must be positive.");
  if (!xIsGpu && !(x instanceof Float64Array))
    throw new Error("x must be a Float64Array or GpuVector.");
  if (!yIsGpu && !(y instanceof Float64Array))
    throw new Error("y must be a Float64Array or GpuVector.");
  if (xIsGpu && x.dtype !== Float64Array)
    throw new Error("x must be a Float64Array-backed GpuVector.");
  if (yIsGpu && y.dtype !== Float64Array)
    throw new Error("y must be a Float64Array-backed GpuVector.");
  if (xIsGpu !== yIsGpu)
    throw new Error(
      "x and y must be the same type (both Float64Array or both GpuVector).",
    );
  if (n <= 0) return { dot: 0 };
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  if (y.length < (n - 1) * incy + 1)
    throw new Error(
      "y does not have enough elements for the given n and incy.",
    );

  // Concatenated with f64/dekker.wgsl (DD struct) and f64/utils/add.wgsl
  // (ddAddProtected) — WGSL has no #include; entryPoint omitted since each
  // module has only one @compute. Only the first pass multiplies, so
  // f64/utils/multiply.wgsl is left out of the reduction's module.
  const ddCore = ["f64/dekker", "f64/utils/add"];
  const pipelineMain = await getPipeline(device, [
    ...ddCore,
    "f64/utils/multiply",
    "ddot",
  ]);
  const pipelineReduce = await getPipeline(device, [
    ...ddCore,
    "reduction/sumF64",
  ]);

  let xHiBuffer = null;
  let xLoBuffer = null;
  let yHiBuffer = null;
  let yLoBuffer = null;
  let partialsHiBuffer = null;
  let partialsLoBuffer = null;
  let resultHiBuffer = null;
  let resultLoBuffer = null;
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
      // No abs here (unlike dasum) — the product carries its own sign.
      const xSplit = splitDoubleDouble(x);
      const ySplit = splitDoubleDouble(y);
      xHiBuffer = uploadBuffer(device, xSplit.hi, "ddot-xHi", false);
      xLoBuffer = uploadBuffer(device, xSplit.lo, "ddot-xLo", false);
      yHiBuffer = uploadBuffer(device, ySplit.hi, "ddot-yHi", false);
      yLoBuffer = uploadBuffer(device, ySplit.lo, "ddot-yLo", false);
    }
    partialsHiBuffer = createStorageBuffer(
      device,
      2 * WGS * 4,
      "ddot-partialsHi",
    );
    partialsLoBuffer = createStorageBuffer(
      device,
      2 * WGS * 4,
      "ddot-partialsLo",
    );
    resultHiBuffer = createResultBuffer(device, 4, "ddot-result-hi");
    resultLoBuffer = createResultBuffer(device, 4, "ddot-result-lo");
    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" },
        { value: incx, type: "u32" },
        { value: incy, type: "u32" },
      ],
      "ddot-params",
    );

    const bgMain = createBindGroup(device, pipelineMain.getBindGroupLayout(0), [
      xHiBuffer,
      xLoBuffer,
      yHiBuffer,
      yLoBuffer,
      partialsHiBuffer,
      partialsLoBuffer,
      paramsBuffer,
    ]);
    const bgReduce = createBindGroup(
      device,
      pipelineReduce.getBindGroupLayout(0),
      [partialsHiBuffer, partialsLoBuffer, resultHiBuffer, resultLoBuffer],
    );
    // Both passes on one command buffer and one submit, timed as one span:
    // a second submission costs another full dispatch floor (~5 µs of GPU
    // time and ~100 µs of host time at small n).
    const { commandEncoder: encoder, ts } = runComputePasses(device, [
      { pipeline: pipelineMain, bindGroup: bgMain, workgroups: 2 * WGS },
      { pipeline: pipelineReduce, bindGroup: bgReduce, workgroups: 1 },
    ]);
    readHiBuffer = stageReadback(device, encoder, resultHiBuffer);
    readLoBuffer = stageReadback(device, encoder, resultLoBuffer);

    submit(device, encoder);

    const hiPromise = extractResult(readHiBuffer, Float32Array);
    const loPromise = extractResult(readLoBuffer, Float32Array);
    readHiBuffer = null; // ownership transferred — extractResult's own finally destroys it
    readLoBuffer = null;

    const [gpuTimeMs, hiArr, loArr] = await Promise.all([
      extractTimestamp(ts),
      hiPromise,
      loPromise,
    ]);

    // dot is always a scalar readback — both paths return { dot }
    const dot = mergeDoubleDouble(hiArr, loArr)[0];
    if (gpuTimeMs !== undefined) return { dot, gpuTimeMs };
    return { dot };
  } finally {
    if (!xIsGpu && xHiBuffer) destroyBuffers(xHiBuffer);
    if (!xIsGpu && xLoBuffer) destroyBuffers(xLoBuffer);
    if (!yIsGpu && yHiBuffer) destroyBuffers(yHiBuffer);
    if (!yIsGpu && yLoBuffer) destroyBuffers(yLoBuffer);
    if (partialsHiBuffer) destroyBuffers(partialsHiBuffer);
    if (partialsLoBuffer) destroyBuffers(partialsLoBuffer);
    if (resultHiBuffer) destroyBuffers(resultHiBuffer);
    if (resultLoBuffer) destroyBuffers(resultLoBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    // Only reached if submit(device, encoder) threw before ownership was transferred above.
    if (readHiBuffer) destroyBuffers(readHiBuffer);
    if (readLoBuffer) destroyBuffers(readLoBuffer);
  }
}
