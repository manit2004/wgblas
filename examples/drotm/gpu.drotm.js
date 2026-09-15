import { init, cleanup } from "wgblas";
import { drotm } from "wgblas/drotm";
import { daxpy } from "wgblas/daxpy";
import { GpuVector } from "wgblas/classes/GpuVector";

const device = await init();

const n = 5;
const xCpu = new Float64Array([1, 2, 3, 4, 5]);
const yCpu = new Float64Array([10, 20, 30, 40, 50]);

const xGpu = GpuVector.from(xCpu);
const yGpu = GpuVector.from(yCpu);

console.log("x (cpu):   ", xCpu);
console.log("y (cpu):   ", yCpu);

// flag = 0: unit diagonal — H = [ 1    h12 ]  =  [ 1  1 ]
//                                [ h21   1  ]     [ 2  1 ]
const param = new Float64Array([0, 1, 2, 1, 1]);

// shift y by adding 2*x on GPU, then apply modified rotation
await daxpy(device, n, 2.0, xGpu, 1, yGpu, 1);
await drotm(device, n, xGpu, 1, yGpu, 1, param);

console.log("x (after): ", await xGpu.read());
console.log("y (after): ", await yGpu.read());

xGpu.destroy();
yGpu.destroy();

if (typeof process !== "undefined") cleanup();
