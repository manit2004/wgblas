import { init, cleanup } from "wgblas";
import { srot } from "wgblas/srot";
import { randomFloat32Array } from "wgblas/random";

const device = await init();

const n = 10;
const x = randomFloat32Array(n, -10, 10);
const y = randomFloat32Array(n, -10, 10);

// 45-degree rotation: c = cos(π/4), s = sin(π/4)
const angle = Math.PI / 4;
const c = Math.cos(angle);
const s = Math.sin(angle);

console.log("x (before):", x);
console.log("y (before):", y);

const { x: xOut, y: yOut } = await srot(device, n, x, 1, y, 1, c, s);

console.log("x (after): ", xOut);
console.log("y (after): ", yOut);

if (typeof process !== "undefined") cleanup();
