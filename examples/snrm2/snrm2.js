import { init, cleanup } from "wgblas";
import { snrm2 } from "wgblas/snrm2";
import { randomFloat32Array } from "wgblas/random";

await init();

const n = 10;
const x = randomFloat32Array(n, -10, 10);

console.log("x:    ", x);
const { nrm2 } = await snrm2(n, x, 1);
console.log("nrm2: ", nrm2);
if (typeof process !== "undefined") cleanup();
