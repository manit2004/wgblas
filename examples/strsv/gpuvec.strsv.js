import { init, cleanup } from "wgblas";
import { strsv } from "wgblas/strsv";
import { GpuVector } from "wgblas/classes/GpuVector";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";
import { randomFloat32Array, randomTriangularFloat32Array } from "wgblas/random";

const device = await init();

const n = 4;
const A = randomTriangularFloat32Array(n, n, "lower", -10, 10);
const b = randomFloat32Array(n, -10, 10);

const AGpu = GpuMatrix.from(A, n, n, n, "row-major");
const xGpu = GpuVector.from(Float32Array.from(b));

console.log("A (lower triangle):", A);
console.log("b:", b);

// x is mutated in place on the GPU: holds b on input, the solution on output
await strsv(device, "lower", "no-transpose", "non-unit", n, AGpu, AGpu.lda, xGpu, 1);

// single readback
const result = await xGpu.read();
console.log("x (solves A*x = b):", result);

AGpu.destroy();
xGpu.destroy();

if (typeof process !== "undefined") cleanup();
