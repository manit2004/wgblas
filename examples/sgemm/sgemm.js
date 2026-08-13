import { init, cleanup } from "wgblas";
import { sgemm } from "wgblas/sgemm";
import { randomFloat32Array } from "wgblas/random";

const device = await init();

// 4×4 row-major matrices: A (m×k), B (k×n), C (m×n)
const m = 4, n = 4, k = 4;
const lda = k, ldb = n, ldc = n;
const alpha = 1.0, beta = 0.0;
const A = randomFloat32Array(m * lda, -10, 10);
const B = randomFloat32Array(k * ldb, -10, 10);
const C = randomFloat32Array(m * ldc, -10, 10);

console.log("A:", A);
console.log("B:", B);
console.log("C (input):", C);
const { C: result } = await sgemm(device, "no-transpose", "no-transpose", m, n, k, alpha, A, lda, B, ldb, beta, C, ldc, "row-major");
console.log("C (result):", result);
if (typeof process !== "undefined") cleanup();
