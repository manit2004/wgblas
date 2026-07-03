import { uploadBuffer, createParamsBuffer, stageReadback, destroyBuffers } from "../util/buffer.mjs";
import { createBindGroup } from "../util/bindgroup.mjs";
import { runComputePass, submit } from "../util/compute.mjs";
import { extractTimestamp } from "../util/benchmark.mjs";
import { extractResult } from "../util/result.mjs";
import { getPipeline } from "../util/pipeline.mjs";
import { calcWorkgroups } from "../util/workgroup.mjs";
import { GpuVector } from "../classes/GpuVector.mjs";

export async function srotm(device, n, x, incx, y, incy, param) {
    const xIsGpu = x instanceof GpuVector;
    const yIsGpu = y instanceof GpuVector;

    if (!Number.isInteger(n) || !Number.isInteger(incx) || !Number.isInteger(incy)) throw new Error("n, incx, and incy must be integers.");
    if (!(param instanceof Float32Array) || param.length !== 5) throw new Error("param must be a Float32Array of length 5.");
    if (incx <= 0 || incy <= 0) throw new Error("incx and incy must be positive.");
    if (!xIsGpu && !(x instanceof Float32Array)) throw new Error("x must be a Float32Array or GpuVector.");
    if (!yIsGpu && !(y instanceof Float32Array)) throw new Error("y must be a Float32Array or GpuVector.");
    if (xIsGpu !== yIsGpu) throw new Error("x and y must be the same type (both Float32Array or both GpuVector).");
    if (n <= 0 || param[0] === -2.0) return xIsGpu ? {} : { x, y };
    if (x.length < (n - 1) * incx + 1) throw new Error("x does not have enough elements for the given n and incx.");
    if (y.length < (n - 1) * incy + 1) throw new Error("y does not have enough elements for the given n and incy.");

    const pipeline = await getPipeline(device, "srotm");

    const xBuffer     = xIsGpu ? x._buf : uploadBuffer(x, "srotm-x", true);
    const yBuffer     = yIsGpu ? y._buf : uploadBuffer(y, "srotm-y", true);
    const paramBuffer = uploadBuffer(param, "srotm-param", false);
    const paramsBuffer = createParamsBuffer([
        { value: n,    type: "u32" },
        { value: incx, type: "u32" },
        { value: incy, type: "u32" },
    ], "srotm-params");

    const bindGroup = createBindGroup(pipeline.getBindGroupLayout(0), [xBuffer, yBuffer, paramBuffer, paramsBuffer]);
    const { commandEncoder, ts } = runComputePass(pipeline, bindGroup, calcWorkgroups(n));
    const readX = xIsGpu ? null : stageReadback(commandEncoder, xBuffer);
    const readY = yIsGpu ? null : stageReadback(commandEncoder, yBuffer);
    submit(commandEncoder);

    const gpuTimeMs = await extractTimestamp(ts);

    if (xIsGpu && yIsGpu) {
        destroyBuffers(paramBuffer, paramsBuffer);
        if (gpuTimeMs !== undefined) return { gpuTimeMs };
        return {};
    }

    const [xResult, yResult] = await Promise.all([
        extractResult(readX, Float32Array),
        extractResult(readY, Float32Array),
    ]);
    destroyBuffers(xBuffer, yBuffer, paramBuffer, paramsBuffer, readX, readY);

    if (gpuTimeMs !== undefined) return { x: xResult, y: yResult, gpuTimeMs };
    return { x: xResult, y: yResult };
}
