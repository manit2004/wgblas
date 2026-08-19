import { init, cleanup } from "wgblas";
import { srot } from "wgblas/srot";

const device = await init();

const n = 5;
const x = new Float32Array([1, 2, 3, 4, 5]);
const y = new Float32Array([10, 20, 30, 40, 50]);

// c = 0, s = 1: a clean 90-degree rotation, so x' = y and y' = -x.
const c = 0;
const s = 1;

console.log("x (before):", x);
console.log("y (before):", y);

const { x: xOut, y: yOut } = await srot(device, n, x, 1, y, 1, c, s);

console.log("x (after): ", xOut);
console.log("y (after): ", yOut);

if (typeof process !== "undefined") cleanup();
