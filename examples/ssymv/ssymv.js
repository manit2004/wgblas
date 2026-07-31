import { init, cleanup } from "wgblas";
import { ssymv } from "wgblas/ssymv";
import { randomFloat32Array } from "wgblas/random";

const device = await init();

// 4×4 symmetric matrix, lower triangular storage; lda = n
const n = 4, lda = n;
const alpha = 1.0, beta = 0.0;
const A = randomFloat32Array(n * lda, -10, 10); // only lower triangle is read
const x = randomFloat32Array(n, -10, 10);
const y = randomFloat32Array(n, -10, 10);

console.log("A (lower triangle):", A);
console.log("x:", x);
const { y: result } = await ssymv(device, "lower", n, alpha, A, lda, x, 1, beta, y, 1, "row-major");
console.log("y:", result);
if (typeof process !== "undefined") cleanup();
