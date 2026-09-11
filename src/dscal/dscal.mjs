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

// dscal: x := alpha * x, double-double (Dekker) f64 emulation of sscal — x
// and alpha are each split into an f32 (hi, lo) pair; WGSL has no f64 type.
export async function dscal(device, n, alpha, x, incx) {
  const xIsGpu = x instanceof GpuVector;

  requireGpuDevice(device);
  if (!Number.isInteger(n) || !Number.isInteger(incx))
    throw new Error("n and incx must be integers.");
  if (typeof alpha !== "number") throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
  if (!(x instanceof Float64Array) && !xIsGpu)
    throw new Error("x must be a Float64Array or GpuVector.");
  if (xIsGpu && x.dtype !== Float64Array)
    throw new Error("x must be a Float64Array-backed GpuVector.");
  if (incx <= 0) throw new Error("incx must be positive.");
  requireSameDevice(device, "dscal", { x });
  if (n <= 0) return xIsGpu ? {} : { x };
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );

  // Concatenated with f64/dekker.wgsl (DD struct), f64/utils/add.wgsl
  // (fsub/negf/fastTwoSumProtected), and f64/utils/multiply.wgsl
  // (ddMulProtected) — WGSL has no #include.
  const f64Deps = ["f64/dekker", "f64/utils/add", "f64/utils/multiply"];
  const pipeline = await getPipeline(device, [...f64Deps, "dscal"]);

  const { hi: alphaHi, lo: alphaLo } = splitDoubleDouble(
    new Float64Array([alpha]),
  );

  let xHiBuffer = null;
  let xLoBuffer = null;
  let paramsBuffer = null;
  let readHiBuffer = null;
  let readLoBuffer = null;

  try {
    if (xIsGpu) {
      xHiBuffer = x._buf;
      xLoBuffer = x._loBuf;
    } else {
      const { hi, lo } = splitDoubleDouble(x);
      xHiBuffer = uploadBuffer(device, hi, "dscal-xHi", true);
      xLoBuffer = uploadBuffer(device, lo, "dscal-xLo", true);
    }
    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" },
        { value: alphaHi[0], type: "f32" },
        { value: alphaLo[0], type: "f32" },
        { value: incx, type: "u32" },
      ],
      "dscal-params",
    );

    const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [
      xHiBuffer,
      xLoBuffer,
      paramsBuffer,
    ]);
    const { commandEncoder, ts } = runComputePass(
      device,
      pipeline,
      bindGroup,
      calcWorkgroups(device, n),
    );
    readHiBuffer = xIsGpu
      ? null
      : stageReadback(device, commandEncoder, xHiBuffer);
    readLoBuffer = xIsGpu
      ? null
      : stageReadback(device, commandEncoder, xLoBuffer);

    submit(device, commandEncoder);

    const gpuTimeMs = await extractTimestamp(ts);

    if (xIsGpu) {
      if (gpuTimeMs !== undefined) return { gpuTimeMs };
      return {};
    }

    const hi = await extractResult(readHiBuffer, Float32Array);
    readHiBuffer = null; // extractResult already destroyed it
    const lo = await extractResult(readLoBuffer, Float32Array);
    readLoBuffer = null;
    const result = mergeDoubleDouble(hi, lo);
    if (gpuTimeMs !== undefined) return { x: result, gpuTimeMs };
    return { x: result };
  } finally {
    if (!xIsGpu && xHiBuffer) destroyBuffers(xHiBuffer);
    if (!xIsGpu && xLoBuffer) destroyBuffers(xLoBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    // Only reached if extractTimestamp or extractResult threw before
    // clearing these — on the success path they're already null.
    if (readHiBuffer) destroyBuffers(readHiBuffer);
    if (readLoBuffer) destroyBuffers(readLoBuffer);
  }
}
