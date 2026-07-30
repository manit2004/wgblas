import { init, cleanup } from "wgblas";
import { sger } from "wgblas/sger";
import { randomFloat32Array } from "wgblas/random";

const device = await init();

// 4×5 rank-1 update; lda = n
const m = 4, n = 5, lda = n;
const alpha = 1.0;
const x = randomFloat32Array(m, -10, 10);
const y = randomFloat32Array(n, -10, 10);
const A = randomFloat32Array(m * lda, -10, 10);

console.log("x:", x);
console.log("y:", y);
const { A: result } = await sger(device, m, n, alpha, x, 1, y, 1, A, lda);
console.log("A:", result);
if (typeof process !== "undefined") cleanup();
