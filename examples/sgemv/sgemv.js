import { init, cleanup } from "wgblas";
import { sgemv } from "wgblas/sgemv";
import { randomFloat32Array } from "wgblas/random";

const device = await init();

// 4×4 row-major matrix A, vector x of length 4, output y of length 4
const m = 4, n = 4, lda = n;
const alpha = 1.0, beta = 0.0;
const A = randomFloat32Array(m * lda, -10, 10);
const x = randomFloat32Array(n, -10, 10);
const y = randomFloat32Array(m, -10, 10);

console.log("A:", A);
console.log("x:", x);
const { y: result } = await sgemv(device, "no-transpose", m, n, alpha, A, lda, x, 1, beta, y, 1);
console.log("y:", result);
if (typeof process !== "undefined") cleanup();
