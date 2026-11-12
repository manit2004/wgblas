import { init, cleanup } from "wgblas";
import { dsyr2k } from "wgblas/dsyr2k";

const device = await init();

// C = uplo(alpha*A*B^T + alpha*B*A^T + beta*C). With B = A the two terms are
// equal, so the result is exactly twice dsyrk's on the same A.
const n = 3,
  k = 2;
const A = new Float64Array([1, 0, 0, 1, 1, 1]);
const B = new Float64Array([1, 0, 0, 1, 1, 1]);
const C = new Float64Array(n * n);

console.log("A = B =");
console.table([A.slice(0, 2), A.slice(2, 4), A.slice(4, 6)]);

const { C: result } = await dsyr2k(
  device,
  "upper",
  "no-transpose",
  n,
  k,
  1,
  A,
  k,
  B,
  k,
  0,
  C,
  n,
);
console.log("C = upper(A*B^T + B*A^T) =");
console.table([result.slice(0, 3), result.slice(3, 6), result.slice(6, 9)]); // 2x dsyrk: [[2,0,2],[0,2,2],[0,0,4]]

if (typeof process !== "undefined") cleanup();
