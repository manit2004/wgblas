import { init, cleanup } from "wgblas";
import { snrm2 } from "wgblas/snrm2";
import { sscal } from "wgblas/sscal";
import { GpuVector } from "wgblas/classes/GpuVector";
import { randomFloat32Array } from "wgblas/random";

await init();

const n     = 10;
const scale = 2.0;
const x     = randomFloat32Array(n, -10, 10);

const xGpu = GpuVector.from(x);

console.log("x:    ", x);

await sscal(n, scale, xGpu, 1);
const { nrm2 } = await snrm2(n, xGpu, 1);
console.log("nrm2 (of 2x): ", nrm2);

xGpu.destroy();

if (typeof process !== "undefined") cleanup();
