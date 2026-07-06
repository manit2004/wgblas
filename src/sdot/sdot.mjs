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

const WGS = 64; //workgroup size

export async function sdot(device, n, x, incx, y, incy) {
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

  const xBuffer = xIsGpu ? x._buf : uploadBuffer(x, "sdot-x", false);
  const yBuffer = yIsGpu ? y._buf : uploadBuffer(y, "sdot-y", false);
  const partialsBuffer = createStorageBuffer(2 * WGS * 4, "sdot-partials"); //to hold 2*WGS partial sums of f32
  const resultBuffer = createResultBuffer(4, "sdot-result"); //to hold the final float32 dot product
  const paramsBuffer = createParamsBuffer(
    [
      { value: n, type: "u32" },
      { value: incx, type: "u32" },
      { value: incy, type: "u32" },
    ],
    "sdot-params",
  );

  const bgMain = createBindGroup(pipelineMain.getBindGroupLayout(0), [
    xBuffer,
    yBuffer,
    partialsBuffer,
    paramsBuffer,
  ]);
  const { commandEncoder: enc1, ts: ts1 } = runComputePass(
    pipelineMain,
    bgMain,
    2 * WGS,
  ); //dispatch 2*WGS workgroups

  submit(enc1);

  const bgReduce = createBindGroup(pipelineReduce.getBindGroupLayout(0), [
    partialsBuffer,
    resultBuffer,
  ]);
  const { commandEncoder: enc2, ts: ts2 } = runComputePass(
    pipelineReduce,
    bgReduce,
    1,
  ); // dispatch 1 workgroup to reduce the partial sums to a single result
  const readBuffer = stageReadback(enc2, resultBuffer);

  submit(enc2);

  const [gpuTime1, gpuTime2, dotArr] = await Promise.all([
    extractTimestamp(ts1),
    extractTimestamp(ts2),
    extractResult(readBuffer, Float32Array),
  ]);

  // dot is always a scalar readback — both paths return { dot }
  if (xIsGpu && yIsGpu) {
    destroyBuffers(partialsBuffer, resultBuffer, paramsBuffer, readBuffer);
    if (gpuTime1 !== undefined && gpuTime2 !== undefined)
      return { dot: dotArr[0], gpuTimeMs: gpuTime1 + gpuTime2 };
    return { dot: dotArr[0] };
  }

  destroyBuffers(
    xBuffer,
    yBuffer,
    partialsBuffer,
    resultBuffer,
    paramsBuffer,
    readBuffer,
  );
  if (gpuTime1 !== undefined && gpuTime2 !== undefined)
    return { dot: dotArr[0], gpuTimeMs: gpuTime1 + gpuTime2 };
  return { dot: dotArr[0] };
}
