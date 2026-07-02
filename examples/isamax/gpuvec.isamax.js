import { init, cleanup } from "wgblas";
import { isamax } from "wgblas/isamax";
import { sscal } from "wgblas/sscal";
import { GpuVector } from "wgblas/classes/GpuVector";
import { randomFloat32Array } from "wgblas/random";

await init();

const n     = 10;
const scale = 2.0;
const x     = randomFloat32Array(n, -10, 10);

const xGpu = GpuVector.from(x);

console.log("x:        ", x);

await sscal(n, scale, xGpu, 1);
const { index } = await isamax(n, xGpu, 1);
console.log("index (of 2x): ", index);

xGpu.destroy();

if (typeof process !== "undefined") cleanup();
