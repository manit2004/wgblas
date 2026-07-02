import { init, cleanup } from "wgblas";
import { srotm } from "wgblas/srotm";
import { saxpy } from "wgblas/saxpy";
import { GpuVector } from "wgblas/classes/GpuVector";
import { randomFloat32Array } from "wgblas/random";

await init();

const n = 10;
const xCpu = randomFloat32Array(n, -10, 10);
const yCpu = randomFloat32Array(n, -10, 10);

const xGpu = GpuVector.from(xCpu);
const yGpu = GpuVector.from(yCpu);

console.log("x (cpu):   ", xCpu);
console.log("y (cpu):   ", yCpu);

// flag = 0: unit diagonal — H = [ 1    h12 ]
//                                [ h21   1  ]
const param = new Float32Array([0, 1, -0.5, 0.5, 1]);

// shift y by adding 2*x on GPU, then apply modified rotation
await saxpy(n, 2.0, xGpu, 1, yGpu, 1);
await srotm(n, xGpu, 1, yGpu, 1, param);

console.log("x (after): ", await xGpu.read());
console.log("y (after): ", await yGpu.read());

xGpu.destroy();
yGpu.destroy();

if (typeof process !== "undefined") cleanup();
