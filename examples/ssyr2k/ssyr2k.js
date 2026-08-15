import { init, cleanup } from "wgblas";
import { ssyr2k } from "wgblas/ssyr2k";
import { randomFloat32Array } from "wgblas/random";

// Reshapes a flat row-major array into rows for console.table's 2D grid view.
function toMatrix(A, rows, cols, lda = cols) {
  const out = [];
  for (let r = 0; r < rows; r++)
    out.push(Array.from(A.subarray(r * lda, r * lda + cols), (v) => +v.toFixed(4)));
  return out;
}

const device = await init();

// C := alpha*(A*B^T + B*A^T) + beta*C — A, B are 4×4, C is 4×4. Only C's
// lower triangle is touched (uplo='lower'); the upper triangle stays
// exactly as passed in.
const n = 4, k = 4;
const lda = k, ldb = k, ldc = n;
const alpha = 1.0, beta = 0.0;
const A = randomFloat32Array(n * lda, -10, 10);
const B = randomFloat32Array(n * ldb, -10, 10);
const C = randomFloat32Array(n * ldc, -10, 10);

console.log("A:", A);
console.log("B:", B);
console.log("C (before, upper triangle preserved):");
console.table(toMatrix(C, n, n, ldc));
const { C: result } = await ssyr2k(device, "lower", "no-transpose", n, k, alpha, A, lda, B, ldb, beta, C, ldc, "row-major");
console.log("C (after, only lower triangle updated):");
console.table(toMatrix(result, n, n, ldc));
if (typeof process !== "undefined") cleanup();
