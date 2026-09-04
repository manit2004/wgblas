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
import { Complex32, Complex32Array } from "../classes/Complex32.mjs";
import { interleaveComplex32 } from "../util/complex.mjs";
import { requireSameDevice } from "../util/device.mjs";

// cscal: x := alpha * x, complex. alpha is a Complex32; x is a Complex32Array
// or a Complex32Array-backed GpuVector, interleaved [re0, im0, re1, im1, ...]
// to match cscal.wgsl's single buffer.
export async function cscal(device, n, alpha, x, incx) {
  const xIsGpu = x instanceof GpuVector;

  if (!(device instanceof GPUDevice))
    throw new Error("device must be a GPUDevice.");
  requireSameDevice(device, "cscal", { x });
  if (!Number.isInteger(n) || !Number.isInteger(incx))
    throw new Error("n and incx must be integers.");
  if (!(alpha instanceof Complex32))
    throw new Error("alpha must be a Complex32.");
  if (Number.isNaN(alpha.re) || Number.isNaN(alpha.im))
    throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha.re) || !Number.isFinite(alpha.im))
    throw new Error("alpha must be finite.");
  if (incx <= 0) throw new Error("incx must be positive.");
  if (!(x instanceof Complex32Array) && !xIsGpu)
    throw new Error("x must be a Complex32Array or GpuVector.");
  if (xIsGpu && x.dtype !== Complex32Array)
    throw new Error("x must be a Complex32Array-backed GpuVector.");
  if (n <= 0) return xIsGpu ? {} : { x };
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );

  const pipeline = await getPipeline(device, "cscal");

  let xBuffer = null;
  let paramsBuffer = null;
  let readBuffer = null;

  try {
    xBuffer = xIsGpu ? x._buf : uploadBuffer(device, interleaveComplex32(x), "cscal-x", true);
    paramsBuffer = createParamsBuffer(device,
      [
        { value: n,        type: "u32" },
        { value: alpha.re, type: "f32" },
        { value: alpha.im, type: "f32" },
        { value: incx,     type: "u32" },
      ],
      "cscal-params",
    );

    const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [
      xBuffer,
      paramsBuffer,
    ]);
    const { commandEncoder, ts } = runComputePass(device,
      pipeline,
      bindGroup,
      calcWorkgroups(device, n),
    );
    readBuffer = xIsGpu ? null : stageReadback(device, commandEncoder, xBuffer);

    submit(device, commandEncoder);

    const gpuTimeMs = await extractTimestamp(ts);

    if (xIsGpu) {
      if (gpuTimeMs !== undefined) return { gpuTimeMs };
      return {};
    }

    const flat = await extractResult(readBuffer, Float32Array);
    readBuffer = null; // extractResult already destroyed it
    const result = new Complex32Array(flat);
    if (gpuTimeMs !== undefined) return { x: result, gpuTimeMs };
    return { x: result };
  } finally {
    if (!xIsGpu && xBuffer) destroyBuffers(xBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    // Only reached if extractTimestamp threw before extractResult ran.
    if (readBuffer) destroyBuffers(readBuffer);
  }
}
