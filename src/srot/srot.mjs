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
import { requireSameDevice } from "../util/device.mjs";

export async function srot(device, n, x, incx, y, incy, c, s) {
  const xIsGpu = x instanceof GpuVector;
  const yIsGpu = y instanceof GpuVector;

  if (!(device instanceof GPUDevice))
    throw new Error("device must be a GPUDevice.");
  requireSameDevice(device, "srot", { x, y });
  if (
    !Number.isInteger(n) ||
    !Number.isInteger(incx) ||
    !Number.isInteger(incy)
  )
    throw new Error("n, incx, and incy must be integers.");
  if (typeof c !== "number") throw new Error("c must be a number.");
  if (typeof s !== "number") throw new Error("s must be a number.");
  if (Number.isNaN(c) || Number.isNaN(s)) throw new Error("c and s must not be NaN.");
  if (!Number.isFinite(c)) throw new Error("c must be finite.");
  if (!Number.isFinite(s)) throw new Error("s must be finite.");
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
  if (n <= 0) return xIsGpu ? {} : { x, y };
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  if (y.length < (n - 1) * incy + 1)
    throw new Error(
      "y does not have enough elements for the given n and incy.",
    );

  const pipeline = await getPipeline(device, "srot");

  let xBuffer = null;
  let yBuffer = null;
  let paramsBuffer = null;
  let readX = null;
  let readY = null;

  try {
    xBuffer = xIsGpu ? x._buf : uploadBuffer(device, x, "srot-x", true);
    yBuffer = yIsGpu ? y._buf : uploadBuffer(device, y, "srot-y", true);
    paramsBuffer = createParamsBuffer(device,
      [
        { value: n, type: "u32" },
        { value: c, type: "f32" },
        { value: s, type: "f32" },
        { value: incx, type: "u32" },
        { value: incy, type: "u32" },
      ],
      "srot-params",
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
    readX = xIsGpu ? null : stageReadback(device, commandEncoder, xBuffer);
    readY = yIsGpu ? null : stageReadback(device, commandEncoder, yBuffer);
    submit(device, commandEncoder);

    const gpuTimeMs = await extractTimestamp(ts);

    if (xIsGpu) { // xIsGpu === yIsGpu, enforced above
      if (gpuTimeMs !== undefined) return { gpuTimeMs };
      return {};
    }

    const xPromise = extractResult(readX, Float32Array);
    const yPromise = extractResult(readY, Float32Array);
    readX = null; // ownership transferred — extractResult's own finally destroys it
    readY = null;
    const [xResult, yResult] = await Promise.all([xPromise, yPromise]);

    if (gpuTimeMs !== undefined) return { x: xResult, y: yResult, gpuTimeMs };
    return { x: xResult, y: yResult };
  } finally {
    if (!xIsGpu && xBuffer) destroyBuffers(xBuffer);
    if (!yIsGpu && yBuffer) destroyBuffers(yBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    // Only reached if extractTimestamp threw before ownership was transferred above.
    if (readX) destroyBuffers(readX);
    if (readY) destroyBuffers(readY);
  }
}
