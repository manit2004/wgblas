import { init, cleanup } from "wgblas";
import { strmm } from "wgblas/strmm";

const device = await init();

// B := alpha*op(A)*B with A lower triangular (entries above the diagonal are
// ignored). Taking B = identity makes the result the dense triangle of A.
const n = 3, lda = n;
const A = new Float32Array([2, 0, 0,
                            3, 4, 0,
                            5, 6, 8]);
const B = new Float32Array([1, 0, 0,
                            0, 1, 0,
                            0, 0, 1]);

console.log("A (lower triangular) =");
console.table([A.slice(0, 3),
               A.slice(3, 6),
               A.slice(6, 9)]);

const { B: result } = await strmm(device, "left", "lower", "no-transpose", "non-unit", n, n, 1, A, lda, B, lda);
console.log("B = A*I = A =");
console.table([result.slice(0, 3),
               result.slice(3, 6),
               result.slice(6, 9)]);

if (typeof process !== "undefined") cleanup();
