/** @module devdocs/classes/Complex64 */

/**
 * A single 64-bit (f64) complex number: a real and an imaginary component.
 * Same shape as Complex32 (see Complex32.mjs) with one deliberate
 * difference: no `Math.fround` rounding here. A plain JS number already is
 * an f64, so re/im are kept at their full native double precision instead
 * of being truncated down to f32.
 */
export class Complex64 {
  /**
   * @param {number} re - real component, full f64 precision
   * @param {number} im - imaginary component, full f64 precision
   */
  constructor(re, im) {
    this.re = re;
    this.im = im;
  }
}

/**
 * An array of Complex64 values — array-of-structs, the f64 sibling of
 * Complex32Array (same overloads, same interleaved-pairs convention),
 * backed by full-precision Complex64 elements instead of f32-rounded
 * Complex32 ones.
 *
 *   new Complex64Array()                 // empty
 *   new Complex64Array(length)           // length zero-valued entries
 *   new Complex64Array([1, 5, 3, 8])     // flat [re, im, re, im, ...] pairs
 *   new Complex64Array([z1, z2])         // copies existing Complex64 instances
 */
export class Complex64Array extends Array {
  /**
   * @param {number|Iterable<number>|Iterable<Complex64>} [arg] - a length,
   *   a flat interleaved [re, im, ...] list of numbers, or an iterable of
   *   existing Complex64 instances
   */
  constructor(arg) {
    if (arg === undefined) {
      super();
      return;
    }
    if (typeof arg === "number") {
      super(arg);
      for (let i = 0; i < arg; i++) this[i] = new Complex64(0, 0);
      return;
    }

    const items = Array.from(arg);
    super();
    if (items.length === 0) return;

    if (items[0] instanceof Complex64) {
      for (const z of items) {
        if (!(z instanceof Complex64))
          throw new Error("Complex64Array expects every element to be a Complex64.");
        this.push(z);
      }
      return;
    }

    if (items.length % 2 !== 0)
      throw new Error("Complex64Array expects an even number of interleaved [re, im, ...] values.");
    for (let i = 0; i < items.length; i += 2) {
      if (typeof items[i] !== "number" || typeof items[i + 1] !== "number")
        throw new Error("Complex64Array expects interleaved [re, im, ...] values to be numbers.");
      this.push(new Complex64(items[i], items[i + 1]));
    }
  }
}
