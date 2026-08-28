import { init, cleanup } from "wgblas";
import { strsv } from "wgblas/strsv";

const device = await init();

// Solves A*x = b in place: x holds b going in, the solution coming out.
// Same A and b as the strmv example, so this undoes that multiply.
const n = 3, lda = n;
const A = new Float32Array([2, 0, 0,
                            3, 4, 0,
                            5, 6, 8]);
const x = new Float32Array([2, 7, 19]);   // b

console.log("A (lower triangular) =");
console.table([A.slice(0, 3),
               A.slice(3, 6),
               A.slice(6, 9)]);
console.log("b =", x);

const { x: result } = await strsv(device, "lower", "no-transpose", "non-unit", n, A, lda, x, 1);
console.log("x (solves A*x = b) =", result);   // [1, 1, 1]

if (typeof process !== "undefined") cleanup();
