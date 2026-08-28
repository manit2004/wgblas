import { init, cleanup } from "wgblas";
import { sger } from "wgblas/sger";

const device = await init();

// Rank-1 update A = alpha*x*y^T + A. Starting from a zero A, every entry of the
// result is just x[i]*y[j].
const m = 2, n = 3, lda = n;
const x = new Float32Array([1, 2]);
const y = new Float32Array([10, 20, 30]);
const A = new Float32Array(m * lda);   // all zeros

console.log("x =", x);
console.log("y =", y);

const { A: result } = await sger(device, m, n, 1, x, 1, y, 1, A, lda);
console.log("A = x*y^T =");
console.table([result.slice(0, 3),
               result.slice(3, 6)]);   // [[10,20,30],[20,40,60]]

if (typeof process !== "undefined") cleanup();
