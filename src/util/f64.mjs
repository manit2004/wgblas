/** @module devdocs/utility-functions/f64 */

// Double-double f64 emulation — splits a double into a (hi, lo) pair of f32
// values with hi+lo approximating the original, hi holding the leading bits
// and lo the rounding error hi lost on its own. See src/shaders/f64/ (the DD
// struct in dekker.wgsl, operations in utils/) for the GPU-side arithmetic
// this pairs with (Dekker's algorithm).
//
// Not a value-preserving exact split: double-double buys roughly 2x f32's
// mantissa (~48 bits vs f32's 24), less than real f64's 52-bit mantissa.

// lo for a value whose f32 rounding is h: the residual, or 0 when h is ±Inf
// or NaN — Inf - Inf would make lo NaN and turn the whole value into NaN
// (the GPU side keeps the same rule: isFiniteF in shaders/f64/utils/add.wgsl).
const loOf = (v, h) => (Number.isFinite(h) ? Math.fround(v - h) : 0);

// Whether the pair (h, l) stands for v to double-double precision. Not for
// doubles outside f32's exponent range: 1e300 splits to (Inf, 0) and 1e-320
// to (0, 0), so an op that maps that pair to itself (Inf·2, 0·2) would
// otherwise restore the wrong original.
const representable = (v, h, l) =>
  Number.isFinite(v)
    ? Math.abs(h + l - v) <= Math.abs(v) * 2 ** -40
    : Object.is(h, v);

/**
 * Splits every element of a Float64Array into a (hi, lo) double-double pair.
 * ±Infinity and NaN split to (value, 0).
 * @param {Float64Array} x
 * @returns {{hi: Float32Array, lo: Float32Array}}
 * @public
 */
export function splitDoubleDouble(x) {
  const n = x.length;
  const hi = new Float32Array(n);
  const lo = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const h = Math.fround(x[i]);
    hi[i] = h;
    lo[i] = loOf(x[i], h);
  }
  return { hi, lo };
}

/**
 * Reassembles a (hi, lo) double-double pair back into a Float64Array — the
 * inverse of splitDoubleDouble, used whenever a double-double result comes
 * back to the CPU: every `d*` routine's readback, and `GpuVector`/`GpuMatrix`
 * `read()` on f64 data.
 * @param {Float32Array} hi
 * @param {Float32Array} lo
 * @returns {Float64Array}
 * @public
 */
export function mergeDoubleDouble(hi, lo) {
  const n = hi.length;
  const out = new Float64Array(n);
  for (let i = 0; i < n; i++) out[i] = hi[i] + lo[i];
  return out;
}

/**
 * {@link mergeDoubleDouble}, but exact for values the GPU passed through
 * unchanged: where the (hi, lo) pair is bit-identical to the split of
 * `before[i]`, the element comes back as `before[i]` itself rather than
 * hi + lo — the split keeps only ~48 of a double's 53 significant bits, so
 * re-merging would round it. `before` holds, per output position, the value
 * the routine started from: the output's own input for an in/out operand,
 * or the moved source value for dcopy/dswap. So elements a routine leaves
 * alone (stride gaps, the unreferenced triangle) and pure copies come back
 * bit-identical, as BLAS requires. Values the split can't represent (beyond
 * f32's exponent range) are never restored: they merge to what the GPU
 * computed.
 * @param {Float32Array} hi
 * @param {Float32Array} lo
 * @param {Float64Array} before - same layout as the output
 * @returns {Float64Array}
 * @public
 */
export function mergeDoubleDoubleExact(hi, lo, before) {
  const out = mergeDoubleDouble(hi, lo);
  const n = Math.min(out.length, before.length);
  for (let i = 0; i < n; i++) {
    const v = before[i];
    const h = Math.fround(v);
    const l = loOf(v, h);
    if (Object.is(hi[i], h) && Object.is(lo[i], l) && representable(v, h, l))
      out[i] = v;
  }
  return out;
}
