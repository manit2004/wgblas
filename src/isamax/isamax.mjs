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

const WGS = 64;

export async function isamax(device, n, x, incx) {
  const xIsGpu = x instanceof GpuVector;

  if (!(device instanceof GPUDevice))
    throw new Error("device must be a GPUDevice.");
  if (!Number.isInteger(n) || !Number.isInteger(incx))
    throw new Error("n and incx must be integers.");
  if (incx <= 0) throw new Error("incx must be positive.");
  if (!xIsGpu && !(x instanceof Float32Array))
    throw new Error("x must be a Float32Array or GpuVector.");
  if (n <= 0) return { index: 0 };
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );

  const pipelineMain = await getPipeline(device, "isamax");
  const pipelineReduce = await getPipeline(device, "reduction/argmax");

  let xBuffer = null;
  let partialsValBuffer = null;
  let partialsIdxBuffer = null;
  let resultBuffer = null;
  let paramsBuffer = null;

  try {
    xBuffer = xIsGpu ? x._buf : uploadBuffer(x, "isamax-x", false);
    partialsValBuffer = createStorageBuffer(
      2 * WGS * 4,
      "isamax-partials-val",
    ); //to hold 2*WGS partial max values of f32
    partialsIdxBuffer = createStorageBuffer(
      2 * WGS * 4,
      "isamax-partials-idx",
    ); //to hold 2*WGS partial max indices of u32
    resultBuffer = createResultBuffer(4, "isamax-result"); // u32 index
    paramsBuffer = createParamsBuffer(
      [
        { value: n, type: "u32" },
        { value: incx, type: "u32" },
      ],
      "isamax-params",
    );

    const bgMain = createBindGroup(pipelineMain.getBindGroupLayout(0), [
      xBuffer,
      partialsValBuffer,
      partialsIdxBuffer,
      paramsBuffer,
    ]);
    const { commandEncoder: enc1, ts: ts1 } = runComputePass(
      pipelineMain,
      bgMain,
      2 * WGS,
    ); //dispatch 2*WGS workgroups

    submit(enc1);

    const bgReduce = createBindGroup(pipelineReduce.getBindGroupLayout(0), [
      partialsValBuffer,
      partialsIdxBuffer,
      resultBuffer,
    ]);
    const { commandEncoder: enc2, ts: ts2 } = runComputePass(
      pipelineReduce,
      bgReduce,
      1,
    ); // dispatch 1 workgroup to reduce the partial sums to a single result
    const readBuffer = stageReadback(enc2, resultBuffer);

    submit(enc2);

    const [gpuTime1, gpuTime2, idxArr] = await Promise.all([
      extractTimestamp(ts1),
      extractTimestamp(ts2),
      extractResult(readBuffer, Uint32Array),
    ]);

    const index = idxArr[0];

    if (gpuTime1 !== undefined && gpuTime2 !== undefined)
      return { index, gpuTimeMs: gpuTime1 + gpuTime2 };
    return { index };
  } finally {
    if (!xIsGpu && xBuffer) destroyBuffers(xBuffer);
    if (partialsValBuffer) destroyBuffers(partialsValBuffer);
    if (partialsIdxBuffer) destroyBuffers(partialsIdxBuffer);
    if (resultBuffer) destroyBuffers(resultBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
  }
}
