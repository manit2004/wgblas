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
import { splitDoubleDouble, mergeDoubleDouble } from "../util/f64.mjs";
import { WGS } from "../util/constants.mjs";
import { requireGpuDevice, requireSameDevice } from "../util/device.mjs";

// dnrm2: sqrt(sum(x[i]*x[i])), double-double (Dekker) f64 emulation of
// snrm2 — same scaled accumulation (Blue's algorithm) snrm2 uses to avoid
// overflow, with (scale, ssq) as double-double pairs instead of plain f32.
// See dnrm2.wgsl for why the per-element branch that algorithm needs had to
// become branch-free (select()-based) here.
export async function dnrm2(device, n, x, incx) {
  const xIsGpu = x instanceof GpuVector;

  requireGpuDevice(device);
  requireSameDevice(device, "dnrm2", { x });
  if (!Number.isInteger(n) || !Number.isInteger(incx))
    throw new Error("n and incx must be integers.");
  if (incx <= 0) throw new Error("incx must be positive.");
  if (!xIsGpu && !(x instanceof Float64Array))
    throw new Error("x must be a Float64Array or GpuVector.");
  if (xIsGpu && x.dtype !== Float64Array)
    throw new Error("x must be a Float64Array-backed GpuVector.");
  if (n <= 0) return { nrm2: 0 };
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );

  // Concatenated with f64/dekker.wgsl (DD struct), f64/utils/abs.wgsl
  // (ddAbs), f64/utils/greater.wgsl (ddGreater), f64/utils/add.wgsl
  // (ddAddProtected), f64/utils/multiply.wgsl (ddMulProtected),
  // f64/utils/divide.wgsl (ddDivProtected), and f64/utils/sqrt.wgsl
  // (ddSqrtProtected) — WGSL has no #include.
  const f64Deps = [
    "f64/dekker",
    "f64/utils/abs",
    "f64/utils/greater",
    "f64/utils/add",
    "f64/utils/multiply",
    "f64/utils/divide",
    "f64/utils/sqrt",
  ];
  const pipelineMain = await getPipeline(device, [...f64Deps, "dnrm2"]);
  const pipelineReduce = await getPipeline(device, [
    ...f64Deps,
    "reduction/scaledSumF64",
  ]);

  let xHiBuffer = null;
  let xLoBuffer = null;
  let partialsScaleHiBuffer = null;
  let partialsScaleLoBuffer = null;
  let partialsSsqHiBuffer = null;
  let partialsSsqLoBuffer = null;
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
      const { hi, lo } = splitDoubleDouble(x);
      xHiBuffer = uploadBuffer(device, hi, "dnrm2-xHi", false);
      xLoBuffer = uploadBuffer(device, lo, "dnrm2-xLo", false);
    }
    // 2*WGS partial (scale, ssq) DD pairs — see dnrm2.wgsl for what they represent.
    partialsScaleHiBuffer = createStorageBuffer(
      device,
      2 * WGS * 4,
      "dnrm2-partials-scaleHi",
    );
    partialsScaleLoBuffer = createStorageBuffer(
      device,
      2 * WGS * 4,
      "dnrm2-partials-scaleLo",
    );
    partialsSsqHiBuffer = createStorageBuffer(
      device,
      2 * WGS * 4,
      "dnrm2-partials-ssqHi",
    );
    partialsSsqLoBuffer = createStorageBuffer(
      device,
      2 * WGS * 4,
      "dnrm2-partials-ssqLo",
    );
    resultHiBuffer = createResultBuffer(device, 4, "dnrm2-result-hi");
    resultLoBuffer = createResultBuffer(device, 4, "dnrm2-result-lo");
    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" },
        { value: incx, type: "u32" },
      ],
      "dnrm2-params",
    );

    const bgMain = createBindGroup(device, pipelineMain.getBindGroupLayout(0), [
      xHiBuffer,
      xLoBuffer,
      partialsScaleHiBuffer,
      partialsScaleLoBuffer,
      partialsSsqHiBuffer,
      partialsSsqLoBuffer,
      paramsBuffer,
    ]);
    const { commandEncoder: enc1, ts: ts1 } = runComputePass(
      device,
      pipelineMain,
      bgMain,
      2 * WGS,
    ); // dispatch 2*WGS workgroups

    submit(device, enc1);

    const bgReduce = createBindGroup(
      device,
      pipelineReduce.getBindGroupLayout(0),
      [
        partialsScaleHiBuffer,
        partialsScaleLoBuffer,
        partialsSsqHiBuffer,
        partialsSsqLoBuffer,
        resultHiBuffer,
        resultLoBuffer,
      ],
    );
    const { commandEncoder: enc2, ts: ts2 } = runComputePass(
      device,
      pipelineReduce,
      bgReduce,
      1,
    ); // reduce partials to a single result
    readHiBuffer = stageReadback(device, enc2, resultHiBuffer);
    readLoBuffer = stageReadback(device, enc2, resultLoBuffer);

    submit(device, enc2);

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

    // reduction/scaledSumF64.wgsl already computes scale·sqrt(ssq) on the
    // GPU — no separate sqrt step here.
    const nrm2 = mergeDoubleDouble(hiArr, loArr)[0];

    if (gpuTime1 !== undefined && gpuTime2 !== undefined)
      return { nrm2, gpuTimeMs: gpuTime1 + gpuTime2 };
    return { nrm2 };
  } finally {
    if (!xIsGpu && xHiBuffer) destroyBuffers(xHiBuffer);
    if (!xIsGpu && xLoBuffer) destroyBuffers(xLoBuffer);
    if (partialsScaleHiBuffer) destroyBuffers(partialsScaleHiBuffer);
    if (partialsScaleLoBuffer) destroyBuffers(partialsScaleLoBuffer);
    if (partialsSsqHiBuffer) destroyBuffers(partialsSsqHiBuffer);
    if (partialsSsqLoBuffer) destroyBuffers(partialsSsqLoBuffer);
    if (resultHiBuffer) destroyBuffers(resultHiBuffer);
    if (resultLoBuffer) destroyBuffers(resultLoBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    // Only reached if submit(device, enc2) threw before ownership was transferred above.
    if (readHiBuffer) destroyBuffers(readHiBuffer);
    if (readLoBuffer) destroyBuffers(readLoBuffer);
  }
}
