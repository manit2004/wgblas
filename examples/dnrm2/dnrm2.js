import { init, cleanup } from "wgblas";
import { dnrm2 } from "wgblas/dnrm2";

const device = await init();

// 2^2 + 3^2 + 6^2 = 49 = 7^2, so the norm comes out to a clean 7.
const n = 3;
const x = new Float64Array([2, 3, 6]);

console.log("x:    ", x);
const { nrm2 } = await dnrm2(device, n, x, 1);
console.log("nrm2: ", nrm2);
if (typeof process !== "undefined") cleanup();
