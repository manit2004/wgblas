import { init, cleanup } from "wgblas";
import { dtrmv } from "wgblas/dtrmv";
import { GpuVector } from "wgblas/classes/GpuVector";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";

const device = await init();

// Lower triangular; entries above the diagonal are ignored.
const n = 3;
const A = new Float64Array([2, 0, 0, 3, 4, 0, 5, 6, 8]);
const x = new Float64Array([1, 1, 1]);

const AGpu = GpuMatrix.from(A, n, n, n, "row-major");
const xGpu = GpuVector.from(x);
const yGpu = GpuVector.from(new Float64Array(n));

console.log("A (lower triangular) =");
console.table([A.slice(0, 3), A.slice(3, 6), A.slice(6, 9)]);
console.log("x =", x);

await dtrmv(
  device,
  "lower",
  "no-transpose",
  "non-unit",
  n,
  AGpu,
  AGpu.lda,
  xGpu,
  1,
  yGpu,
  1,
);
console.log("y = A*x =", await yGpu.read()); // [2, 3+4, 5+6+8] = [2, 7, 19]

AGpu.destroy();
xGpu.destroy();
yGpu.destroy();
if (typeof process !== "undefined") cleanup();
