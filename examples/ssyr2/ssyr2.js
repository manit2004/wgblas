import { init, cleanup } from "wgblas";
import { ssyr2 } from "wgblas/ssyr2";
import { randomFloat32Array } from "wgblas/random";

// Reshapes a flat row-major array into rows for console.table's 2D grid view.
function toMatrix(A, rows, cols, lda = cols) {
  const out = [];
  for (let r = 0; r < rows; r++)
    out.push(Array.from(A.subarray(r * lda, r * lda + cols), (v) => +v.toFixed(4)));
  return out;
}

const device = await init();

// 4×4 symmetric rank-2 update, lower triangle stored; lda = n
const n = 4, lda = n;
const alpha = 1.0;
const x = randomFloat32Array(n, -10, 10);
const y = randomFloat32Array(n, -10, 10);
const A = randomFloat32Array(n * lda, -10, 10); // only lower triangle is read/updated

console.log("x:", x);
console.log("y:", y);
console.log("A (lower triangle, before):");
console.table(toMatrix(A, n, n, lda));
const { A: result } = await ssyr2(device, "lower", n, alpha, x, 1, y, 1, A, lda, "row-major");
console.log("A (lower triangle, after):");
console.table(toMatrix(result, n, n, lda));
if (typeof process !== "undefined") cleanup();
