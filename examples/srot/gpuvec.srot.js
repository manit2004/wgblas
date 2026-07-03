import { init, cleanup } from "wgblas";
import { srot } from "wgblas/srot";
import { sscal } from "wgblas/sscal";
import { GpuVector } from "wgblas/classes/GpuVector";
import { randomFloat32Array } from "wgblas/random";

const device = await init();

const n = 10;
const xCpu = randomFloat32Array(n, -10, 10);
const yCpu = randomFloat32Array(n, -10, 10);

const xGpu = GpuVector.from(xCpu);
const yGpu = GpuVector.from(yCpu);

// 45-degree rotation
const c = Math.cos(Math.PI / 4);
const s = Math.sin(Math.PI / 4);

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
