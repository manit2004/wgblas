import { init, cleanup } from "wgblas";
import { sgemm } from "wgblas/sgemm";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";
import { randomFloat32Array } from "wgblas/random";

const device = await init();

const n = 4;
const A = randomFloat32Array(n * n, -10, 10);
const B = randomFloat32Array(n * n, -10, 10);
const C = new Float32Array(n * n);

const AGpu = GpuMatrix.from(A, n, n, n, "row-major");
const BGpu = GpuMatrix.from(B, n, n, n, "row-major");
const CGpu = GpuMatrix.from(C, n, n, n, "row-major");

console.log("A:", A);
console.log("B:", B);

// results stay on the GPU between steps
await sgemm(device, "no-transpose", "no-transpose", n, n, n, 1.0, AGpu, AGpu.lda, BGpu, BGpu.lda, 0.0, CGpu, CGpu.lda); // C  = A*B
await sgemm(device, "no-transpose", "no-transpose", n, n, n, 1.0, AGpu, AGpu.lda, CGpu, CGpu.lda, 0.0, BGpu, BGpu.lda); // B  = A*C = A²*B

// single readback
const result = await BGpu.read();
console.log("A²B:", result);

AGpu.destroy();
BGpu.destroy();
CGpu.destroy();

if (typeof process !== "undefined") cleanup();
