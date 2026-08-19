import { init, cleanup } from "wgblas";
import { sdot } from "wgblas/sdot";
import { sscal } from "wgblas/sscal";
import { GpuVector } from "wgblas/classes/GpuVector";

const device = await init();

const n = 5;
const scale = 2.0;
const x = new Float32Array([1, 2, 3, 4, 5]);
const y = new Float32Array([1, 1, 1, 1, 1]);

const xGpu = GpuVector.from(x);
const yGpu = GpuVector.from(y);

console.log("x:   ", x);
console.log("y:   ", y);

await sscal(device, n, scale, xGpu, 1);
const { dot } = await sdot(device, n, xGpu, 1, yGpu, 1);
console.log("dot: ", dot);

xGpu.destroy();
yGpu.destroy();

if (typeof process !== "undefined") cleanup();
