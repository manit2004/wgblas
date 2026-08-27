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
import { splitDoubleDouble } from "../util/f64.mjs";
import { WGS } from "../util/constants.mjs";
import { requireSameDevice } from "../util/device.mjs";


export async function idamax(device, n, x, incx) {
  const xIsGpu = x instanceof GpuVector;

  if (!(device instanceof GPUDevice))
    throw new Error("device must be a GPUDevice.");
  requireSameDevice(device, "idamax", { x });
  if (!Number.isInteger(n) || !Number.isInteger(incx))
    throw new Error("n and incx must be integers.");
  if (incx <= 0) throw new Error("incx must be positive.");
  if (!xIsGpu && !(x instanceof Float64Array))
    throw new Error("x must be a Float64Array or GpuVector.");
  if (xIsGpu && x.dtype !== Float64Array)
    throw new Error("x must be a Float64Array-backed GpuVector.");
  if (n <= 0) return { index: 0 };
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );

  // Concatenated f64 helpers (WGSL has no #include); ddAbs is unconditional in idamax.wgsl, so x is split as-is.
  const f64Deps = ["f64/dekker", "f64/utils/abs", "f64/utils/greater", "f64/utils/equal"];
  const pipelineMain = await getPipeline(device, [...f64Deps, "idamax"], "idamax_main");
  const pipelineReduce = await getPipeline(device, [...f64Deps, "reduction/argmaxF64"], "reduce_f64");

  let xHiBuffer = null;
  let xLoBuffer = null;
  let partialsValHiBuffer = null;
  let partialsValLoBuffer = null;
  let partialsIdxBuffer = null;
  let resultBuffer = null;
  let paramsBuffer = null;
  let readBuffer = null;

  try {
    if (xIsGpu) {
      xHiBuffer = x._buf;
      xLoBuffer = x._loBuf;
    } else {
      const { hi, lo } = splitDoubleDouble(x);
      xHiBuffer = uploadBuffer(device, hi, "idamax-xHi", false);
      xLoBuffer = uploadBuffer(device, lo, "idamax-xLo", false);
    }
    partialsValHiBuffer = createStorageBuffer(device, 2 * WGS * 4, "idamax-partials-val-hi");
    partialsValLoBuffer = createStorageBuffer(device, 2 * WGS * 4, "idamax-partials-val-lo");
    partialsIdxBuffer = createStorageBuffer(device, 2 * WGS * 4, "idamax-partials-idx");
    resultBuffer = createResultBuffer(device, 4, "idamax-result"); // u32 index
    paramsBuffer = createParamsBuffer(device,
      [
        { value: n, type: "u32" },
        { value: incx, type: "u32" },
      ],
      "idamax-params",
    );

    const bgMain = createBindGroup(device, pipelineMain.getBindGroupLayout(0), [
      xHiBuffer,
      xLoBuffer,
      partialsValHiBuffer,
      partialsValLoBuffer,
      partialsIdxBuffer,
      paramsBuffer,
    ]);
    const { commandEncoder: enc1, ts: ts1 } = runComputePass(device,
      pipelineMain,
      bgMain,
      2 * WGS,
    ); // dispatch 2*WGS workgroups

    submit(device, enc1);

    const bgReduce = createBindGroup(device, pipelineReduce.getBindGroupLayout(0), [
      partialsValHiBuffer,
      partialsValLoBuffer,
      partialsIdxBuffer,
      resultBuffer,
    ]);
    const { commandEncoder: enc2, ts: ts2 } = runComputePass(device,
      pipelineReduce,
      bgReduce,
      1,
    ); // dispatch 1 workgroup to reduce the partials to a single index
    readBuffer = stageReadback(device, enc2, resultBuffer);

    submit(device, enc2);

    const resultPromise = extractResult(readBuffer, Uint32Array);
    readBuffer = null; // ownership transferred — extractResult's own finally destroys it

    const [gpuTime1, gpuTime2, idxArr] = await Promise.all([
      extractTimestamp(ts1),
      extractTimestamp(ts2),
      resultPromise,
    ]);

    const index = idxArr[0];

    if (gpuTime1 !== undefined && gpuTime2 !== undefined)
      return { index, gpuTimeMs: gpuTime1 + gpuTime2 };
    return { index };
  } finally {
    if (!xIsGpu && xHiBuffer) destroyBuffers(xHiBuffer);
    if (!xIsGpu && xLoBuffer) destroyBuffers(xLoBuffer);
    if (partialsValHiBuffer) destroyBuffers(partialsValHiBuffer);
    if (partialsValLoBuffer) destroyBuffers(partialsValLoBuffer);
    if (partialsIdxBuffer) destroyBuffers(partialsIdxBuffer);
    if (resultBuffer) destroyBuffers(resultBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    // Only reached if submit(device, enc2) threw before ownership was transferred above.
    if (readBuffer) destroyBuffers(readBuffer);
  }
}
