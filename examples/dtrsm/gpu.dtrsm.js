import { init, cleanup } from "wgblas";
import { dtrsm } from "wgblas/dtrsm";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";

const device = await init();

// Solves A*X = B in place, A lower triangular. With B the identity, B ends
// up holding A's inverse, to about 15 correct digits (double-double).
const n = 3;
const A = new Float64Array([3, 0, 0, 1, 3, 0, 1, 1, 3]);
const B = new Float64Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);

const AGpu = GpuMatrix.from(A, n, n, n, "row-major");
const BGpu = GpuMatrix.from(B, n, n, n, "row-major");

console.log("A (lower triangular) =");
console.table([A.slice(0, 3), A.slice(3, 6), A.slice(6, 9)]);

await dtrsm(
  device,
  "left",
  "lower",
  "no-transpose",
  "non-unit",
  n,
  n,
  1,
  AGpu,
  AGpu.lda,
  BGpu,
  BGpu.lda,
);

const result = await BGpu.read();
console.log("X solving A*X = I, i.e. A's inverse =");
console.table([result.slice(0, 3), result.slice(3, 6), result.slice(6, 9)]);

AGpu.destroy();
BGpu.destroy();
if (typeof process !== "undefined") cleanup();
