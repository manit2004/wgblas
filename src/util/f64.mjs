/** @module devdocs/utility-functions/f64 */

// Double-double f64 emulation — splits a double into a (hi, lo) pair of f32
// values with hi+lo approximating the original, hi holding the leading bits
// and lo the rounding error hi lost on its own. See src/shaders/f64/ (the DD
// struct in dekker.wgsl, operations in utils/) for the GPU-side arithmetic
// this pairs with (Dekker's algorithm).
//
// Not a value-preserving exact split: double-double buys roughly 2x f32's
// mantissa (~48 bits vs f32's 24), less than real f64's 52-bit mantissa.

/**
 * Splits every element of a Float64Array into a (hi, lo) double-double pair.
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
    lo[i] = Math.fround(x[i] - h);
  }
  return { hi, lo };
}

/**
 * Reassembles a (hi, lo) double-double pair back into a Float64Array — the
 * inverse of splitDoubleDouble, used after reading a double-double GPU
 * readback (GpuVector, GpuMatrix, dasum) back to the CPU.
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
