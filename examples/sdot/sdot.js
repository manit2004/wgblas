import { init, cleanup } from "wgblas";
import { sdot } from "wgblas/sdot";

const device = await init();

const n = 5;
const x = new Float32Array([1, 2, 3, 4, 5]);
const y = new Float32Array([1, 1, 1, 1, 1]);

console.log("x:   ", x);
console.log("y:   ", y);
const { dot } = await sdot(device, n, x, 1, y, 1);
console.log("dot: ", dot);
if (typeof process !== "undefined") cleanup();
