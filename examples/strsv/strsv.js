import { init, cleanup } from "wgblas";
import { strsv } from "wgblas/strsv";
import { randomFloat32Array, randomTriangularFloat32Array } from "wgblas/random";

const device = await init();

// 4×4 triangular matrix, lower triangular storage; lda = n
const n = 4, lda = n;
const A = randomTriangularFloat32Array(n, lda, "lower", -10, 10);
const b = randomFloat32Array(n, -10, 10);

console.log("A (lower triangle):", A);
console.log("b:", b);
const { x } = await strsv(device, "lower", "no-transpose", "non-unit", n, A, lda, Float32Array.from(b), 1, "row-major");
console.log("x (solves A*x = b):", x);
if (typeof process !== "undefined") cleanup();
