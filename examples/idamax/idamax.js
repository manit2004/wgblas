import { init, cleanup } from "wgblas";
import { idamax } from "wgblas/idamax";

const device = await init();

const n = 5;
const x = new Float64Array([3, -7, 2, 5, -1]);

console.log("x:     ", x);
const { index } = await idamax(device, n, x, 1);
console.log("index: ", index);
console.log("x[index]: ", x[index]);
if (typeof process !== "undefined") cleanup();
