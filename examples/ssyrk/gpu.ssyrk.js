import { init, cleanup } from "wgblas";
import { ssyrk } from "wgblas/ssyrk";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";
import { randomFloat32Array } from "wgblas/random";

function toMatrix(A, rows, cols, lda = cols) {
  const out = [];
  for (let r = 0; r < rows; r++)
    out.push(Array.from(A.subarray(r * lda, r * lda + cols), (v) => +v.toFixed(4)));
  return out;
}

const device = await init();

const n = 4;
const A = randomFloat32Array(n * n, -10, 10);
const C = new Float32Array(n * n);

const AGpu = GpuMatrix.from(A, n, n, n, "row-major");
const CGpu = GpuMatrix.from(C, n, n, n, "row-major");

console.log("A:", A);

// C stays on the GPU; only its lower triangle is ever written.
await ssyrk(device, "lower", "no-transpose", n, n, 1.0, AGpu, AGpu.lda, 0.0, CGpu, CGpu.lda); // C (lower) = A*A^T

// single readback
const result = await CGpu.read();
console.log("C (lower triangle = A*A^T, upper triangle untouched zeros):");
console.table(toMatrix(result, n, n, n));

AGpu.destroy();
CGpu.destroy();

if (typeof process !== "undefined") cleanup();
