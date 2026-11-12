/** @module devdocs/utility-functions/finite */

// Non-finite input checks for the blocked triangular solves (strsv, dtrsv,
// strsm). Above a few blocks they solve each diagonal block by applying its
// inverse, which places ±Infinity/NaN differently from substitution: an
// Infinity that reaches a later row along several paths becomes NaN under
// substitution (Inf - Inf), but can stay ±Infinity through the inverse. With
// a non-finite value in the data, host-array calls take the substitution
// path instead, so they match stdlib and the reference BLAS exactly.

// ±Infinity or NaN as the GPU sees the value: a double past f32's range
// (1e300) is finite here but splits to an Infinity (double-double keeps its
// leading part in an f32), so it counts too. Identity for Float32Array data.
const nonFinite = (v) => !Number.isFinite(Math.fround(v));

/**
 * Whether any of the `n` elements `x[0], x[inc], …, x[(n-1)·inc]` is ±Infinity
 * or NaN — or, for a Float64Array, beyond f32's range, which the GPU sees as
 * ±Infinity.
 * @param {Float32Array | Float64Array} x
 * @param {number} n
 * @param {number} [inc]
 * @returns {boolean}
 * @public
 */
export function hasNonFinite(x, n, inc = 1) {
  for (let i = 0; i < n; i++) if (nonFinite(x[i * inc])) return true;
  return false;
}

/**
 * Whether the triangle a triangular routine reads holds ±Infinity or NaN (or
 * a double beyond f32's range, as for {@link hasNonFinite}):
 * an order×order triangle stored row by row at `ld` (pass the layout as the
 * routine reinterprets it — column-major flips `lower`), without the
 * diagonal when it's implicitly unit.
 * @param {Float32Array | Float64Array} A
 * @param {number} order
 * @param {number} ld
 * @param {boolean} lower - lower triangle (col <= row) in that row-major frame
 * @param {boolean} unit - diagonal not read
 * @returns {boolean}
 * @public
 */
export function triangleHasNonFinite(A, order, ld, lower, unit) {
  const skip = unit ? 1 : 0;
  for (let r = 0; r < order; r++) {
    const start = r * ld + (lower ? 0 : r + skip);
    const end = r * ld + (lower ? r + 1 - skip : order);
    for (let i = start; i < end; i++) if (nonFinite(A[i])) return true;
  }
  return false;
}
