import { init, cleanup } from "wgblas";
import { srotm } from "wgblas/srotm";

const device = await init();

const n = 5;
const x = new Float32Array([1, 2, 3, 4, 5]);
const y = new Float32Array([10, 20, 30, 40, 50]);

// flag = -1: full 2x2 matrix H
// H = [ h11  h12 ]  =  [ 2   1 ]
//     [ h21  h22 ]     [ 1  -1 ]
const param = new Float32Array([-1, 2, 1, 1, -1]);

console.log("x (before):", x);
console.log("y (before):", y);

const { x: xOut, y: yOut } = await srotm(device, n, x, 1, y, 1, param);

console.log("x (after): ", xOut);
console.log("y (after): ", yOut);

if (typeof process !== "undefined") cleanup();
