import { init, cleanup } from "wgblas";
import { sdot } from "wgblas/sdot";
import { sscal } from "wgblas/sscal";
import { GpuVector } from "wgblas/classes/GpuVector";
import { randomFloat32Array } from "wgblas/random";

const device = await init();

const n     = 10;
const scale = 2.0;
const x     = randomFloat32Array(n, -10, 10);
const y     = randomFloat32Array(n, -10, 10);

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