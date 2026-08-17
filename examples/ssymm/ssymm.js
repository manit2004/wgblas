import { init, cleanup } from "wgblas";
import { ssymm } from "wgblas/ssymm";
import { randomFloat32Array } from "wgblas/random";

// Reshapes a flat row-major array into rows for console.table's 2D grid view.
function toMatrix(A, rows, cols, lda = cols) {
  const out = [];
  for (let r = 0; r < rows; r++)
    out.push(Array.from(A.subarray(r * lda, r * lda + cols), (v) => +v.toFixed(4)));
  return out;
}

const device = await init();

// C := alpha*A*B + beta*C — A is symmetric m×m (side='left'), only its
// lower triangle is meaningful; B and C are m×n. A's upper triangle here is
// left as random junk to demonstrate it's never read.
const m = 4, n = 3;
const lda = m, ldb = n, ldc = n;
const alpha = 1.0, beta = 0.0;
const A = randomFloat32Array(m * lda, -10, 10);
const B = randomFloat32Array(m * ldb, -10, 10);
const C = randomFloat32Array(m * ldc, -10, 10);

console.log("A (only lower triangle is meaningful):");
console.table(toMatrix(A, m, m, lda));
console.log("B:", B);
const { C: result } = await ssymm(device, "left", "lower", m, n, alpha, A, lda, B, ldb, beta, C, ldc, "row-major");
console.log("C = A*B:");
console.table(toMatrix(result, m, n, ldc));
if (typeof process !== "undefined") cleanup();
