import { init, cleanup } from "wgblas";
import { saxpy } from "wgblas/saxpy";
import { sscal } from "wgblas/sscal";
import { GpuVector } from "wgblas/classes/GpuVector";

const device = await init();

const n = 5;
const alpha = 2;
const scale = 0.5;
const x = new Float32Array([1, 2, 3, 4, 5]);
const y = new Float32Array([10, 20, 30, 40, 50]);

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
