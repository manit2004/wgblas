import { randomFloat64Array } from "./chunk-KEJR4IRF.mjs";
import { assert_default } from "./chunk-I62COF5X.mjs";

// tests/helpers/exactness.js
var survivesSplit = (v) =>
  Math.fround(v) + Math.fround(v - Math.fround(v)) === v;
var bits = new Float64Array(1);
var word = new BigUint64Array(bits.buffer);
function fullPrecision(len, seed) {
  return randomFloat64Array(len, -1, 1, seed).map((v) => {
    for (let x = v || 0.5; ; x *= 1 + 2 ** -26) {
      bits[0] = x;
      word[0] |= 1n;
      if (!survivesSplit(bits[0])) return bits[0];
    }
  });
}
function fullPrecisionFrom(seed) {
  let next = seed;
  return (len) => fullPrecision(len, next++);
}
function assertBitIdentical(got, want, indices, what) {
  for (const i of indices)
    assert_default.ok(
      Object.is(got[i], want[i]),
      `${what}[${i}]: got ${got[i]}, want ${want[i]}`,
    );
}
var all = (len) => [...Array(len).keys()];
var gaps = (n, inc) => all((n - 1) * inc + 1).filter((i) => i % inc !== 0);
var offTriangle = (n, uplo) =>
  all(n * n).filter((i) => {
    const [r, c] = [Math.floor(i / n), i % n];
    return uplo === "lower" ? c > r : c < r;
  });
var ldPadding = (rows, cols, ld) =>
  all(rows * ld).filter((i) => i % ld >= cols);

export {
  fullPrecisionFrom,
  assertBitIdentical,
  all,
  gaps,
  offTriangle,
  ldPadding,
};
