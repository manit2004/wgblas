import { randomFloat32Array } from "wgblas";

// Same seed -> identical output every run, useful for reproducible
// regression tests that need "random-looking" data without real randomness.
const a = randomFloat32Array(4, -1, 1, 42);
const b = randomFloat32Array(4, -1, 1, 42);
console.log(a);
console.log(b);
console.log(
  "identical:",
  a.every((v, i) => v === b[i]),
);
