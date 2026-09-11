import { randomTriangularFloat32Array } from "wgblas";

const n = 4,
  lda = n;
const A = randomTriangularFloat32Array(
  n,
  lda,
  "lower",
  -1,
  1,
  5,
  15,
  "column-major",
);
console.log(A);
