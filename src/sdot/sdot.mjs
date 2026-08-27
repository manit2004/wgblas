import {
  uploadBuffer,
  createStorageBuffer,
  createParamsBuffer,
  createResultBuffer,
  stageReadback,
  destroyBuffers,
} from "../util/buffer.mjs";
import { createBindGroup } from "../util/bindgroup.mjs";
import { runComputePass, submit } from "../util/compute.mjs";
import { extractTimestamp } from "../util/benchmark.mjs";
import { extractResult } from "../util/result.mjs";
import { getPipeline } from "../util/pipeline.mjs";
import { GpuVector } from "../classes/GpuVector.mjs";
import { WGS } from "../util/constants.mjs";
import { requireSameDevice } from "../util/device.mjs";


export async function sdot(device, n, x, incx, y, incy) {
  const xIsGpu = x instanceof GpuVector;
  const yIsGpu = y instanceof GpuVector;

  if (!(device instanceof GPUDevice))
    throw new Error("device must be a GPUDevice.");
  requireSameDevice(device, "sdot", { x, y });
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
  if (n <= 0) return { dot: 0 };
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  if (y.length < (n - 1) * incy + 1)
    throw new Error(
      "y does not have enough elements for the given n and incy.",
    );

  const pipelineMain = await getPipeline(device, "sdot");
  const pipelineReduce = await getPipeline(device, "reduction/sum");

  let xBuffer = null;
  let yBuffer = null;
  let partialsBuffer = null;
  let resultBuffer = null;
  let paramsBuffer = null;
  let readBuffer = null;

  try {
    xBuffer = xIsGpu ? x._buf : uploadBuffer(device, x, "sdot-x", false);
    yBuffer = yIsGpu ? y._buf : uploadBuffer(device, y, "sdot-y", false);
    partialsBuffer = createStorageBuffer(device, 2 * WGS * 4, "sdot-partials"); //to hold 2*WGS partial sums of f32
    resultBuffer = createResultBuffer(device, 4, "sdot-result"); //to hold the final float32 dot product
    paramsBuffer = createParamsBuffer(device,
      [
        { value: n, type: "u32" },
        { value: incx, type: "u32" },
        { value: incy, type: "u32" },
      ],
      "sdot-params",
    );

    const bgMain = createBindGroup(device, pipelineMain.getBindGroupLayout(0), [
      xBuffer,
      yBuffer,
      partialsBuffer,
      paramsBuffer,
    ]);
    const { commandEncoder: enc1, ts: ts1 } = runComputePass(device,
      pipelineMain,
      bgMain,
      2 * WGS,
    ); //dispatch 2*WGS workgroups

    submit(device, enc1);

    const bgReduce = createBindGroup(device, pipelineReduce.getBindGroupLayout(0), [
      partialsBuffer,
      resultBuffer,
    ]);
    const { commandEncoder: enc2, ts: ts2 } = runComputePass(device,
      pipelineReduce,
      bgReduce,
      1,
    ); // dispatch 1 workgroup to reduce the partial sums to a single result
    readBuffer = stageReadback(device, enc2, resultBuffer);

    submit(device, enc2);

    const resultPromise = extractResult(readBuffer, Float32Array);
    readBuffer = null; // ownership transferred — extractResult's own finally destroys it

    const [gpuTime1, gpuTime2, dotArr] = await Promise.all([
      extractTimestamp(ts1),
      extractTimestamp(ts2),
      resultPromise,
    ]);

    // dot is always a scalar readback — both paths return { dot }
    if (gpuTime1 !== undefined && gpuTime2 !== undefined)
      return { dot: dotArr[0], gpuTimeMs: gpuTime1 + gpuTime2 };
    return { dot: dotArr[0] };
  } finally {
    if (!xIsGpu && xBuffer) destroyBuffers(xBuffer);
    if (!yIsGpu && yBuffer) destroyBuffers(yBuffer);
    if (partialsBuffer) destroyBuffers(partialsBuffer);
    if (resultBuffer) destroyBuffers(resultBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    // Only reached if submit(device, enc2) threw before ownership was transferred above.
    if (readBuffer) destroyBuffers(readBuffer);
  }
}
