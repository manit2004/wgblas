import { init, cleanup, sscal } from "wgblas";

const device = await init({ benchmark: true });
const n = 5;
const alpha = 2.0;
const x = new Float32Array([1, 2, 3, 4, 5]);
const { x: result, gpuTimeMs } = await sscal(device, n, alpha, x, 1);
console.log(`Result: [${Array.from(result).join(", ")}]`);
console.log(`GPU time: ${gpuTimeMs.toFixed(3)} ms`);
if (typeof process !== "undefined") cleanup();
