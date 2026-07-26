import {
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
import { unpackF64 } from "../util/f64pack.mjs";
import { GpuVector } from "../classes/GpuVector.mjs";

const WGS = 64; // workgroup size

export async function dasum(device, n, x, incx) {
  const xIsGpu = x instanceof GpuVector;

  if (!(device instanceof GPUDevice))
    throw new Error("device must be a GPUDevice.");
  if (!Number.isInteger(n) || !Number.isInteger(incx))
    throw new Error("n and incx must be integers.");
  if (incx <= 0) throw new Error("incx must be positive.");
  if (!xIsGpu && !(x instanceof Float64Array))
    throw new Error("x must be a Float64Array or GpuVector.");
  if (xIsGpu && x.dtype !== Float64Array)
    throw new Error("x must be a Float64Array-backed GpuVector.");
  if (n <= 0) return { asum: 0 };
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );

  // dasum.wgsl/reduction/sumF64.wgsl are each concatenated with f64add.wgsl
  // (reusing its decode/encode/computeSum/Packed — WGSL has no #include).
  // f64add.wgsl declares no bindings/entry point of its own, so each
  // concatenated module has exactly one @compute entry — omitting entryPoint
  // here lets getPipeline auto-detect it, the stable path (see pipeline.mjs).
  const pipelineMain = await getPipeline(device, ["f64add", "dasum"]);
  const pipelineReduce = await getPipeline(device, ["f64add", "reduction/sumF64"]);

  let xVec = null;
  let partialsMainBuffer = null;
  let partialsAuxBuffer = null;
  let resultMainBuffer = null;
  let resultAuxBuffer = null;
  let paramsBuffer = null;
  let readMainBuffer = null;
  let readAuxBuffer = null;

  try {
    xVec = xIsGpu ? x : GpuVector.from(x);
    partialsMainBuffer = createStorageBuffer(2 * WGS * 4, "dasum-partialsMain"); // 2*WGS partial sums, main halves
    partialsAuxBuffer = createStorageBuffer(2 * WGS * 4, "dasum-partialsAux"); // 2*WGS partial sums, aux halves (raw u32 bits)
    resultMainBuffer = createResultBuffer(4, "dasum-result-main"); // final main half
    resultAuxBuffer = createResultBuffer(4, "dasum-result-aux"); // final aux half (raw u32 bits)
    paramsBuffer = createParamsBuffer(
      [
        { value: n, type: "u32" },
        { value: incx, type: "u32" },
      ],
      "dasum-params",
    );

    const bgMain = createBindGroup(
      pipelineMain.getBindGroupLayout(0),
      [xVec._buf, xVec._auxBuf, partialsMainBuffer, partialsAuxBuffer, paramsBuffer],
    );
    const { commandEncoder: enc1, ts: ts1 } = runComputePass(
      pipelineMain,
      bgMain,
      2 * WGS,
    ); // dispatch 2*WGS workgroups

    submit(enc1);

    const bgReduce = createBindGroup(
      pipelineReduce.getBindGroupLayout(0),
      [partialsMainBuffer, partialsAuxBuffer, resultMainBuffer, resultAuxBuffer],
    );
    const { commandEncoder: enc2, ts: ts2 } = runComputePass(
      pipelineReduce,
      bgReduce,
      1,
    ); // dispatch 1 workgroup to reduce the partial sums to a single result
    readMainBuffer = stageReadback(enc2, resultMainBuffer);
    readAuxBuffer = stageReadback(enc2, resultAuxBuffer);

    submit(enc2);

    const mainPromise = extractResult(readMainBuffer, Float32Array);
    const auxPromise = extractResult(readAuxBuffer, Uint32Array);
    readMainBuffer = null; // ownership transferred — extractResult's own finally destroys it
    readAuxBuffer = null;

    const [gpuTime1, gpuTime2, mainArr, auxArr] = await Promise.all([
      extractTimestamp(ts1),
      extractTimestamp(ts2),
      mainPromise,
      auxPromise,
    ]);

    // asum is always a scalar readback — both paths return { asum }
    const asum = unpackF64(mainArr[0], auxArr[0]);
    if (gpuTime1 !== undefined && gpuTime2 !== undefined)
      return { asum, gpuTimeMs: gpuTime1 + gpuTime2 };
    return { asum };
  } finally {
    if (!xIsGpu && xVec) xVec.destroy();
    if (partialsMainBuffer) destroyBuffers(partialsMainBuffer);
    if (partialsAuxBuffer) destroyBuffers(partialsAuxBuffer);
    if (resultMainBuffer) destroyBuffers(resultMainBuffer);
    if (resultAuxBuffer) destroyBuffers(resultAuxBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    // Only reached if submit(enc2) threw before ownership was transferred above.
    if (readMainBuffer) destroyBuffers(readMainBuffer);
    if (readAuxBuffer) destroyBuffers(readAuxBuffer);
  }
}
