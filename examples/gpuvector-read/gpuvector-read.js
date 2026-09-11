import { init, cleanup, GpuVector } from "wgblas";

await init();
const vec = GpuVector.from(new Float32Array([1, 2, 3, 4]));
const data = await vec.read();
console.log(data);

vec.destroy();
if (typeof process !== "undefined") cleanup();
