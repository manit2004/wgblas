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
import { requireSameDevice } from "../util/device.mjs";

export async function sscal(device, n, alpha, x, incx) {
  const xIsGpu = x instanceof GpuVector;

  if (!(device instanceof GPUDevice))
    throw new Error("device must be a GPUDevice.");
  requireSameDevice(device, "sscal", { x });
  if (!Number.isInteger(n) || !Number.isInteger(incx))
    throw new Error("n and incx must be integers.");
  if (typeof alpha !== "number")
    throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
  if (incx <= 0) throw new Error("incx must be positive.");
  if (!(x instanceof Float32Array) && !(x instanceof GpuVector))
    throw new Error("x must be a Float32Array or GpuVector.");
  if (n <= 0) return xIsGpu ? {} : { x };
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );

  const pipeline = await getPipeline(device, "sscal");

  let xBuffer = null;
  let paramsBuffer = null;
  let readBuffer = null;

  try {
    xBuffer = xIsGpu ? x._buf : uploadBuffer(device, x, "sscal-x", true);
    paramsBuffer = createParamsBuffer(device,
      [
        { value: n, type: "u32" },
        { value: alpha, type: "f32" },
        { value: incx, type: "u32" },
      ],
      "sscal-params",
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

    const result = await extractResult(readBuffer, Float32Array);
    readBuffer = null; // extractResult already destroyed it
    if (gpuTimeMs !== undefined) return { x: result, gpuTimeMs };
    return { x: result };
  } finally {
    if (!xIsGpu && xBuffer) destroyBuffers(xBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    // Only reached if extractTimestamp threw before extractResult ran.
    if (readBuffer) destroyBuffers(readBuffer);
  }
}
