import { init, cleanup } from "wgblas";
import { strmm } from "wgblas/strmm";
import { randomFloat32Array } from "wgblas/random";

// Reshapes a flat row-major array into rows for console.table's 2D grid view.
function toMatrix(A, rows, cols, lda = cols) {
  const out = [];
  for (let r = 0; r < rows; r++)
    out.push(Array.from(A.subarray(r * lda, r * lda + cols), (v) => +v.toFixed(4)));
  return out;
}

const device = await init();

// B := alpha*op(A)*B — A is triangular m×m (side='left'), only its lower
// triangle is meaningful; B is m×n and is overwritten with the result. A's
// upper triangle here is left as random junk to demonstrate it's never read.
const m = 4, n = 3;
const lda = m, ldb = n;
const alpha = 1.0;
const A = randomFloat32Array(m * lda, -10, 10);
const B = randomFloat32Array(m * ldb, -10, 10);

console.log("A (only lower triangle is meaningful):");
console.table(toMatrix(A, m, m, lda));
console.log("B (before):");
console.table(toMatrix(B, m, n, ldb));
const { B: result } = await strmm(device, "left", "lower", "no-transpose", "non-unit", m, n, alpha, A, lda, B, ldb, "row-major");
console.log("B (after, = A*B):");
console.table(toMatrix(result, m, n, ldb));
if (typeof process !== "undefined") cleanup();
