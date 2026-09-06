import { init, cleanup } from "wgblas";
import { cscal } from "wgblas/cscal";
import { Complex32, Complex32Array } from "wgblas/classes/Complex32";

const device = await init();

const n = 3;
const alpha = new Complex32(2, 3); // 2 + 3i
const x = new Complex32Array([1, 1, 0, 2, 2, -1]); // 1+1i, 0+2i, 2-1i

console.log("before:", x.map((z) => `${z.re}+${z.im}i`).join(", "));
const { x: result } = await cscal(device, n, alpha, x, 1);
console.log("after: ", result.map((z) => `${z.re}+${z.im}i`).join(", "));
if (typeof process !== "undefined") cleanup();
