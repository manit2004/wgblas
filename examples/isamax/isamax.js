import { init, cleanup } from "wgblas";
import { isamax } from "wgblas/isamax";

const device = await init();

const n = 5;
const x = new Float32Array([3, -7, 2, 5, -1]);

console.log("x:     ", x);
const { index } = await isamax(device, n, x, 1);
console.log("index: ", index);
console.log("x[index]: ", x[index]);
if (typeof process !== "undefined") cleanup();
