import { init, cleanup } from "wgblas";
import { idamax } from "wgblas/idamax";
import { GpuVector } from "wgblas/classes/GpuVector";

const device = await init();

const n = 5;
const x = new Float64Array([3, -7, 2, 5, -1]);

const xGpu = GpuVector.from(x);

console.log("x:     ", x);

const { index } = await idamax(device, n, xGpu, 1);
console.log("index: ", index);

xGpu.destroy();

if (typeof process !== "undefined") cleanup();
