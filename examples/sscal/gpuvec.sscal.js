import { init, cleanup } from "wgblas";
import { sscal } from "wgblas/sscal";
import { saxpy } from "wgblas/saxpy";
import { GpuVector } from "wgblas/classes/GpuVector";
import { randomFloat32Array } from "wgblas/random";

await init();

const n     = 10;
const alpha = 2.0;
const x     = randomFloat32Array(n, -10, 10);
const y     = randomFloat32Array(n, -10, 10);

const xGpu = GpuVector.from(x);
const yGpu = GpuVector.from(y);

console.log("x:              ", x);
console.log("y:              ", y);

await sscal(n, alpha, xGpu, 1);
await saxpy(n, 1.0, xGpu, 1, yGpu, 1);

const result = await yGpu.read();
console.log("result (2x + y):", result);

xGpu.destroy();
yGpu.destroy();
if (typeof process !== "undefined") cleanup();
