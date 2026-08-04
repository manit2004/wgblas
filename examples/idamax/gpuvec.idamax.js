import { init, cleanup } from "wgblas";
import { idamax } from "wgblas/idamax";
import { GpuVector } from "wgblas/classes/GpuVector";
import { randomFloat64Array } from "wgblas/random";

const device = await init();

const n = 10;
const x = randomFloat64Array(n, -10, 10);

const xGpu = GpuVector.from(x);

console.log("x:     ", x);

const { index } = await idamax(device, n, xGpu, 1);
console.log("index: ", index);

xGpu.destroy();

if (typeof process !== "undefined") cleanup();
