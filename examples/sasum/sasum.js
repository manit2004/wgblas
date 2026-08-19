import { init, cleanup } from "wgblas";
import { sasum } from "wgblas/sasum";

const device = await init();

const n = 5;
const x = new Float32Array([1, -2, 3, -4, 5]);

console.log("x:    ", x);
const { asum } = await sasum(device, n, x, 1);
console.log("asum: ", asum);
if (typeof process !== "undefined") cleanup();
