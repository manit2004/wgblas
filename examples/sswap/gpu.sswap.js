import { init, cleanup } from "wgblas";
import { sswap } from "wgblas/sswap";
import { sscal } from "wgblas/sscal";
import { GpuVector } from "wgblas/classes/GpuVector";

const device = await init();

const n = 5;
const alpha = 2.0;
const x = new Float32Array([1, 2, 3, 4, 5]);
const y = new Float32Array([10, 20, 30, 40, 50]);

const xGpu = GpuVector.from(x);
const yGpu = GpuVector.from(y);

console.log("x:               ", x);
console.log("y:               ", y);

await sswap(device, n, xGpu, 1, yGpu, 1);
await sscal(device, n, alpha, xGpu, 1);

// single readback
const resultX = await xGpu.read();
const resultY = await yGpu.read();
console.log("x (2 * orig y):  ", resultX);
console.log("y (orig x):      ", resultY);

xGpu.destroy();
yGpu.destroy();
if (typeof process !== "undefined") cleanup();
