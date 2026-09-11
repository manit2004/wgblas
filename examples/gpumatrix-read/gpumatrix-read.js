import { init, cleanup, GpuMatrix } from "wgblas";

await init();
const mat = GpuMatrix.from(new Float32Array([1, 2, 3, 4, 5, 6]), 2, 3);
const data = await mat.read();
console.log(data); // Float32Array [1, 2, 3, 4, 5, 6]

mat.destroy();
if (typeof process !== "undefined") cleanup();
