/**
 * Helpers for the f64 routines' IEEE special-value tests: ±Infinity and NaN
 * in the inputs must reach the outputs as real f64 (stdlib) puts them there.
 *
 * Double-double error terms of an infinite value are Inf - Inf = NaN, which
 * used to turn every Infinity into NaN at the first DD op; the primitives now
 * give special values a zero error term (isFiniteF in
 * src/shaders/f64/utils/add.wgsl). These tests compare against stdlib
 * element by element: NaN where it has NaN, the same signed Infinity where
 * it has one, and close agreement on everything finite.
 * @module
 */
import assert from "node:assert/strict";
import { randomFloat64Array } from "wgblas";

/**
 * Asserts `got` matches `want` element by element, IEEE classes exactly:
 * NaN ↔ NaN, ±Infinity ↔ the same Infinity, finite ↔ finite within `tol`
 * (relative, with an absolute floor of `tol` near zero).
 * @param {ArrayLike<number> | number} got
 * @param {ArrayLike<number> | number} want
 * @param {string} what - label for the failure message
 * @param {number} [tol]
 */
export function assertIeeeMatch(got, want, what, tol = 1e-12) {
  const g = typeof got === "number" ? [got] : got;
  const w = typeof want === "number" ? [want] : want;
  assert.equal(g.length, w.length, `${what}: length`);
  for (let i = 0; i < w.length; i++) {
    const label = `${what}[${i}]: got ${g[i]}, want ${w[i]}`;
    if (Number.isNaN(w[i])) assert.ok(Number.isNaN(g[i]), label);
    else if (!Number.isFinite(w[i])) assert.equal(g[i], w[i], label);
    else
      assert.ok(
        Number.isFinite(g[i]) &&
          Math.abs(g[i] - w[i]) <= tol * Math.max(1, Math.abs(w[i])),
        label,
      );
  }
}

/**
 * A copy of `x` with the given entries set: `{ 2: Infinity, 5: NaN }`.
 * @param {Float64Array} x
 * @param {Record<number, number>} entries
 * @returns {Float64Array}
 */
export function withValues(x, entries) {
  const out = Float64Array.from(x);
  for (const [i, v] of Object.entries(entries)) out[Number(i)] = v;
  return out;
}

/** Row-major index of (row, col) in an n-column matrix. */
export const at = (n, row, col) => row * n + col;

/** `len` values in [-1, 1] (never exactly 0, so no Inf·0 surprises), seeded. */
export const values = (len, seed) => randomFloat64Array(len, -1, 1, seed);
