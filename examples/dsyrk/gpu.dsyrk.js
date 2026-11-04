import { init, cleanup } from "wgblas";
import { dsyrk } from "wgblas/dsyrk";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";

const device = await init();

// Entry (i,j) of C is the dot product of rows i and j of A; only the upper
// triangle is written.
const n = 3,
  k = 2;
const A = new Float64Array([1, 0, 0, 1, 1, 1]);

const AGpu = GpuMatrix.from(A, n, k, k, "row-major");
const CGpu = GpuMatrix.from(new Float64Array(n * n), n, n, n, "row-major");

console.log("A =");
console.table([A.slice(0, 2), A.slice(2, 4), A.slice(4, 6)]);

await dsyrk(
  device,
  "upper",
  "no-transpose",
  n,
  k,
  1,
  AGpu,
  AGpu.lda,
  0,
  CGpu,
  CGpu.lda,
);

const result = await CGpu.read();
console.log("C = upper(A*A^T) =");
console.table([result.slice(0, 3), result.slice(3, 6), result.slice(6, 9)]); // [[1,0,1],[0,1,1],[0,0,2]]

AGpu.destroy();
CGpu.destroy();
if (typeof process !== "undefined") cleanup();
