import { init, cleanup } from "wgblas";
import { ssymm } from "wgblas/ssymm";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";
import { randomFloat32Array } from "wgblas/random";

function toMatrix(A, rows, cols, lda = cols) {
  const out = [];
  for (let r = 0; r < rows; r++)
    out.push(Array.from(A.subarray(r * lda, r * lda + cols), (v) => +v.toFixed(4)));
  return out;
}

const device = await init();

const m = 4, n = 3;
const A = randomFloat32Array(m * m, -10, 10);
const B = randomFloat32Array(m * n, -10, 10);
const C = new Float32Array(m * n);

const AGpu = GpuMatrix.from(A, m, m, m, "row-major");
const BGpu = GpuMatrix.from(B, m, n, n, "row-major");
const CGpu = GpuMatrix.from(C, m, n, n, "row-major");

console.log("A (only lower triangle is meaningful):");
console.table(toMatrix(A, m, m, m));
console.log("B:", B);

// C stays on the GPU throughout.
await ssymm(device, "left", "lower", m, n, 1.0, AGpu, AGpu.lda, BGpu, BGpu.lda, 0.0, CGpu, CGpu.lda); // C = A*B

// single readback
const result = await CGpu.read();
console.log("C = A*B:");
console.table(toMatrix(result, m, n, n));

AGpu.destroy();
BGpu.destroy();
CGpu.destroy();

if (typeof process !== "undefined") cleanup();
