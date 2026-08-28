import { init, cleanup } from "wgblas";
import { strsm } from "wgblas/strsm";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";

const device = await init();

// Solves A*X = B in place on the GPU. Passing B = A recovers the identity,
// undoing what the strmm example does.
const n = 3;
const A = new Float32Array([2, 0, 0,
                            3, 4, 0,
                            5, 6, 8]);

const AGpu = GpuMatrix.from(A, n, n, n, "row-major");
const BGpu = GpuMatrix.from(A.slice(), n, n, n, "row-major");

console.log("A (lower triangular) = B =");
console.table([A.slice(0, 3),
               A.slice(3, 6),
               A.slice(6, 9)]);

await strsm(device, "left", "lower", "no-transpose", "non-unit", n, n, 1, AGpu, AGpu.lda, BGpu, BGpu.lda);

const result = await BGpu.read();
console.log("X solving A*X = B, i.e. the identity =");
console.table([result.slice(0, 3),
               result.slice(3, 6),
               result.slice(6, 9)]);

AGpu.destroy();
BGpu.destroy();
if (typeof process !== "undefined") cleanup();
