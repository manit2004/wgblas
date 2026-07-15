import { init, cleanup } from "wgblas";
import { sgemv } from "wgblas/sgemv";
import { GpuVector } from "wgblas/classes/GpuVector";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";
import { randomFloat32Array } from "wgblas/random";

const device = await init();

// 4×4 row-major matrix A, GPU-resident x and y
const m = 4, n = 4;
const alpha = 1.0, beta = 0.0;
const A = randomFloat32Array(m * n, -10, 10);
const x = randomFloat32Array(n, -10, 10);
const y = randomFloat32Array(m, -10, 10);

const AGpu = GpuMatrix.from(A, m, n);
const xGpu = GpuVector.from(x);
const yGpu = GpuVector.from(y);

console.log("A:", A);
console.log("x:", x);

// result stays GPU-resident
await sgemv(device, "no-transpose", m, n, alpha, AGpu, AGpu.lda, xGpu, 1, beta, yGpu, 1);

// single readback
const result = await yGpu.read();
console.log("y:", result);

AGpu.destroy();
xGpu.destroy();
yGpu.destroy();

if (typeof process !== "undefined") cleanup();
