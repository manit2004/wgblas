import { init, cleanup } from "wgblas";
import { dsymv } from "wgblas/dsymv";
import { GpuVector } from "wgblas/classes/GpuVector";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";

const device = await init();

// Only the upper triangle is read; the zeros below stand for the mirrored 1s.
const n = 3;
const A = new Float64Array([2, 1, 0, 0, 2, 1, 0, 0, 2]);
const x = new Float64Array([1, 1, 1]);

const AGpu = GpuMatrix.from(A, n, n, n, "row-major");
const xGpu = GpuVector.from(x);
const yGpu = GpuVector.from(new Float64Array(n));

console.log("A (upper triangle stored) =");
console.table([A.slice(0, 3), A.slice(3, 6), A.slice(6, 9)]);
console.log("x =", x);

await dsymv(device, "upper", n, 1, AGpu, AGpu.lda, xGpu, 1, 0, yGpu, 1);
// Implied full matrix [[2,1,0],[1,2,1],[0,1,2]] -> row sums
console.log("y = A*x =", await yGpu.read()); // [3, 4, 3]

AGpu.destroy();
xGpu.destroy();
yGpu.destroy();
if (typeof process !== "undefined") cleanup();
