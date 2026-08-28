import { init, cleanup } from "wgblas";
import { ssyr2 } from "wgblas/ssyr2";
import { GpuVector } from "wgblas/classes/GpuVector";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";

const device = await init();

// With y all ones, entry (i,j) of x*y^T + y*x^T is simply x[i] + x[j].
const n = 3;
const x = new Float32Array([1, 2, 3]);
const y = new Float32Array([1, 1, 1]);

const xGpu = GpuVector.from(x);
const yGpu = GpuVector.from(y);
const AGpu = GpuMatrix.from(new Float32Array(n * n), n, n, n, "row-major");

console.log("x =", x);
console.log("y =", y);

await ssyr2(device, "upper", n, 1, xGpu, 1, yGpu, 1, AGpu, AGpu.lda);
const result = await AGpu.read();
console.log("A = x*y^T + y*x^T (upper triangle) =");
console.table([result.slice(0, 3),
               result.slice(3, 6),
               result.slice(6, 9)]);   // [[2,3,4],[0,4,5],[0,0,6]]

xGpu.destroy();
yGpu.destroy();
AGpu.destroy();
if (typeof process !== "undefined") cleanup();
