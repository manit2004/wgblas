import { init, cleanup, GpuVector } from "wgblas";

await init();
const vec = GpuVector.from(new Float32Array([1, 2, 3, 4]));
vec.destroy();
console.log("GPU buffer released");
if (typeof process !== "undefined") cleanup();
