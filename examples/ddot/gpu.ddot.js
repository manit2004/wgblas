import { init, cleanup } from "wgblas";
import { ddot } from "wgblas/ddot";
import { GpuVector } from "wgblas/classes/GpuVector";

const device = await init();

const n = 5;
const x = new Float64Array([1, 1e-9, 2, 3, 4]);
const y = new Float64Array([1, 1, 1, 1, 1]);

const xGpu = GpuVector.from(x);
const yGpu = GpuVector.from(y);

console.log("x:   ", x);
console.log("y:   ", y);

const { dot } = await ddot(device, n, xGpu, 1, yGpu, 1);
console.log("dot: ", dot); // 10.000000001, not 10

xGpu.destroy();
yGpu.destroy();

if (typeof process !== "undefined") cleanup();
