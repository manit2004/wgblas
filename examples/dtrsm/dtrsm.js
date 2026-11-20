import { init, cleanup } from "wgblas";
import { dtrsm } from "wgblas/dtrsm";

const device = await init();

// Solves A*X = alpha*B for X, overwriting B. With B the identity, X is A's
// inverse, whose thirds show the precision: about 15 correct digits
// (double-double's ~48 bits, a little short of f64's 53).
const n = 3,
  lda = n;
const A = new Float64Array([3, 0, 0, 1, 3, 0, 1, 1, 3]);
const B = new Float64Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);

console.log("A (lower triangular) =");
console.table([A.slice(0, 3), A.slice(3, 6), A.slice(6, 9)]);

const { B: result } = await dtrsm(
  device,
  "left",
  "lower",
  "no-transpose",
  "non-unit",
  n,
  n,
  1,
  A,
  lda,
  B,
  lda,
);
console.log("X solving A*X = I, i.e. A's inverse =");
console.table([result.slice(0, 3), result.slice(3, 6), result.slice(6, 9)]);

if (typeof process !== "undefined") cleanup();
