/**
 * Helpers for the f64 routines' exactness tests: values a routine leaves
 * alone must come back bit-identical, as in reference BLAS and stdlib.
 *
 * The d* routines carry doubles through the GPU as (hi, lo) f32 pairs, which
 * hold ~48 of a double's 53 significant bits — fine for computed results (the
 * fixture tests bound that rounding), but quick returns, stride gaps, the
 * unreferenced triangle, leading-dimension padding and pure copies must not
 * be re-rounded. Fixture values in [-10, 10] mostly survive the split
 * exactly, so they can't catch that; {@link fullPrecision} generates values
 * that never do.
 * @module
 */
import assert from "node:assert/strict";
import { randomFloat64Array } from "wgblas";

/** True if `v` survives the (hi, lo) split exactly. */
export const survivesSplit = (v) =>
  Math.fround(v) + Math.fround(v - Math.fround(v)) === v;

const bits = new Float64Array(1);
const word = new BigUint64Array(bits.buffer);

/**
 * `len` doubles in [-1, 1] that don't survive the (hi, lo) split: the lowest
 * mantissa bit is set, and where hi happens to sit so close that lo still
 * reaches it, the value is nudged until it doesn't. Deterministic per seed.
 * @param {number} len
 * @param {number} seed
 * @returns {Float64Array}
 */
export function fullPrecision(len, seed) {
  return randomFloat64Array(len, -1, 1, seed).map((v) => {
    for (let x = v || 0.5; ; x *= 1 + 2 ** -26) {
      bits[0] = x;
      word[0] |= 1n;
      if (!survivesSplit(bits[0])) return bits[0];
    }
  });
}

/**
 * A {@link fullPrecision} generator with its own running seed, so each call
 * in a test gets fresh values: `const full = fullPrecisionFrom(900)`.
 * @param {number} seed - first seed
 * @returns {(len: number) => Float64Array}
 */
export function fullPrecisionFrom(seed) {
  let next = seed;
  return (len) => fullPrecision(len, next++);
}

/**
 * Asserts `got[i]` is bit-identical to `want[i]` (`Object.is`) at every index.
 * @param {ArrayLike<number>} got
 * @param {ArrayLike<number>} want
 * @param {Iterable<number>} indices
 * @param {string} what - label for the failure message
 */
export function assertBitIdentical(got, want, indices, what) {
  for (const i of indices)
    assert.ok(
      Object.is(got[i], want[i]),
      `${what}[${i}]: got ${got[i]}, want ${want[i]}`,
    );
}

/** Indices 0..len-1. */
export const all = (len) => [...Array(len).keys()];

/** Positions between n elements at stride `inc` — the stride gaps. */
export const gaps = (n, inc) =>
  all((n - 1) * inc + 1).filter((i) => i % inc !== 0);

/** Row-major n×n positions outside the `uplo` triangle. */
export const offTriangle = (n, uplo) =>
  all(n * n).filter((i) => {
    const [r, c] = [Math.floor(i / n), i % n];
    return uplo === "lower" ? c > r : c < r;
  });

/** Positions past the first `cols` of each of `rows` rows at leading dimension `ld` — the padding. */
export const ldPadding = (rows, cols, ld) =>
  all(rows * ld).filter((i) => i % ld >= cols);
