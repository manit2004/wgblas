import { init, cleanup } from "wgblas";
import { srotm } from "wgblas/srotm";
import { randomFloat32Array } from "wgblas/random";

await init();

const n = 10;
const x = randomFloat32Array(n, -10, 10);
const y = randomFloat32Array(n, -10, 10);

// flag = -1: full 2x2 matrix H
// H = [ h11  h12 ]  =  [ 0.6  0.8 ]
//     [ h21  h22 ]     [-0.8  0.6 ]
const param = new Float32Array([-1, 0.6, -0.8, 0.8, 0.6]);

console.log("x (before):", x);
console.log("y (before):", y);

const { x: xOut, y: yOut } = await srotm(n, x, 1, y, 1, param);

console.log("x (after): ", xOut);
console.log("y (after): ", yOut);

if (typeof process !== "undefined") cleanup();
