import { init, cleanup } from "wgblas";
import { strsm } from "wgblas/strsm";

const device = await init();

// Solves A*X = alpha*B for X, overwriting B. Passing B = A recovers the
// identity, undoing what the strmm example does.
const n = 3, lda = n;
const A = new Float32Array([2, 0, 0,
                            3, 4, 0,
                            5, 6, 8]);
const B = new Float32Array([2, 0, 0,
                            3, 4, 0,
                            5, 6, 8]);

console.log("A (lower triangular) = B =");
console.table([A.slice(0, 3),
               A.slice(3, 6),
               A.slice(6, 9)]);

const { B: result } = await strsm(device, "left", "lower", "no-transpose", "non-unit", n, n, 1, A, lda, B, lda);
console.log("X solving A*X = B, i.e. the identity =");
console.table([result.slice(0, 3),
               result.slice(3, 6),
               result.slice(6, 9)]);

if (typeof process !== "undefined") cleanup();
