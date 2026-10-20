import {
  uploadBuffer,
  createStorageBuffer,
  createParamsBuffer,
  createResultBuffer,
  stageReadback,
  destroyBuffers,
} from "../util/buffer.mjs";
import { createBindGroup } from "../util/bindgroup.mjs";
import { runComputePasses, submit } from "../util/compute.mjs";
import { extractTimestamp } from "../util/benchmark.mjs";
import { extractResult } from "../util/result.mjs";
import { getPipeline } from "../util/pipeline.mjs";
import { GpuVector } from "../classes/GpuVector.mjs";
import { WGS } from "../util/constants.mjs";
import { requireGpuDevice, requireSameDevice } from "../util/device.mjs";

export async function snrm2(device, n, x, incx) {
  const xIsGpu = x instanceof GpuVector;

  requireGpuDevice(device);
  requireSameDevice(device, "snrm2", { x });
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
  const pipelineReduce = await getPipeline(device, "reduction/scaledSum");

  let xBuffer = null;
  let partialsBuffer = null;
  let resultBuffer = null;
  let paramsBuffer = null;
  let readBuffer = null;

  try {
    xBuffer = xIsGpu ? x._buf : uploadBuffer(device, x, "snrm2-x", false);
    // 2*WGS partial (big, medium, small) triples — see snrm2.wgsl.
    partialsBuffer = createStorageBuffer(
      device,
      2 * WGS * 3 * 4,
      "snrm2-partials",
    );
    resultBuffer = createResultBuffer(device, 4, "snrm2-result"); // final f32 scalar
    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" },
        { value: incx, type: "u32" },
      ],
      "snrm2-params",
    );

    const bgMain = createBindGroup(device, pipelineMain.getBindGroupLayout(0), [
      xBuffer,
      partialsBuffer,
      paramsBuffer,
    ]);
    const bgReduce = createBindGroup(
      device,
      pipelineReduce.getBindGroupLayout(0),
      [partialsBuffer, resultBuffer],
    );
    // Both passes on one command buffer and one submit, timed as one span:
    // a second submission costs another full dispatch floor (~5 µs of GPU
    // time and ~100 µs of host time at small n).
    const { commandEncoder: encoder, ts } = runComputePasses(device, [
      { pipeline: pipelineMain, bindGroup: bgMain, workgroups: 2 * WGS },
      { pipeline: pipelineReduce, bindGroup: bgReduce, workgroups: 1 },
    ]);
    readBuffer = stageReadback(device, encoder, resultBuffer);

    submit(device, encoder);

    const resultPromise = extractResult(readBuffer, Float32Array);
    readBuffer = null; // ownership transferred — extractResult's own finally destroys it

    const [gpuTimeMs, resultArr] = await Promise.all([
      extractTimestamp(ts),
      resultPromise,
    ]);

    // reduction/scaledSum.wgsl already combines the three sums into the
    // norm on the GPU — there's no separate sqrt step here.
    const nrm2 = resultArr[0];

    if (gpuTimeMs !== undefined) return { nrm2, gpuTimeMs };
    return { nrm2 };
  } finally {
    if (!xIsGpu && xBuffer) destroyBuffers(xBuffer);
    if (partialsBuffer) destroyBuffers(partialsBuffer);
    if (resultBuffer) destroyBuffers(resultBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    // Only reached if submit(device, encoder) threw before ownership was transferred above.
    if (readBuffer) destroyBuffers(readBuffer);
  }
}
