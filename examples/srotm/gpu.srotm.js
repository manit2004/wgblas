import { init, cleanup } from "wgblas";
import { srotm } from "wgblas/srotm";
import { saxpy } from "wgblas/saxpy";
import { GpuVector } from "wgblas/classes/GpuVector";

const device = await init();

const n = 5;
const xCpu = new Float32Array([1, 2, 3, 4, 5]);
const yCpu = new Float32Array([10, 20, 30, 40, 50]);

const xGpu = GpuVector.from(xCpu);
const yGpu = GpuVector.from(yCpu);

console.log("x (cpu):   ", xCpu);
console.log("y (cpu):   ", yCpu);

// flag = 0: unit diagonal — H = [ 1    h12 ]  =  [ 1  1 ]
//                                [ h21   1  ]     [ 2  1 ]
const param = new Float32Array([0, 1, 2, 1, 1]);

// shift y by adding 2*x on GPU, then apply modified rotation
await saxpy(device, n, 2.0, xGpu, 1, yGpu, 1);
await srotm(device, n, xGpu, 1, yGpu, 1, param);

console.log("x (after): ", await xGpu.read());
console.log("y (after): ", await yGpu.read());

xGpu.destroy();
yGpu.destroy();

if (typeof process !== "undefined") cleanup();
