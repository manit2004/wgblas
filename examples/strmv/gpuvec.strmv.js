import { init, cleanup } from "wgblas";
import { strmv } from "wgblas/strmv";
import { GpuVector } from "wgblas/classes/GpuVector";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";
import { randomFloat32Array } from "wgblas/random";

const device = await init();

const n = 4;
const A = randomFloat32Array(n * n, -10, 10); // lower triangle is the stored triangle
const x = randomFloat32Array(n, -10, 10);
const y = new Float32Array(n);

const AGpu = GpuMatrix.from(A, n, n, n, "row-major");
const xGpu = GpuVector.from(x);
const yGpu = GpuVector.from(y);

console.log("A (lower triangle):", A);
console.log("x:", x);

// results stay on the GPU between steps
await strmv(device, "lower", "no-transpose", "non-unit", n, AGpu, AGpu.lda, xGpu, 1, yGpu, 1); // y = A*x
await strmv(device, "lower", "no-transpose", "non-unit", n, AGpu, AGpu.lda, yGpu, 1, xGpu, 1); // x = A*y = A²*x

// single readback
const result = await xGpu.read();
console.log("A²x:", result);

AGpu.destroy();
xGpu.destroy();
yGpu.destroy();

if (typeof process !== "undefined") cleanup();
