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

const WGS = 64; // workgroup size

export async function snrm2(device, n, x, incx) {
  const xIsGpu = x instanceof GpuVector;

  if (!(device instanceof GPUDevice))
    throw new Error("device must be a GPUDevice.");
  if (!Number.isInteger(n) || !Number.isInteger(incx))
    throw new Error("n and incx must be integers.");
  if (incx <= 0) throw new Error("incx must be positive.");
  if (!xIsGpu && !(x instanceof Float32Array))
    throw new Error("x must be a Float32Array or GpuVector.");
  if (n <= 0) return { nrm2: 0 };
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );

  const pipelineMain = await getPipeline(device, "snrm2");
  const pipelineReduce = await getPipeline(device, "reduction/sum");

  let xBuffer = null;
  let partialsBuffer = null;
  let resultBuffer = null;
  let paramsBuffer = null;
  let readBuffer = null;

  try {
    xBuffer = xIsGpu ? x._buf : uploadBuffer(x, "snrm2-x", false);
    partialsBuffer = createStorageBuffer(2 * WGS * 4, "snrm2-partials"); // 2*WGS partial sums of f32
    resultBuffer = createResultBuffer(4, "snrm2-result"); // final f32 scalar
    paramsBuffer = createParamsBuffer(
      [
        { value: n, type: "u32" },
        { value: incx, type: "u32" },
      ],
      "snrm2-params",
    );

    const bgMain = createBindGroup(pipelineMain.getBindGroupLayout(0), [
      xBuffer,
      partialsBuffer,
      paramsBuffer,
    ]);
    const { commandEncoder: enc1, ts: ts1 } = runComputePass(
      pipelineMain,
      bgMain,
      2 * WGS,
    ); // dispatch 2*WGS workgroups

    submit(enc1);

    const bgReduce = createBindGroup(pipelineReduce.getBindGroupLayout(0), [
      partialsBuffer,
      resultBuffer,
    ]);
    const { commandEncoder: enc2, ts: ts2 } = runComputePass(
      pipelineReduce,
      bgReduce,
      1,
    ); // reduce partials to single result
    readBuffer = stageReadback(enc2, resultBuffer);

    submit(enc2);

    const resultPromise = extractResult(readBuffer, Float32Array);
    readBuffer = null; // ownership transferred — extractResult's own finally destroys it

    const [gpuTime1, gpuTime2, sqsumArr] = await Promise.all([
      extractTimestamp(ts1),
      extractTimestamp(ts2),
      resultPromise,
    ]);

    // sqrt is taken on CPU after the GPU sum-of-squares reduction
    const nrm2 = Math.sqrt(sqsumArr[0]);

    if (gpuTime1 !== undefined && gpuTime2 !== undefined)
      return { nrm2, gpuTimeMs: gpuTime1 + gpuTime2 };
    return { nrm2 };
  } finally {
    if (!xIsGpu && xBuffer) destroyBuffers(xBuffer);
    if (partialsBuffer) destroyBuffers(partialsBuffer);
    if (resultBuffer) destroyBuffers(resultBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    // Only reached if submit(enc2) threw before ownership was transferred above.
    if (readBuffer) destroyBuffers(readBuffer);
  }
}
