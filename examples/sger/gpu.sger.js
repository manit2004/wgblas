import { init, cleanup } from "wgblas";
import { sger } from "wgblas/sger";
import { GpuVector } from "wgblas/classes/GpuVector";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";

const device = await init();

// A starts at zero, so every entry of the result is just x[i]*y[j].
const m = 2, n = 3;
const x = new Float32Array([1, 2]);
const y = new Float32Array([10, 20, 30]);

const xGpu = GpuVector.from(x);
const yGpu = GpuVector.from(y);
const AGpu = GpuMatrix.from(new Float32Array(m * n), m, n, n, "row-major");

console.log("x =", x);
console.log("y =", y);

await sger(device, m, n, 1, xGpu, 1, yGpu, 1, AGpu, AGpu.lda);
const result = await AGpu.read();
console.log("A = x*y^T =");
console.table([result.slice(0, 3),
               result.slice(3, 6)]);   // [[10,20,30],[20,40,60]]

xGpu.destroy();
yGpu.destroy();
AGpu.destroy();
if (typeof process !== "undefined") cleanup();
