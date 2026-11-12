import { init, cleanup } from "wgblas";
import { dsyr2k } from "wgblas/dsyr2k";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";

const device = await init();

// With B = A the two rank-k terms are equal, so the result is exactly twice
// dsyrk's on the same A.
const n = 3,
  k = 2;
const A = new Float64Array([1, 0, 0, 1, 1, 1]);

const AGpu = GpuMatrix.from(A, n, k, k, "row-major");
const BGpu = GpuMatrix.from(A.slice(), n, k, k, "row-major");
const CGpu = GpuMatrix.from(new Float64Array(n * n), n, n, n, "row-major");

console.log("A = B =");
console.table([A.slice(0, 2), A.slice(2, 4), A.slice(4, 6)]);

await dsyr2k(
  device,
  "upper",
  "no-transpose",
  n,
  k,
  1,
  AGpu,
  AGpu.lda,
  BGpu,
  BGpu.lda,
  0,
  CGpu,
  CGpu.lda,
);

const result = await CGpu.read();
console.log("C = upper(A*B^T + B*A^T) =");
console.table([result.slice(0, 3), result.slice(3, 6), result.slice(6, 9)]); // 2x dsyrk: [[2,0,2],[0,2,2],[0,0,4]]

AGpu.destroy();
BGpu.destroy();
CGpu.destroy();
if (typeof process !== "undefined") cleanup();
