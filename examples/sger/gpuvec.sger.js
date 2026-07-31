import { init, cleanup } from "wgblas";
import { sger } from "wgblas/sger";
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

const m = 4, n = 5;
const x = randomFloat32Array(m, -10, 10);
const y = randomFloat32Array(n, -10, 10);
const A = randomFloat32Array(m * n, -10, 10);

const xGpu = GpuVector.from(x);
const yGpu = GpuVector.from(y);
const AGpu = GpuMatrix.from(A, m, n);

console.log("x:", x);
console.log("y:", y);
console.log("A (before):");
console.table(toMatrix(A, m, n));

// results stay on the GPU between steps
await sger(device, m, n, 1.0, xGpu, 1, yGpu, 1, AGpu, AGpu.lda); // A += x*y^T
await sger(device, m, n, 1.0, xGpu, 1, yGpu, 1, AGpu, AGpu.lda); // A += x*y^T again

// single readback (GpuMatrix.read() is already dense — no lda padding to strip)
const result = await AGpu.read();
console.log("A (after two rank-1 updates):");
console.table(toMatrix(result, m, n));

xGpu.destroy();
yGpu.destroy();
AGpu.destroy();

if (typeof process !== "undefined") cleanup();
