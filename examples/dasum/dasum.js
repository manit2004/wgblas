import { init, cleanup } from "wgblas";
import { dasum } from "wgblas/dasum";
import { randomFloat64Array } from "wgblas/random";

const device = await init();

const n = 10;
const x = randomFloat64Array(n, -10, 10);

console.log("x:    ", x);
const { asum } = await dasum(device, n, x, 1);
console.log("asum: ", asum);
if (typeof process !== "undefined") cleanup();
