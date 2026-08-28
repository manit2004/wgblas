import { init, cleanup } from "wgblas";
import { strmm } from "wgblas/strmm";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";

const device = await init();

// B := A*B in place, A lower triangular. Starting from the identity, B ends
// up holding the dense triangle of A.
const n = 3;
const A = new Float32Array([2, 0, 0,
                            3, 4, 0,
                            5, 6, 8]);
const B = new Float32Array([1, 0, 0,
                            0, 1, 0,
                            0, 0, 1]);

const AGpu = GpuMatrix.from(A, n, n, n, "row-major");
const BGpu = GpuMatrix.from(B, n, n, n, "row-major");

console.log("A (lower triangular) =");
console.table([A.slice(0, 3),
               A.slice(3, 6),
               A.slice(6, 9)]);

await strmm(device, "left", "lower", "no-transpose", "non-unit", n, n, 1, AGpu, AGpu.lda, BGpu, BGpu.lda);

const result = await BGpu.read();
console.log("B = A*I = A =");
console.table([result.slice(0, 3),
               result.slice(3, 6),
               result.slice(6, 9)]);

AGpu.destroy();
BGpu.destroy();
if (typeof process !== "undefined") cleanup();
