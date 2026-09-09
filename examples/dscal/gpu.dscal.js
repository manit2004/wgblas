import { init, cleanup } from "wgblas";
import { dscal } from "wgblas/dscal";
import { GpuVector } from "wgblas/classes/GpuVector";

const device = await init();

const n = 5;
const alpha = 3;
const x = new Float64Array([1, 2, 3, 4, 5]);

const xGpu = GpuVector.from(x);

console.log("x:     ", x);

await dscal(device, n, alpha, xGpu, 1);

const result = await xGpu.read();
console.log("result:", result);

xGpu.destroy();
if (typeof process !== "undefined") cleanup();
