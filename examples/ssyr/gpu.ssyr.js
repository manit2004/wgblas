import { init, cleanup } from "wgblas";
import { ssyr } from "wgblas/ssyr";
import { GpuVector } from "wgblas/classes/GpuVector";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";

const device = await init();

// Only the upper triangle is written: entry (i,j) for j >= i is x[i]*x[j].
const n = 3;
const x = new Float32Array([1, 2, 3]);

const xGpu = GpuVector.from(x);
const AGpu = GpuMatrix.from(new Float32Array(n * n), n, n, n, "row-major");

console.log("x =", x);

await ssyr(device, "upper", n, 1, xGpu, 1, AGpu, AGpu.lda);
const result = await AGpu.read();
console.log("A = x*x^T (upper triangle) =");
console.table([result.slice(0, 3),
               result.slice(3, 6),
               result.slice(6, 9)]);   // [[1,2,3],[0,4,6],[0,0,9]]

xGpu.destroy();
AGpu.destroy();
if (typeof process !== "undefined") cleanup();
