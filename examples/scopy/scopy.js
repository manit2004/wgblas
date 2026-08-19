import { init, cleanup } from "wgblas";
import { scopy } from "wgblas/scopy";

const device = await init();

const n = 5;
const x = new Float32Array([1, 2, 3, 4, 5]);
const y = new Float32Array([10, 20, 30, 40, 50]);

console.log("x before:", x);
console.log("y before:", y);
const { y: resultY } = await scopy(device, n, x, 1, y, 1);
console.log("y after: ", resultY);
if (typeof process !== "undefined") cleanup();
