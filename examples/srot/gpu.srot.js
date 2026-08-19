import { init, cleanup } from "wgblas";
import { srot } from "wgblas/srot";
import { sscal } from "wgblas/sscal";
import { GpuVector } from "wgblas/classes/GpuVector";

const device = await init();

const n = 5;
const xCpu = new Float32Array([1, 2, 3, 4, 5]);
const yCpu = new Float32Array([10, 20, 30, 40, 50]);

const xGpu = GpuVector.from(xCpu);
const yGpu = GpuVector.from(yCpu);

// c = 0, s = 1: a clean 90-degree rotation, so x' = y and y' = -x.
const c = 0;
const s = 1;

console.log("x (cpu):   ", xCpu);
console.log("y (cpu):   ", yCpu);

// scale x by 2 on GPU, then rotate both vectors
await sscal(device, n, 2.0, xGpu, 1);
await srot(device, n, xGpu, 1, yGpu, 1, c, s);

console.log("x (after): ", await xGpu.read());
console.log("y (after): ", await yGpu.read());

xGpu.destroy();
yGpu.destroy();

if (typeof process !== "undefined") cleanup();
