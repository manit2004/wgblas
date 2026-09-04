/** @module devdocs/utility-functions/complex */
import { splitDoubleDouble, mergeDoubleDouble } from "./f64.mjs";
import { Complex64, Complex64Array } from "../classes/Complex64.mjs";

// Complex32Array <-> interleaved [re0, im0, re1, im1, ...] f32 buffer — one
// buffer, not a (hi, lo) pair like Float64Array (see f64.mjs), since re/im
// need no error compensation. Matches cuBLAS/stdlib's own complex layout.

/**
 * Interleaves the first `n` elements of a Complex32Array into a flat f32
 * buffer ready for `uploadBuffer`.
 * @param {import("../classes/Complex32.mjs").Complex32Array} data
 * @param {number} [n] - element count to interleave (default: data.length)
 * @returns {Float32Array} length `2*n`, [re0, im0, re1, im1, ...]
 * @public
 */
export function interleaveComplex32(data, n = data.length) {
  const flat = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) {
    flat[i * 2] = data[i].re;
    flat[i * 2 + 1] = data[i].im;
  }
  return flat;
}

// Complex64Array <-> a double-double (hi, lo) pair of interleaved f32
// buffers. re and im each need their own (hi, lo) split (see f64.mjs) —
// zipped together per channel, [reHi0,imHi0,...] / [reLo0,imLo0,...],
// rather than four separate buffers, so GpuVector/GpuMatrix's existing
// two-buffer shape covers this dtype with no restructuring.

/**
 * Splits the first `n` elements of a Complex64Array into an interleaved
 * double-double (hi, lo) pair of f32 buffers.
 * @param {Complex64Array} data
 * @param {number} [n] - element count to split (default: data.length)
 * @returns {{hi: Float32Array, lo: Float32Array}} each length `2*n`,
 *   [reHi0, imHi0, reHi1, imHi1, ...] / [reLo0, imLo0, reLo1, imLo1, ...]
 * @public
 */
export function splitComplex64(data, n = data.length) {
  const re = new Float64Array(n);
  const im = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    re[i] = data[i].re;
    im[i] = data[i].im;
  }
  const { hi: reHi, lo: reLo } = splitDoubleDouble(re);
  const { hi: imHi, lo: imLo } = splitDoubleDouble(im);

  const hi = new Float32Array(n * 2);
  const lo = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) {
    hi[i * 2] = reHi[i]; hi[i * 2 + 1] = imHi[i];
    lo[i * 2] = reLo[i]; lo[i * 2 + 1] = imLo[i];
  }
  return { hi, lo };
}

/**
 * Reassembles a Complex64Array from an interleaved double-double (hi, lo)
 * pair of f32 buffers — the inverse of splitComplex64.
 * @param {Float32Array} hi - [reHi0, imHi0, reHi1, imHi1, ...]
 * @param {Float32Array} lo - [reLo0, imLo0, reLo1, imLo1, ...]
 * @returns {Complex64Array}
 * @public
 */
export function mergeComplex64(hi, lo) {
  const n = hi.length / 2;
  const reHi = new Float32Array(n), reLo = new Float32Array(n);
  const imHi = new Float32Array(n), imLo = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    reHi[i] = hi[i * 2]; imHi[i] = hi[i * 2 + 1];
    reLo[i] = lo[i * 2]; imLo[i] = lo[i * 2 + 1];
  }
  const re = mergeDoubleDouble(reHi, reLo);
  const im = mergeDoubleDouble(imHi, imLo);
  const out = new Complex64Array(n);
  for (let i = 0; i < n; i++) out[i] = new Complex64(re[i], im[i]);
  return out;
}
