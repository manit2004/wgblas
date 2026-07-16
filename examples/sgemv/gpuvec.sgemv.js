import { init, cleanup } from "wgblas";
import { sgemv } from "wgblas/sgemv";
import { GpuVector } from "wgblas/classes/GpuVector";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";
import { randomFloat32Array } from "wgblas/random";

const device = await init();

const n = 4;
const A = randomFloat32Array(n * n, -10, 10);
const x = randomFloat32Array(n, -10, 10);
const y = randomFloat32Array(n, -10, 10);

const AGpu = GpuMatrix.from(A, n, n);
const xGpu = GpuVector.from(x);
const yGpu = GpuVector.from(y);

console.log("A:", A);
console.log("x:", x);

// results stay on the GPU between steps
await sgemv(device, "no-transpose", n, n, 1.0, AGpu, AGpu.lda, xGpu, 1, 0.0, yGpu, 1); // y  = A*x
await sgemv(device, "no-transpose", n, n, 1.0, AGpu, AGpu.lda, yGpu, 1, 0.0, xGpu, 1); // x  = A*y = A²*x

// single readback
const result = await xGpu.read();
console.log("A²x:", result);

AGpu.destroy();
xGpu.destroy();
yGpu.destroy();

if (typeof process !== "undefined") cleanup();
