import { init, cleanup } from "wgblas";
import { ddot } from "wgblas/ddot";

const device = await init();

const n = 5;
// 1e-9 is far below what f32 can hold beside a value of 10 — single precision
// drops it entirely and returns 10. The extended-precision path keeps it.
const x = new Float64Array([1, 1e-9, 2, 3, 4]);
const y = new Float64Array([1, 1, 1, 1, 1]);

console.log("x:   ", x);
console.log("y:   ", y);
const { dot } = await ddot(device, n, x, 1, y, 1);
console.log("dot: ", dot); // 10.000000001, not 10
if (typeof process !== "undefined") cleanup();
