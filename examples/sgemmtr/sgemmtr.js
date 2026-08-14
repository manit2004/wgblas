import { init, cleanup } from "wgblas";
import { sgemmtr } from "wgblas/sgemmtr";
import { randomFloat32Array } from "wgblas/random";

// Reshapes a flat row-major array into rows for console.table's 2D grid view.
function toMatrix(A, rows, cols, lda = cols) {
  const out = [];
  for (let r = 0; r < rows; r++)
    out.push(Array.from(A.subarray(r * lda, r * lda + cols), (v) => +v.toFixed(4)));
  return out;
}

const device = await init();

// 4×4 matrices: A (m×k), B (k×n), C (m×n) — only C's lower triangle is
// touched (uplo='lower'); the upper triangle stays exactly as passed in.
const m = 4, n = 4, k = 4;
const lda = k, ldb = n, ldc = n;
const alpha = 1.0, beta = 0.0;
const A = randomFloat32Array(m * lda, -10, 10);
const B = randomFloat32Array(k * ldb, -10, 10);
const C = randomFloat32Array(m * ldc, -10, 10);

console.log("A:", A);
console.log("B:", B);
console.log("C (before, upper triangle preserved):");
console.table(toMatrix(C, m, n, ldc));
const { C: result } = await sgemmtr(device, "lower", "no-transpose", "no-transpose", m, n, k, alpha, A, lda, B, ldb, beta, C, ldc, "row-major");
console.log("C (after, only lower triangle updated):");
console.table(toMatrix(result, m, n, ldc));
if (typeof process !== "undefined") cleanup();
