import { init, cleanup } from "wgblas";
import { strsm } from "wgblas/strsm";
import { randomFloat32Array, randomTriangularFloat32Array } from "wgblas/random";

// Reshapes a flat row-major array into rows for console.table's 2D grid view.
function toMatrix(A, rows, cols, lda = cols) {
  const out = [];
  for (let r = 0; r < rows; r++)
    out.push(Array.from(A.subarray(r * lda, r * lda + cols), (v) => +v.toFixed(4)));
  return out;
}

const device = await init();

// Solves op(A)*X = alpha*B — A is triangular m×m (side='left'), only its
// lower triangle is meaningful; B is m×n and is overwritten with X.
const m = 4, n = 3;
const lda = m, ldb = n;
const alpha = 1.0;
const A = randomTriangularFloat32Array(m, lda, "lower", -1, 1);
const B = randomFloat32Array(m * ldb, -10, 10);

console.log("A (only lower triangle is meaningful):");
console.table(toMatrix(A, m, m, lda));
console.log("B (before, = alpha*A*X):");
console.table(toMatrix(B, m, n, ldb));
const { B: X } = await strsm(device, "left", "lower", "no-transpose", "non-unit", m, n, alpha, A, lda, B, ldb, "row-major");
console.log("X (after, solves A*X = B):");
console.table(toMatrix(X, m, n, ldb));
if (typeof process !== "undefined") cleanup();
