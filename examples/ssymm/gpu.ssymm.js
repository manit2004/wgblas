import { init, cleanup } from "wgblas";
import { ssymm } from "wgblas/ssymm";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";

const device = await init();

// A is symmetric with only its upper triangle stored. Taking B = identity
// makes C the full symmetric matrix A stands for.
const n = 3;
const A = new Float32Array([2, 1, 0,
                            0, 2, 1,
                            0, 0, 2]);
const B = new Float32Array([1, 0, 0,
                            0, 1, 0,
                            0, 0, 1]);

const AGpu = GpuMatrix.from(A, n, n, n, "row-major");
const BGpu = GpuMatrix.from(B, n, n, n, "row-major");
const CGpu = GpuMatrix.from(new Float32Array(n * n), n, n, n, "row-major");

console.log("A (upper triangle stored) =");
console.table([A.slice(0, 3),
               A.slice(3, 6),
               A.slice(6, 9)]);

await ssymm(device, "left", "upper", n, n, 1, AGpu, AGpu.lda, BGpu, BGpu.lda, 0, CGpu, CGpu.lda);

const result = await CGpu.read();
console.log("C = A*I = the full symmetric A =");
console.table([result.slice(0, 3),
               result.slice(3, 6),
               result.slice(6, 9)]);   // [[2,1,0],[1,2,1],[0,1,2]]

AGpu.destroy();
BGpu.destroy();
CGpu.destroy();
if (typeof process !== "undefined") cleanup();
