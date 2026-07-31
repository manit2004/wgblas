import { init, cleanup } from "wgblas";
import { sger } from "wgblas/sger";
import { randomFloat32Array } from "wgblas/random";

// Reshapes a flat row-major array into rows for console.table's 2D grid view.
function toMatrix(A, rows, cols, lda = cols) {
  const out = [];
  for (let r = 0; r < rows; r++)
    out.push(Array.from(A.subarray(r * lda, r * lda + cols), (v) => +v.toFixed(4)));
  return out;
}

const device = await init();

// 4×5 rank-1 update; lda = n
const m = 4, n = 5, lda = n;
const alpha = 1.0;
const x = randomFloat32Array(m, -10, 10);
const y = randomFloat32Array(n, -10, 10);
const A = randomFloat32Array(m * lda, -10, 10);

console.log("x:", x);
console.log("y:", y);
console.log("A (before):");
console.table(toMatrix(A, m, n, lda));
const { A: result } = await sger(device, m, n, alpha, x, 1, y, 1, A, lda, "row-major");
console.log("A (after):");
console.table(toMatrix(result, m, n, lda));
if (typeof process !== "undefined") cleanup();
