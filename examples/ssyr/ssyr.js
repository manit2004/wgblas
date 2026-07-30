import { init, cleanup } from "wgblas";
import { ssyr } from "wgblas/ssyr";
import { randomFloat32Array } from "wgblas/random";

const device = await init();

// 4×4 symmetric rank-1 update, lower triangle stored; lda = n
const n = 4, lda = n;
const alpha = 1.0;
const x = randomFloat32Array(n, -10, 10);
const A = randomFloat32Array(n * lda, -10, 10); // only lower triangle is read/updated

console.log("x:", x);
console.log("A (lower triangle, before):", A);
const { A: result } = await ssyr(device, "lower", n, alpha, x, 1, A, lda);
console.log("A (lower triangle, after):", result);
if (typeof process !== "undefined") cleanup();
