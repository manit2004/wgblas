import { init, cleanup } from "wgblas";
import { sgemv } from "wgblas/sgemv";
import { GpuVector } from "wgblas/classes/GpuVector";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";

const device = await init();

// A diagonal A makes the chained result easy to check by eye.
const n = 3;
const A = new Float32Array([1, 0, 0,
                            0, 2, 0,
                            0, 0, 3]);
const x = new Float32Array([1, 1, 1]);

const AGpu = GpuMatrix.from(A, n, n, n, "row-major");
const xGpu = GpuVector.from(x);
const yGpu = GpuVector.from(new Float32Array(n));

console.log("A = diag(1, 2, 3) =");
console.table([A.slice(0, 3),
               A.slice(3, 6)]);
console.log("x =", x);

// Results stay on the GPU between the two calls — no readback in between.
await sgemv(device, "no-transpose", n, n, 1, AGpu, AGpu.lda, xGpu, 1, 0, yGpu, 1); // y = A*x
await sgemv(device, "no-transpose", n, n, 1, AGpu, AGpu.lda, yGpu, 1, 0, xGpu, 1); // x = A*y

// Single readback at the end.
console.log("A*A*x =", await xGpu.read());   // [1*1, 2*2, 3*3] = [1, 4, 9]

AGpu.destroy();
xGpu.destroy();
yGpu.destroy();
if (typeof process !== "undefined") cleanup();
