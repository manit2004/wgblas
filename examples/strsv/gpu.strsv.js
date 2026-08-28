import { init, cleanup } from "wgblas";
import { strsv } from "wgblas/strsv";
import { GpuVector } from "wgblas/classes/GpuVector";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";

const device = await init();

// Solves A*x = b in place on the GPU: xGpu holds b going in, the solution out.
const n = 3;
const A = new Float32Array([2, 0, 0,
                            3, 4, 0,
                            5, 6, 8]);
const b = new Float32Array([2, 7, 19]);

const AGpu = GpuMatrix.from(A, n, n, n, "row-major");
const xGpu = GpuVector.from(b);

console.log("A (lower triangular) =");
console.table([A.slice(0, 3),
               A.slice(3, 6),
               A.slice(6, 9)]);
console.log("b =", b);

await strsv(device, "lower", "no-transpose", "non-unit", n, AGpu, AGpu.lda, xGpu, 1);
console.log("x (solves A*x = b) =", await xGpu.read());   // [1, 1, 1]

AGpu.destroy();
xGpu.destroy();
if (typeof process !== "undefined") cleanup();
