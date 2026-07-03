import { init, cleanup } from "wgblas";
import { saxpy } from "wgblas/saxpy";
import { sscal } from "wgblas/sscal";
import { GpuVector } from "wgblas/classes/GpuVector";
import { randomFloat32Array } from "wgblas/random";

const device = await init();

const n     = 10;
const alpha = 2;
const scale = 0.5;
const x     = randomFloat32Array(n, -10, 10);
const y     = randomFloat32Array(n, -10, 10);

const xGpu = GpuVector.from(x);
const yGpu = GpuVector.from(y);

console.log("x:      ", x);
console.log("y:      ", y);

// results stay in the GPU.
await saxpy(device, n, alpha, xGpu, 1, yGpu, 1);
await sscal(device, n, scale, yGpu, 1);

// single readback
const result = await yGpu.read();
console.log("result: ", result);

xGpu.destroy();
yGpu.destroy();

if (typeof process !== "undefined") cleanup();
