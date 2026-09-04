/**
 * A single 32-bit (f32) complex number: a real and an imaginary component.
 * JavaScript has no native complex number type, so this is the value type
 * every complex routine in this library builds on.
 *
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/classes/Complex32.mjs#L8">Source code: Complex32.mjs (L8)</a>
 * @category Classes
 */
export declare class Complex32 {
  /**
   * @param re - real component, rounded to the nearest f32
   * @param im - imaginary component, rounded to the nearest f32
   *
   * @example
   * ```js
   * import { Complex32 } from "wgblas";
   *
   * const z = new Complex32(1, 2); // 1 + 2i
   * console.log(z.re, z.im); // 1 2
   * ```
   */
  constructor(re: number, im: number);

  /** Real component (f32-rounded via `Math.fround`). */
  re: number;

  /** Imaginary component (f32-rounded via `Math.fround`). */
  im: number;
}

/**
 * An array of Complex32 values — array-of-structs, each element its own
 * independent Complex32 instance (as opposed to a struct-of-arrays layout
 * with separate re/im buffers). Extends the native Array, so indexing
 * (`arr[i]`), `.length`, iteration, `.map`, etc. all work as expected.
 *
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/classes/Complex32.mjs#L38">Source code: Complex32.mjs (L38)</a>
 * @category Classes
 */
export declare class Complex32Array extends Array<Complex32> {
  /**
   * @param arg - a length (fills with that many zero-valued Complex32
   *   entries), a flat interleaved `[re, im, re, im, ...]` list of numbers,
   *   or an iterable of existing Complex32 instances to copy
   *
   * @example
   * ```js
   * import { Complex32, Complex32Array } from "wgblas";
   *
   * const a = new Complex32Array([1, 5, 3, 8]); // [1+5i, 3+8i]
   * console.log(a.length, a[0].re, a[0].im); // 2 1 5
   *
   * const b = new Complex32Array([new Complex32(1, 2), new Complex32(3, 4)]);
   * const c = new Complex32Array(3); // 3 zero-valued entries
   * ```
   */
  constructor(arg?: number | Iterable<number> | Iterable<Complex32>);
}
