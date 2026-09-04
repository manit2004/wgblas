/** @module devdocs/classes/Complex32 */

/**
 * A single 32-bit (f32) complex number: a real and an imaginary component.
 * JavaScript has no native complex number type, so this is the value type
 * every complex routine in this library builds on.
 */
export class Complex32 {
  /**
   * @param {number} re - real component, rounded to the nearest f32 (same
   *   `Math.fround` truncation splitDoubleDouble uses for f64 emulation) —
   *   a plain JS number is an f64, and "32" in Complex32 means each
   *   component is genuinely f32-precision, not just f64 stored in an
   *   f32-sized slot
   * @param {number} im - imaginary component, rounded to the nearest f32
   */
  constructor(re, im) {
    this.re = Math.fround(re);
    this.im = Math.fround(im);
  }
}

/**
 * An array of Complex32 values — array-of-structs, each element its own
 * independent Complex32 instance (as opposed to a struct-of-arrays layout
 * with separate re/im buffers). Extends the native Array so indexing
 * (`arr[i]`), `.length`, iteration, `.map`, etc. all work as expected.
 *
 * Mirrors @stdlib/array-complex64's constructor overloads (minus the
 * ArrayBuffer-view form, which needs a flat backing buffer — incompatible
 * with storing genuine Complex32 instances one per slot):
 *
 *   new Complex32Array()                 // empty
 *   new Complex32Array(length)           // length zero-valued entries
 *   new Complex32Array([1, 5, 3, 8])     // flat [re, im, re, im, ...] pairs
 *   new Complex32Array([z1, z2])         // copies existing Complex32 instances
 */
export class Complex32Array extends Array {
  /**
   * @param {number|Iterable<number>|Iterable<Complex32>} [arg] - a length,
   *   a flat interleaved [re, im, ...] list of numbers, or an iterable of
   *   existing Complex32 instances
   */
  constructor(arg) {
    if (arg === undefined) {
      super();
      return;
    }
    if (typeof arg === "number") {
      super(arg);
      for (let i = 0; i < arg; i++) this[i] = new Complex32(0, 0);
      return;
    }

    const items = Array.from(arg);
    super();
    if (items.length === 0) return;

    if (items[0] instanceof Complex32) {
      for (const z of items) {
        if (!(z instanceof Complex32))
          throw new Error("Complex32Array expects every element to be a Complex32.");
        this.push(z);
      }
      return;
    }

    if (items.length % 2 !== 0)
      throw new Error("Complex32Array expects an even number of interleaved [re, im, ...] values.");
    for (let i = 0; i < items.length; i += 2) {
      if (typeof items[i] !== "number" || typeof items[i + 1] !== "number")
        throw new Error("Complex32Array expects interleaved [re, im, ...] values to be numbers.");
      this.push(new Complex32(items[i], items[i + 1]));
    }
  }
}
