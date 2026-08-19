import { init, cleanup } from "wgblas";
import { sasum } from "wgblas/sasum";
import { sscal } from "wgblas/sscal";
import { GpuVector } from "wgblas/classes/GpuVector";

const device = await init();

const n = 5;
const scale = 2.0;
const x = new Float32Array([1, -2, 3, -4, 5]);

const xGpu = GpuVector.from(x);

console.log("x:    ", x);

await sscal(device, n, scale, xGpu, 1);
const { asum } = await sasum(device, n, xGpu, 1);
console.log("asum (of 2x): ", asum);

xGpu.destroy();

if (typeof process !== "undefined") cleanup();
