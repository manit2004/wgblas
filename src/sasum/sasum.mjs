import { uploadBuffer, createStorageBuffer, createParamsBuffer, createResultBuffer, stageReadback, destroyBuffers } from "../util/buffer.mjs";
import { createBindGroup } from "../util/bindgroup.mjs";
import { runComputePass, submit } from "../util/compute.mjs";
import { extractTimestamp } from "../util/benchmark.mjs";
import { extractResult } from "../util/result.mjs";
import { getPipeline } from "../util/pipeline.mjs";
import { GpuVector } from "../classes/GpuVector.mjs";

const WGS = 64; // workgroup size

export async function sasum(device, n, x, incx) {
    const xIsGpu = x instanceof GpuVector;

    if (!Number.isInteger(n) || !Number.isInteger(incx)) throw new Error("n and incx must be integers.");
    if (incx <= 0) throw new Error("incx must be positive.");
    if (!xIsGpu && !(x instanceof Float32Array)) throw new Error("x must be a Float32Array or GpuVector.");
    if (n <= 0) return { asum: 0 };
    if (x.length < (n - 1) * incx + 1) throw new Error("x does not have enough elements for the given n and incx.");

    const pipelineMain   = await getPipeline(device, "sasum");
    const pipelineReduce = await getPipeline(device, "reduction/sum");

    const xBuffer        = xIsGpu ? x._buf : uploadBuffer(x, "sasum-x", false);
    const partialsBuffer = createStorageBuffer((2 * WGS) * 4, "sasum-partials"); // 2*WGS partial sums of f32
    const resultBuffer   = createResultBuffer(4, "sasum-result"); // final f32 scalar
    const paramsBuffer   = createParamsBuffer([
        { value: n,    type: "u32" },
        { value: incx, type: "u32" },
    ], "sasum-params");

    const bgMain = createBindGroup(pipelineMain.getBindGroupLayout(0), [xBuffer, partialsBuffer, paramsBuffer]);
    const { commandEncoder: enc1, ts: ts1 } = runComputePass(pipelineMain, bgMain, 2 * WGS); // dispatch 2*WGS workgroups

    submit(enc1);

    const bgReduce = createBindGroup(pipelineReduce.getBindGroupLayout(0), [partialsBuffer, resultBuffer]);
    const { commandEncoder: enc2, ts: ts2 } = runComputePass(pipelineReduce, bgReduce, 1); // dispatch 1 workgroup to reduce the partial sums to a single result
    const readBuffer = stageReadback(enc2, resultBuffer);

    submit(enc2);

    const [gpuTime1, gpuTime2, asumArr] = await Promise.all([
        extractTimestamp(ts1),
        extractTimestamp(ts2),
        extractResult(readBuffer, Float32Array),
    ]);

    // asum is always a scalar readback — both paths return { asum }
    if (xIsGpu) {
        destroyBuffers(partialsBuffer, resultBuffer, paramsBuffer, readBuffer);
        if (gpuTime1 !== undefined && gpuTime2 !== undefined) return { asum: asumArr[0], gpuTimeMs: gpuTime1 + gpuTime2 };
        return { asum: asumArr[0] };
    }

    destroyBuffers(xBuffer, partialsBuffer, resultBuffer, paramsBuffer, readBuffer);
    if (gpuTime1 !== undefined && gpuTime2 !== undefined) return { asum: asumArr[0], gpuTimeMs: gpuTime1 + gpuTime2 };
    return { asum: asumArr[0] };
}
