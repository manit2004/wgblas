import { init, cleanup } from "wgblas";
import { dcopy } from "wgblas/dcopy";
import { dscal } from "wgblas/dscal";
import { GpuVector } from "wgblas/classes/GpuVector";

const device = await init();

const n = 5;
const scale = 2.0;
const x = new Float64Array([1, 2, 3, 4, 5]);
const y = new Float64Array(n);

const xGpu = GpuVector.from(x);
const yGpu = GpuVector.from(y);

console.log("x:      ", x);

// copy x into y, then scale y — all on GPU with single readback
await dcopy(device, n, xGpu, 1, yGpu, 1);
await dscal(device, n, scale, yGpu, 1);

const result = await yGpu.read();
console.log("result: ", result);

xGpu.destroy();
yGpu.destroy();

if (typeof process !== "undefined") cleanup();
