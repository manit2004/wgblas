import { init, cleanup } from "wgblas";
import { sscal } from "wgblas/sscal";

const device = await init();

const n = 5;
const alpha = 3;
const x = new Float32Array([1, 2, 3, 4, 5]);

console.log("before:", x);
const result = await sscal(device, n, alpha, x, 1);
console.log("after: ", result);
if (typeof process !== "undefined") cleanup();
