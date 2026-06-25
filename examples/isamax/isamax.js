import { init, cleanup } from "wgblas";
import { isamax } from "wgblas/isamax";
import { randomFloat32Array } from "wgblas/util/random";

await init();

const n = 10;
const x = randomFloat32Array(n, -10, 10);

console.log("x:     ", x);
const { index } = await isamax(n, x, 1);
console.log("index: ", index);
console.log("x[index]: ", x[index]);
if (typeof process !== "undefined") cleanup();
