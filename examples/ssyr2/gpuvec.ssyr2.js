import { init, cleanup } from "wgblas";
import { ssyr2 } from "wgblas/ssyr2";
import { GpuVector } from "wgblas/classes/GpuVector";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";
import { randomFloat32Array } from "wgblas/random";

// Reshapes a flat row-major array into rows for console.table's 2D grid view.
function toMatrix(A, rows, cols, lda = cols) {
  const out = [];
  for (let r = 0; r < rows; r++)
    out.push(Array.from(A.subarray(r * lda, r * lda + cols), (v) => +v.toFixed(4)));
  return out;
}

const device = await init();

const n = 4;
const x = randomFloat32Array(n, -10, 10);
const y = randomFloat32Array(n, -10, 10);
const A = randomFloat32Array(n * n, -10, 10);

const xGpu = GpuVector.from(x);
const yGpu = GpuVector.from(y);
const AGpu = GpuMatrix.from(A, n, n);

console.log("x:", x);
console.log("y:", y);
console.log("A (before):");
console.table(toMatrix(A, n, n));

// results stay on the GPU between steps
await ssyr2(device, "lower", n, 1.0, xGpu, 1, yGpu, 1, AGpu, AGpu.lda); // A += x*y^T + y*x^T
await ssyr2(device, "lower", n, 1.0, xGpu, 1, yGpu, 1, AGpu, AGpu.lda); // A += x*y^T + y*x^T again

// single readback (GpuMatrix.read() is already dense — no lda padding to strip)
const result = await AGpu.read();
console.log("A (lower triangle, after two rank-2 updates):");
console.table(toMatrix(result, n, n));

xGpu.destroy();
yGpu.destroy();
AGpu.destroy();

if (typeof process !== "undefined") cleanup();
