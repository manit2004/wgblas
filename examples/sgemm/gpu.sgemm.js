import { init, cleanup } from "wgblas";
import { sgemm } from "wgblas/sgemm";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";

const device = await init();

// C = A*B with A 2x3 and B 3x2, so C is 2x2.
const m = 2, n = 2, k = 3;
const A = new Float32Array([1, 2, 3,
                            4, 5, 6]);
const B = new Float32Array([1, 0,
                            0, 1,
                            1, 1]);

const AGpu = GpuMatrix.from(A, m, k, k, "row-major");
const BGpu = GpuMatrix.from(B, k, n, n, "row-major");
const CGpu = GpuMatrix.from(new Float32Array(m * n), m, n, n, "row-major");

console.log("A =");
console.table([A.slice(0, 3),
               A.slice(3, 6)]);

await sgemm(device, "no-transpose", "no-transpose", m, n, k, 1, AGpu, AGpu.lda, BGpu, BGpu.lda, 0, CGpu, CGpu.lda);

const result = await CGpu.read();
console.log("C = A*B =");
console.table([result.slice(0, 2),
               result.slice(2, 4)]);   // [[4,5],[10,11]]

AGpu.destroy();
BGpu.destroy();
CGpu.destroy();
if (typeof process !== "undefined") cleanup();
