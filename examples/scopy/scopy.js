import { init, cleanup } from "wgblas";
import { scopy } from "wgblas/scopy";
import { randomFloat32Array } from "wgblas/random";

const device = await init();

const n = 10;
const x = randomFloat32Array(n, -10, 10);
const y = randomFloat32Array(n, -10, 10);

console.log("x before:", x);
console.log("y before:", y);
const { y: resultY } = await scopy(device, n, x, 1, y, 1);
console.log("y after: ", resultY);
if (typeof process !== "undefined") cleanup();
