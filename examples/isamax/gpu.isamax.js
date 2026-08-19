import { init, cleanup } from "wgblas";
import { isamax } from "wgblas/isamax";
import { sscal } from "wgblas/sscal";
import { GpuVector } from "wgblas/classes/GpuVector";

const device = await init();

const n = 5;
const scale = 2.0;
const x = new Float32Array([3, -7, 2, 5, -1]);

const xGpu = GpuVector.from(x);

console.log("x:        ", x);

await sscal(device, n, scale, xGpu, 1);
const { index } = await isamax(device, n, xGpu, 1);
console.log("index (of 2x): ", index);

xGpu.destroy();

if (typeof process !== "undefined") cleanup();
