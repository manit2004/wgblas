import { init, cleanup } from "wgblas";
import { snrm2 } from "wgblas/snrm2";
import { sscal } from "wgblas/sscal";
import { GpuVector } from "wgblas/classes/GpuVector";

const device = await init();

// 2^2 + 3^2 + 6^2 = 49 = 7^2, so the norm comes out to a clean 7 (14 once scaled).
const n = 3;
const scale = 2.0;
const x = new Float32Array([2, 3, 6]);

const xGpu = GpuVector.from(x);

console.log("x:    ", x);

await sscal(device, n, scale, xGpu, 1);
const { nrm2 } = await snrm2(device, n, xGpu, 1);
console.log("nrm2 (of 2x): ", nrm2);

xGpu.destroy();

if (typeof process !== "undefined") cleanup();
