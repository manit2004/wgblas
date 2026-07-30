import { init, cleanup } from "wgblas";
import { ssyr } from "wgblas/ssyr";
import { GpuVector } from "wgblas/classes/GpuVector";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";
import { randomFloat32Array } from "wgblas/random";

const device = await init();

const n = 4;
const x = randomFloat32Array(n, -10, 10);
const A = randomFloat32Array(n * n, -10, 10);

const xGpu = GpuVector.from(x);
const AGpu = GpuMatrix.from(A, n, n);

console.log("x:", x);
console.log("A (before):", A);

// results stay on the GPU between steps
await ssyr(device, "lower", n, 1.0, xGpu, 1, AGpu, AGpu.lda); // A += x*x^T
await ssyr(device, "lower", n, 1.0, xGpu, 1, AGpu, AGpu.lda); // A += x*x^T again

// single readback
const result = await AGpu.read();
console.log("A (lower triangle, after two rank-1 updates):", result);

xGpu.destroy();
AGpu.destroy();

if (typeof process !== "undefined") cleanup();
