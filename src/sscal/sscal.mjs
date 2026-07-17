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

export async function sscal(device, n, alpha, x, incx) {
  const xIsGpu = x instanceof GpuVector;
  
  if (!(device instanceof GPUDevice))
    throw new Error("device must be a GPUDevice.");
  if (!Number.isInteger(n) || !Number.isInteger(incx))
    throw new Error("n and incx must be integers.");
  if (typeof alpha !== "number")
    throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
  if (incx <= 0) throw new Error("incx must be positive.");
  if (!(x instanceof Float32Array) && !(x instanceof GpuVector))
    throw new Error("x must be a Float32Array or GpuVector.");
  if (n <= 0) return xIsGpu ? {} : x;
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );

  const pipeline = await getPipeline(device, "sscal");

  const xBuffer = xIsGpu ? x._buf : uploadBuffer(x, "sscal-x", true);
  const paramsBuffer = createParamsBuffer(
    [
      { value: n, type: "u32" },
      { value: alpha, type: "f32" },
      { value: incx, type: "u32" },
    ],
    "sscal-params",
  );

  const bindGroup = createBindGroup(pipeline.getBindGroupLayout(0), [
    xBuffer,
    paramsBuffer,
  ]);
  const { commandEncoder, ts } = runComputePass(
    pipeline,
    bindGroup,
    calcWorkgroups(n),
  );
  const readBuffer = xIsGpu ? null : stageReadback(commandEncoder, xBuffer);

  submit(commandEncoder);

  const gpuTimeMs = await extractTimestamp(ts);

  if (xIsGpu) {
    destroyBuffers(paramsBuffer);
    if (gpuTimeMs !== undefined) return { gpuTimeMs };
    return {};
  }

  const result = await extractResult(readBuffer, Float32Array);
  destroyBuffers(xBuffer, paramsBuffer);

  if (gpuTimeMs !== undefined) return { x: result, gpuTimeMs };
  return result;
}
