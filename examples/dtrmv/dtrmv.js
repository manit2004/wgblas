import { init, cleanup } from "wgblas";
import { dtrmv } from "wgblas/dtrmv";

const device = await init();

// y = op(A)*x with A lower triangular. Entries above the diagonal are ignored.
const n = 3,
  lda = n;
const A = new Float64Array([2, 0, 0, 3, 4, 0, 5, 6, 8]);
const x = new Float64Array([1, 1, 1]);
const y = new Float64Array([0, 0, 0]);

console.log("A (lower triangular) =");
console.table([A.slice(0, 3), A.slice(3, 6), A.slice(6, 9)]);
console.log("x =", x);

const { y: result } = await dtrmv(
  device,
  "lower",
  "no-transpose",
  "non-unit",
  n,
  A,
  lda,
  x,
  1,
  y,
  1,
);
console.log("y = A*x =", result); // row sums: [2, 3+4, 5+6+8] = [2, 7, 19]

if (typeof process !== "undefined") cleanup();
