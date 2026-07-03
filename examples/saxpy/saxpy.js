import { init, cleanup } from "wgblas";
import { saxpy } from "wgblas/saxpy";
import { randomFloat32Array } from "wgblas/random";

const device = await init();

const n = 10;
const alpha = 2;
const x = randomFloat32Array(n, -10, 10);
const y = randomFloat32Array(n, -10, 10);

console.log("x before:", x);
console.log("y before:", y);
const { y: resultY } = await saxpy(device, n, alpha, x, 1, y, 1);
console.log("y after: ", resultY);
if (typeof process !== "undefined") cleanup();
