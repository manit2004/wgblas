import { init, cleanup, GpuVector } from "wgblas";

await init();
const vec = GpuVector.from(new Float32Array([1, 2, 3, 4]));
console.log("length:", vec.length, "dtype:", vec.dtype.name);

const dvec = GpuVector.from(new Float64Array([1.1, 2.2, 3.3]));
console.log("dtype:", dvec.dtype.name); // Float64Array

vec.destroy();
dvec.destroy();
if (typeof process !== "undefined") cleanup();
