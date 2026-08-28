import { init, cleanup } from "wgblas";
import { strmv } from "wgblas/strmv";
import { GpuVector } from "wgblas/classes/GpuVector";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";

const device = await init();

// Lower triangular; entries above the diagonal are ignored.
const n = 3;
const A = new Float32Array([2, 0, 0,
                            3, 4, 0,
                            5, 6, 8]);
const x = new Float32Array([1, 1, 1]);

const AGpu = GpuMatrix.from(A, n, n, n, "row-major");
const xGpu = GpuVector.from(x);
const yGpu = GpuVector.from(new Float32Array(n));

console.log("A (lower triangular) =");
console.table([A.slice(0, 3),
               A.slice(3, 6),
               A.slice(6, 9)]);
console.log("x =", x);

await strmv(device, "lower", "no-transpose", "non-unit", n, AGpu, AGpu.lda, xGpu, 1, yGpu, 1);
console.log("y = A*x =", await yGpu.read());   // [2, 3+4, 5+6+8] = [2, 7, 19]

AGpu.destroy();
xGpu.destroy();
yGpu.destroy();
if (typeof process !== "undefined") cleanup();
