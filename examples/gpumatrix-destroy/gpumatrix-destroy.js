import { init, cleanup, GpuMatrix } from "wgblas";

await init();
const mat = GpuMatrix.from(new Float32Array([1, 2, 3, 4, 5, 6]), 2, 3);
mat.destroy();
console.log("GPU buffer released");
if (typeof process !== "undefined") cleanup();
