import { randomTriangularFloat32Array } from "wgblas";

const n = 4,
  lda = n;
const A = randomTriangularFloat32Array(n, lda, "lower");
console.log(A);
