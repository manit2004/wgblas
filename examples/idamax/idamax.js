import { init, cleanup } from "wgblas";
import { idamax } from "wgblas/idamax";
import { randomFloat64Array } from "wgblas/random";

const device = await init();

const n = 10;
const x = randomFloat64Array(n, -10, 10);

console.log("x:     ", x);
const { index } = await idamax(device, n, x, 1);
console.log("index: ", index);
console.log("x[index]: ", x[index]);
if (typeof process !== "undefined") cleanup();
