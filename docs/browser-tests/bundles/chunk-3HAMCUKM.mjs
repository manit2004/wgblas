import { mergeDoubleDouble, splitDoubleDouble } from "./chunk-XFYS3TNK.mjs";

// src/classes/Complex64.mjs
var Complex64 = class {
  /**
   * @param {number} re - real component, full f64 precision
   * @param {number} im - imaginary component, full f64 precision
   */
  constructor(re, im) {
    this.re = re;
    this.im = im;
  }
};
var Complex64Array = class extends Array {
  /**
   * @param {number|Iterable<number>|Iterable<Complex64>} [arg] - a length,
   *   a flat interleaved [re, im, ...] list of numbers, or an iterable of
   *   existing Complex64 instances
   */
  constructor(arg) {
    if (arg === void 0) {
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
          throw new Error(
            "Complex64Array expects every element to be a Complex64.",
          );
        this.push(z);
      }
      return;
    }
    if (items.length % 2 !== 0)
      throw new Error(
        "Complex64Array expects an even number of interleaved [re, im, ...] values.",
      );
    for (let i = 0; i < items.length; i += 2) {
      if (typeof items[i] !== "number" || typeof items[i + 1] !== "number")
        throw new Error(
          "Complex64Array expects interleaved [re, im, ...] values to be numbers.",
        );
      this.push(new Complex64(items[i], items[i + 1]));
    }
  }
};

// src/util/complex.mjs
function interleaveComplex32(data, n = data.length) {
  const flat = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) {
    flat[i * 2] = data[i].re;
    flat[i * 2 + 1] = data[i].im;
  }
  return flat;
}
function splitComplex64(data, n = data.length) {
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
    hi[i * 2] = reHi[i];
    hi[i * 2 + 1] = imHi[i];
    lo[i * 2] = reLo[i];
    lo[i * 2 + 1] = imLo[i];
  }
  return { hi, lo };
}
function mergeComplex64(hi, lo) {
  const n = hi.length / 2;
  const reHi = new Float32Array(n),
    reLo = new Float32Array(n);
  const imHi = new Float32Array(n),
    imLo = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    reHi[i] = hi[i * 2];
    imHi[i] = hi[i * 2 + 1];
    reLo[i] = lo[i * 2];
    imLo[i] = lo[i * 2 + 1];
  }
  const re = mergeDoubleDouble(reHi, reLo);
  const im = mergeDoubleDouble(imHi, imLo);
  const out = new Complex64Array(n);
  for (let i = 0; i < n; i++) out[i] = new Complex64(re[i], im[i]);
  return out;
}

// src/classes/Complex32.mjs
var Complex32 = class {
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
};
var Complex32Array = class extends Array {
  /**
   * @param {number|Iterable<number>|Iterable<Complex32>} [arg] - a length,
   *   a flat interleaved [re, im, ...] list of numbers, or an iterable of
   *   existing Complex32 instances
   */
  constructor(arg) {
    if (arg === void 0) {
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
          throw new Error(
            "Complex32Array expects every element to be a Complex32.",
          );
        this.push(z);
      }
      return;
    }
    if (items.length % 2 !== 0)
      throw new Error(
        "Complex32Array expects an even number of interleaved [re, im, ...] values.",
      );
    for (let i = 0; i < items.length; i += 2) {
      if (typeof items[i] !== "number" || typeof items[i + 1] !== "number")
        throw new Error(
          "Complex32Array expects interleaved [re, im, ...] values to be numbers.",
        );
      this.push(new Complex32(items[i], items[i + 1]));
    }
  }
};

export {
  Complex64,
  Complex64Array,
  interleaveComplex32,
  splitComplex64,
  mergeComplex64,
  Complex32,
  Complex32Array,
};
