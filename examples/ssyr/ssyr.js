import { init, cleanup } from "wgblas";
import { ssyr } from "wgblas/ssyr";

const device = await init();

// Symmetric rank-1 update A = alpha*x*x^T + A. Only the upper triangle is
// written, so entry (i,j) for j >= i is x[i]*x[j] and the rest stays zero.
const n = 3, lda = n;
const x = new Float32Array([1, 2, 3]);
const A = new Float32Array(n * lda);   // all zeros

console.log("x =", x);

const { A: result } = await ssyr(device, "upper", n, 1, x, 1, A, lda);
console.log("A = x*x^T (upper triangle) =");
console.table([result.slice(0, 3),
               result.slice(3, 6),
               result.slice(6, 9)]);   // [[1,2,3],[0,4,6],[0,0,9]]

if (typeof process !== "undefined") cleanup();
