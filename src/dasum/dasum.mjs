import {
  createStorageBuffer,
  createParamsBuffer,
  createResultBuffer,
  stageReadback,
  destroyBuffers,
  uploadBuffer,
} from "../util/buffer.mjs";
import { createBindGroup } from "../util/bindgroup.mjs";
import { runComputePass, submit } from "../util/compute.mjs";
import { extractTimestamp } from "../util/benchmark.mjs";
import { extractResult } from "../util/result.mjs";
import { getPipeline } from "../util/pipeline.mjs";
import { GpuVector } from "../classes/GpuVector.mjs";
import { splitDoubleDouble, mergeDoubleDouble } from "../util/f64.mjs";

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

  // Concatenated with f64/dekker.wgsl (DD struct), f64/utils/abs.wgsl
  // (ddAbs), and f64/utils/add.wgsl (ddAddProtected) — WGSL has no
  // #include; entryPoint omitted since each module has only one @compute.
  const f64Deps = ["f64/dekker", "f64/utils/abs", "f64/utils/add"];
  const pipelineMain = await getPipeline(device, [...f64Deps, "dasum"]);
  const pipelineReduce = await getPipeline(device, [...f64Deps, "reduction/sumF64"]);

  let xHiBuffer = null;
  let xLoBuffer = null;
  let partialsHiBuffer = null;
  let partialsLoBuffer = null;
  let resultHiBuffer = null;
  let resultLoBuffer = null;
  let paramsBuffer = null;
  let readHiBuffer = null;
  let readLoBuffer = null;

  try {
    if (xIsGpu) {
      xHiBuffer = x._buf;
      xLoBuffer = x._loBuf;
    } else {
      const { hi, lo } = splitDoubleDouble(x.map(Math.abs));
      xHiBuffer = uploadBuffer(hi, "dasum-xHi", false);
      xLoBuffer = uploadBuffer(lo, "dasum-xLo", false);
    }
    partialsHiBuffer = createStorageBuffer(2 * WGS * 4, "dasum-partialsHi");
    partialsLoBuffer = createStorageBuffer(2 * WGS * 4, "dasum-partialsLo");
    resultHiBuffer = createResultBuffer(4, "dasum-result-hi");
    resultLoBuffer = createResultBuffer(4, "dasum-result-lo");
    paramsBuffer = createParamsBuffer(
      [
        { value: n, type: "u32" },
        { value: incx, type: "u32" },
      ],
      "dasum-params",
    );

    const bgMain = createBindGroup(
      pipelineMain.getBindGroupLayout(0),
      [xHiBuffer, xLoBuffer, partialsHiBuffer, partialsLoBuffer, paramsBuffer],
    );
    const { commandEncoder: enc1, ts: ts1 } = runComputePass(
      pipelineMain,
      bgMain,
      2 * WGS,
    ); // dispatch 2*WGS workgroups

    submit(enc1);

    const bgReduce = createBindGroup(
      pipelineReduce.getBindGroupLayout(0),
      [partialsHiBuffer, partialsLoBuffer, resultHiBuffer, resultLoBuffer],
    );
    const { commandEncoder: enc2, ts: ts2 } = runComputePass(
      pipelineReduce,
      bgReduce,
      1,
    ); // dispatch 1 workgroup to reduce the partial sums to a single result
    readHiBuffer = stageReadback(enc2, resultHiBuffer);
    readLoBuffer = stageReadback(enc2, resultLoBuffer);

    submit(enc2);

    const hiPromise = extractResult(readHiBuffer, Float32Array);
    const loPromise = extractResult(readLoBuffer, Float32Array);
    readHiBuffer = null; // ownership transferred — extractResult's own finally destroys it
    readLoBuffer = null;

    const [gpuTime1, gpuTime2, hiArr, loArr] = await Promise.all([
      extractTimestamp(ts1),
      extractTimestamp(ts2),
      hiPromise,
      loPromise,
    ]);

    // asum is always a scalar readback — both paths return { asum }
    const asum = mergeDoubleDouble(hiArr, loArr)[0];
    if (gpuTime1 !== undefined && gpuTime2 !== undefined)
      return { asum, gpuTimeMs: gpuTime1 + gpuTime2 };
    return { asum };
  } finally {
    if (!xIsGpu && xHiBuffer) destroyBuffers(xHiBuffer);
    if (!xIsGpu && xLoBuffer) destroyBuffers(xLoBuffer);
    if (partialsHiBuffer) destroyBuffers(partialsHiBuffer);
    if (partialsLoBuffer) destroyBuffers(partialsLoBuffer);
    if (resultHiBuffer) destroyBuffers(resultHiBuffer);
    if (resultLoBuffer) destroyBuffers(resultLoBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    // Only reached if submit(enc2) threw before ownership was transferred above.
    if (readHiBuffer) destroyBuffers(readHiBuffer);
    if (readLoBuffer) destroyBuffers(readLoBuffer);
  }
}
