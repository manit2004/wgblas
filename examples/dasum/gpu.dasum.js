import { init, cleanup } from "wgblas";
import { dasum } from "wgblas/dasum";
import { GpuVector } from "wgblas/classes/GpuVector";

const device = await init();

const n = 5;
const x = new Float64Array([1, -2, 3, -4, 5]);

const xGpu = GpuVector.from(x);

console.log("x:    ", x);

const { asum } = await dasum(device, n, xGpu, 1);
console.log("asum: ", asum);

xGpu.destroy();

if (typeof process !== "undefined") cleanup();
