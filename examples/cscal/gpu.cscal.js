import { init, cleanup } from "wgblas";
import { cscal } from "wgblas/cscal";
import { GpuVector } from "wgblas/classes/GpuVector";
import { Complex32, Complex32Array } from "wgblas/classes/Complex32";

const device = await init();

const n = 3;
const alpha = new Complex32(2, 3); // 2 + 3i
const x = new Complex32Array([1, 1, 0, 2, 2, -1]); // 1+1i, 0+2i, 2-1i

const xGpu = GpuVector.from(x);

console.log("x:     ", x.map((z) => `${z.re}+${z.im}i`).join(", "));

await cscal(device, n, alpha, xGpu, 1);

const result = await xGpu.read();
console.log("result:", result.map((z) => `${z.re}+${z.im}i`).join(", "));

xGpu.destroy();
if (typeof process !== "undefined") cleanup();
