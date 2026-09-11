import { init, cleanup, GpuMatrix } from "wgblas";

await init();
// 2×3 matrix: [[1,2,3],[4,5,6]]
const mat = GpuMatrix.from(new Float32Array([1, 2, 3, 4, 5, 6]), 2, 3);
console.log(mat.rows, mat.cols, mat.lda); // 2 3 3

// Same logical matrix, column-major storage
const matCol = GpuMatrix.from(
  new Float32Array([1, 4, 2, 5, 3, 6]),
  2,
  3,
  undefined,
  "column-major",
);

mat.destroy();
matCol.destroy();
if (typeof process !== "undefined") cleanup();
