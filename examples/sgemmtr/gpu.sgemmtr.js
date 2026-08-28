import { init, cleanup } from "wgblas";
import { sgemmtr } from "wgblas/sgemmtr";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";

const device = await init();

// A all ones times the identity is all ones, so the masking is obvious:
// only the upper triangle of C is written.
const n = 3;
const A = new Float32Array([1, 1, 1,
                            1, 1, 1,
                            1, 1, 1]);
const B = new Float32Array([1, 0, 0,
                            0, 1, 0,
                            0, 0, 1]);

const AGpu = GpuMatrix.from(A, n, n, n, "row-major");
const BGpu = GpuMatrix.from(B, n, n, n, "row-major");
const CGpu = GpuMatrix.from(new Float32Array(n * n), n, n, n, "row-major");

console.log("A = all ones, B = identity, so A*B is all ones");

await sgemmtr(device, "upper", "no-transpose", "no-transpose", n, n, n, 1, AGpu, AGpu.lda, BGpu, BGpu.lda, 0, CGpu, CGpu.lda);

const result = await CGpu.read();
console.log("C = upper(A*B) =");
console.table([result.slice(0, 3),
               result.slice(3, 6),
               result.slice(6, 9)]);   // [[1,1,1],[0,1,1],[0,0,1]]

AGpu.destroy();
BGpu.destroy();
CGpu.destroy();
if (typeof process !== "undefined") cleanup();
