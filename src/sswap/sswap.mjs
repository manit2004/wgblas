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

export async function sswap(device, n, x, incx, y, incy) {
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
  if (!(x instanceof Float32Array) && !(x instanceof GpuVector))
    throw new Error("x must be a Float32Array or GpuVector.");
  if (!(y instanceof Float32Array) && !(y instanceof GpuVector))
    throw new Error("y must be a Float32Array or GpuVector.");
  if (x.constructor !== y.constructor)
    throw new Error(
      "x and y must be the same type (both Float32Array or both GpuVector).",
    );
  if (n <= 0) return xIsGpu ? {} : { x, y };
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  if (y.length < (n - 1) * incy + 1)
    throw new Error(
      "y does not have enough elements for the given n and incy.",
    );

  const pipeline = await getPipeline(device, "sswap");

  const xBuffer = xIsGpu ? x._buf : uploadBuffer(x, "sswap-x", true);
  const yBuffer = yIsGpu ? y._buf : uploadBuffer(y, "sswap-y", true);
  const paramsBuffer = createParamsBuffer(
    [
      { value: n, type: "u32" },
      { value: incx, type: "u32" },
      { value: incy, type: "u32" },
    ],
    "sswap-params",
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
  const xReadBuffer = xIsGpu ? null : stageReadback(commandEncoder, xBuffer);
  const yReadBuffer = yIsGpu ? null : stageReadback(commandEncoder, yBuffer);

  submit(commandEncoder);

  const gpuTimeMs = await extractTimestamp(ts);

  if (xIsGpu && yIsGpu) {
    destroyBuffers(paramsBuffer);
    if (gpuTimeMs !== undefined) return { gpuTimeMs };
    return {};
  }

  const resultX = await extractResult(xReadBuffer, Float32Array);
  const resultY = await extractResult(yReadBuffer, Float32Array);

  destroyBuffers(xBuffer, yBuffer, paramsBuffer);

  if (gpuTimeMs !== undefined) return { x: resultX, y: resultY, gpuTimeMs };
  return { x: resultX, y: resultY };
}
