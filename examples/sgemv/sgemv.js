import { init, cleanup } from "wgblas";
import { sgemv } from "wgblas/sgemv";

const device = await init();

// y = alpha*A*x + beta*y, with A a 2x3 row-major matrix.
const m = 2, n = 3, lda = n;
const A = new Float32Array([1, 2, 3,
                            4, 5, 6]);
const x = new Float32Array([1, 1, 1]);
const y = new Float32Array([0, 0]);

console.log("A =");
console.table([A.slice(0, 3),
               A.slice(3, 6)]);
console.log("x =", x);

const { y: result } = await sgemv(device, "no-transpose", m, n, 1, A, lda, x, 1, 0, y, 1);
console.log("y = A*x =", result);   // row sums: [1+2+3, 4+5+6] = [6, 15]

if (typeof process !== "undefined") cleanup();
