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

export async function saxpy(device, n, alpha, x, incx, y, incy) {
  const xIsGpu = x instanceof GpuVector;
  const yIsGpu = y instanceof GpuVector;

  if (!(device instanceof GPUDevice))
    throw new Error("device must be a GPUDevice.");
  requireSameDevice(device, "saxpy", { x, y });
  if (
    !Number.isInteger(n) ||
    !Number.isInteger(incx) ||
    !Number.isInteger(incy)
  )
    throw new Error("n, incx, and incy must be integers.");
  if (typeof alpha !== "number")
    throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
  if (incx <= 0 || incy <= 0)
    throw new Error("incx and incy must be positive.");
  if (!xIsGpu && !(x instanceof Float32Array))
    throw new Error("x must be a Float32Array or GpuVector.");
  if (!yIsGpu && !(y instanceof Float32Array))
    throw new Error("y must be a Float32Array or GpuVector.");
  if (xIsGpu !== yIsGpu)
    throw new Error(
      "x and y must be the same type (both Float32Array or both GpuVector).",
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

  const pipeline = await getPipeline(device, "saxpy");

  let xBuffer = null;
  let yBuffer = null;
  let paramsBuffer = null;
  let readBuffer = null;

  try {
    xBuffer = xIsGpu ? x._buf : uploadBuffer(device, x, "saxpy-x", false);
    yBuffer = yIsGpu ? y._buf : uploadBuffer(device, y, "saxpy-y", true);
    paramsBuffer = createParamsBuffer(device,
      [
        { value: n, type: "u32" },
        { value: alpha, type: "f32" },
        { value: incx, type: "u32" },
        { value: incy, type: "u32" },
      ],
      "saxpy-params",
    );

    const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [
      xBuffer,
      yBuffer,
      paramsBuffer,
    ]);
    const { commandEncoder, ts } = runComputePass(device,
      pipeline,
      bindGroup,
      calcWorkgroups(device, n),
    );
    readBuffer = yIsGpu ? null : stageReadback(device, commandEncoder, yBuffer);

    submit(device, commandEncoder);

    const gpuTimeMs = await extractTimestamp(ts);

    if (yIsGpu) { // xIsGpu === yIsGpu, enforced above
      if (gpuTimeMs !== undefined) return { gpuTimeMs };
      return {};
    }

    const result = await extractResult(readBuffer, Float32Array);
    readBuffer = null; // extractResult already destroyed it
    if (gpuTimeMs !== undefined) return { y: result, gpuTimeMs };
    return { y: result };
  } finally {
    if (!xIsGpu && xBuffer) destroyBuffers(xBuffer);
    if (!yIsGpu && yBuffer) destroyBuffers(yBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    // Only reached if extractTimestamp threw before extractResult ran.
    if (readBuffer) destroyBuffers(readBuffer);
  }
}
