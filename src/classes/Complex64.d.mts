/**
 * A single 64-bit (f64) complex number: a real and an imaginary component.
 * Same shape as Complex32, with one deliberate difference: no f32 rounding
 * — a plain JS number already is an f64, so re/im are kept at their full
 * native double precision.
 *
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/classes/Complex64.mjs#L11">Source code: Complex64.mjs (L11)</a>
 * @category Classes
 */
export declare class Complex64 {
  /**
   * @param re - real component, full f64 precision
   * @param im - imaginary component, full f64 precision
   *
   * @example
   * ```js
   * import { Complex64 } from "wgblas";
   *
   * const z = new Complex64(1.1, 2.2); // 1.1 + 2.2i
   * console.log(z.re, z.im); // 1.1 2.2
   * ```
   */
  constructor(re: number, im: number);

  /** Real component (full f64 precision). */
  re: number;

  /** Imaginary component (full f64 precision). */
  im: number;
}

/**
 * An array of Complex64 values — array-of-structs, the f64 sibling of
 * Complex32Array (same overloads, same interleaved-pairs convention),
 * backed by full-precision Complex64 elements instead of f32-rounded
 * Complex32 ones.
 *
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/classes/Complex64.mjs#L34">Source code: Complex64.mjs (L34)</a>
 * @category Classes
 */
export declare class Complex64Array extends Array<Complex64> {
  /**
   * @param arg - a length (fills with that many zero-valued Complex64
   *   entries), a flat interleaved `[re, im, re, im, ...]` list of numbers,
   *   or an iterable of existing Complex64 instances to copy
   *
   * @example
   * ```js
   * import { Complex64, Complex64Array } from "wgblas";
   *
   * const a = new Complex64Array([1.1, 5.5, 3.3, 8.8]); // [1.1+5.5i, 3.3+8.8i]
   * console.log(a.length, a[0].re, a[0].im); // 2 1.1 5.5
   *
   * const b = new Complex64Array([new Complex64(1, 2), new Complex64(3, 4)]);
   * const c = new Complex64Array(3); // 3 zero-valued entries
   * ```
   */
  constructor(arg?: number | Iterable<number> | Iterable<Complex64>);
}
