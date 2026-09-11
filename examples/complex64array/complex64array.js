import { Complex64, Complex64Array } from "wgblas";

const a = new Complex64Array([1.1, 5.5, 3.3, 8.8]); // [1.1+5.5i, 3.3+8.8i]
console.log(a.length, a[0].re, a[0].im); // 2 1.1 5.5

const b = new Complex64Array([new Complex64(1, 2), new Complex64(3, 4)]);
const c = new Complex64Array(3); // 3 zero-valued entries
console.log(b.length, c.length);
