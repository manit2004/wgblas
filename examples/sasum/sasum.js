import { init, cleanup } from "wgblas";
import { sasum } from "wgblas/sasum";
import { randomFloat32Array } from "wgblas/random";

const device = await init();

const n = 10;
const x = randomFloat32Array(n, -10, 10);

console.log("x:    ", x);
const { asum } = await sasum(device, n, x, 1);
console.log("asum: ", asum);
if (typeof process !== "undefined") cleanup();
