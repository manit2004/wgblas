import { init, cleanup } from "wgblas";
import { ssymv } from "wgblas/ssymv";

const device = await init();

// y = alpha*A*x + beta*y, A symmetric. Only the upper triangle is read, so the
// zeros below the diagonal stand for the mirrored values.
const n = 3, lda = n;
const A = new Float32Array([2, 1, 0,
                            0, 2, 1,
                            0, 0, 2]);
const x = new Float32Array([1, 1, 1]);
const y = new Float32Array([0, 0, 0]);

console.log("A (upper triangle stored) =");
console.table([A.slice(0, 3),
               A.slice(3, 6),
               A.slice(6, 9)]);
console.log("x =", x);

const { y: result } = await ssymv(device, "upper", n, 1, A, lda, x, 1, 0, y, 1);
// Implied full matrix is [[2,1,0],[1,2,1],[0,1,2]] -> row sums [3, 4, 3]
console.log("y = A*x =", result);

if (typeof process !== "undefined") cleanup();
