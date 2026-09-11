import { Complex32, Complex32Array } from "wgblas";

const a = new Complex32Array([1, 5, 3, 8]); // [1+5i, 3+8i]
console.log(a.length, a[0].re, a[0].im); // 2 1 5

const b = new Complex32Array([new Complex32(1, 2), new Complex32(3, 4)]);
const c = new Complex32Array(3); // 3 zero-valued entries
console.log(b.length, c.length);
