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

export async function scopy(device, n, x, incx, y, incy) {
  const xIsGpu = x instanceof GpuVector;
  const yIsGpu = y instanceof GpuVector;

  if (!(device instanceof GPUDevice))
    throw new Error("device must be a GPUDevice.");
  if (
    !Number.isInteger(n) ||
    !Number.isInteger(incx) ||
    !Number.isInteger(incy)
  )
    throw new Error("n, incx, and incy must be integers.");
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

  const pipeline = await getPipeline(device, "scopy");

  let xBuffer = null;
  let yBuffer = null;
  let paramsBuffer = null;
  let readBuffer = null;

  try {
    xBuffer = xIsGpu ? x._buf : uploadBuffer(x, "scopy-x", false);
    yBuffer = yIsGpu ? y._buf : uploadBuffer(y, "scopy-y", true);
    paramsBuffer = createParamsBuffer(
      [
        { value: n, type: "u32" },
        { value: incx, type: "u32" },
        { value: incy, type: "u32" },
      ],
      "scopy-params",
    );

    const bindGroup = createBindGroup(pipeline.getBindGroupLayout(0), [
      xBuffer,
      yBuffer,
      paramsBuffer,
    ]);
    const { commandEncoder, ts } = runComputePass(
      pipeline,
      bindGroup,
      calcWorkgroups(n),
    );
    readBuffer = yIsGpu ? null : stageReadback(commandEncoder, yBuffer);

    submit(commandEncoder);

    const gpuTimeMs = await extractTimestamp(ts);

    if (yIsGpu && xIsGpu) {
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
