import { init, cleanup } from "wgblas";
import { dsyr2 } from "wgblas/dsyr2";

const device = await init();

// Symmetric rank-2 update A = alpha*x*y^T + alpha*y*x^T + A. With y all ones,
// entry (i,j) is simply x[i] + x[j]. Only the upper triangle is written.
const n = 3,
  lda = n;
const x = new Float64Array([1, 2, 3]);
const y = new Float64Array([1, 1, 1]);
const A = new Float64Array(n * lda); // all zeros

console.log("x =", x);
console.log("y =", y);

const { A: result } = await dsyr2(device, "upper", n, 1, x, 1, y, 1, A, lda);
console.log("A = x*y^T + y*x^T (upper triangle) =");
console.table([result.slice(0, 3), result.slice(3, 6), result.slice(6, 9)]); // [[2,3,4],[0,4,5],[0,0,6]]

if (typeof process !== "undefined") cleanup();
