import { init, cleanup } from "wgblas";
import { sdot } from "wgblas/sdot";
import { randomFloat32Array } from "wgblas/random";

await init();

const n = 10;
const x = randomFloat32Array(n, -10, 10);
const y = randomFloat32Array(n, -10, 10);

console.log("x:   ", x);
console.log("y:   ", y);
const { dot } = await sdot(n, x, 1, y, 1);
console.log("dot: ", dot);
if (typeof process !== "undefined") cleanup();