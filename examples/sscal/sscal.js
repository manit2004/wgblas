import { init, cleanup } from "wgblas";
import { sscal } from "wgblas/sscal";
import { randomFloat32Array } from "wgblas/random";

await init();

const n = 10;
const alpha = 2.0;
const x = randomFloat32Array(n, -10, 10);

console.log("before:", x);
const result = await sscal(n, alpha, x, 1);
console.log("after: ", result);
if (typeof process !== "undefined") cleanup();
