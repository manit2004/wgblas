import { init, cleanup } from "wgblas";
import { sscal } from "wgblas/sscal";
import { saxpy } from "wgblas/saxpy";
import { GpuVector } from "wgblas/classes/GpuVector";

const device = await init();

const n = 5;
const alpha = 3;
const x = new Float32Array([1, 2, 3, 4, 5]);
const y = new Float32Array([10, 20, 30, 40, 50]);

const xGpu = GpuVector.from(x);
const yGpu = GpuVector.from(y);

console.log("x:              ", x);
console.log("y:              ", y);

await sscal(device, n, alpha, xGpu, 1);
await saxpy(device, n, 1.0, xGpu, 1, yGpu, 1);

const result = await yGpu.read();
console.log("result (3x + y):", result);

xGpu.destroy();
yGpu.destroy();
if (typeof process !== "undefined") cleanup();
