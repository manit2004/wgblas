import { init, cleanup } from "wgblas";
import { daxpy } from "wgblas/daxpy";

const device = await init();

const n = 5;
const alpha = 2;
const x = new Float64Array([1, 2, 3, 4, 5]);
const y = new Float64Array([10, 20, 30, 40, 50]);

console.log("x before:", x);
console.log("y before:", y);
const { y: resultY } = await daxpy(device, n, alpha, x, 1, y, 1);
console.log("y after: ", resultY);
if (typeof process !== "undefined") cleanup();
