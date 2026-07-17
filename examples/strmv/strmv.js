import { init, cleanup } from "wgblas";
import { strmv } from "wgblas/strmv";
import { randomFloat32Array } from "wgblas/random";

const device = await init();

// 4×4 triangular matrix, lower triangular storage; lda = n
const n = 4, lda = n;
const A = randomFloat32Array(n * lda, -10, 10); // only lower triangle is read
const x = randomFloat32Array(n, -10, 10);
const y = new Float32Array(n);

console.log("A (lower triangle):", A);
console.log("x:", x);
const { y: result } = await strmv(device, "lower", "no-transpose", "non-unit", n, A, lda, x, 1, y, 1);
console.log("y:", result);
if (typeof process !== "undefined") cleanup();
