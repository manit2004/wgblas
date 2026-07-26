/**
 * ULP (Units in the Last Place) distance helpers for f32 and f64 comparison.
 *
 * A ULP is the gap between two adjacent representable float values at a given
 * magnitude — it grows as values get larger. Comparing by ULP distance rather
 * than absolute error gives a scale-invariant correctness criterion: a result
 * 0 ULP away is bit-for-bit identical; 1 ULP means the nearest representable
 * neighbour; anything beyond that is a rounding error.
 *
 * ULP distance is computed by reinterpreting both floats as (unsigned, for
 * f32; signed, for f64) integers of the same width and taking their absolute
 * difference. IEEE 754 bit patterns are ordered the same way as the real line
 * (for same-sign values), so this directly counts how many representable
 * values lie between `a` and `b`.
 *
 * **±0 guard** — WGSL §15.7.1 permits implementations to return either `+0`
 * or `-0` interchangeably. Their bit patterns differ (`0x00000000` vs
 * `0x80000000`), which would give a huge ULP distance even though both
 * represent the same real number. Both `ulpDiff` and `ulpDiff64` special-case
 * this: if both values have absolute value 0 the distance is 0.
 *
 * **Same-sign assumption** — like the f32 functions, `ulpDiff64`/`maxUlp64`
 * only give a meaningful distance when `a`/`b` share a sign; every current
 * caller compares non-negative values (e.g. an `asum`-style result), so this
 * has never needed a general any-sign fixup.
 *
 * ## When not to use ULP
 *
 * For routines that involve multiply-add (saxpy, sdot, srot, srotm), the GPU
 * may execute the operation as a fused multiply-add (FMA) — a single rounding
 * instead of two. Near cancellation this makes the raw ULP difference between
 * a fused and an unfused result unbounded even though both are individually
 * correct. Use the forward error factor from `tests/<routine>/helpers.js`
 * instead. See `tests/helpers/fixtures.js` for which metric each routine uses.
 *
 * For f64-emulated routines (e.g. dasum), a huge ULP64 count from a tiny
 * absolute error used to come from `aux` (the packed extra bits — see
 * src/util/f64pack.mjs) landing on a NaN/Infinity bit pattern: any ordinary
 * double, or any intermediate sum during a reduction, can produce this — not
 * just unusual inputs — and a real Float32Array silently canonicalizes
 * (quiets) a NaN bit pattern on any round trip, corrupting it. That's now
 * fixed at the source: aux is transported exclusively as raw u32 bits (never
 * an actual float value) throughout f64pack.mjs, GpuVector, and the WGSL f64
 * shaders, so this class of corruption can't happen at all — raw ULP64 is a
 * meaningful metric and is what dasum's own tests use.
 *
 * @module tests/helpers/ulp
 */

const _buf = new ArrayBuffer(8);
const _f32 = new Float32Array(_buf);
const _u32 = new Uint32Array(_buf);

const _buf64 = new ArrayBuffer(16);
const _f64 = new Float64Array(_buf64);
const _big64 = new BigInt64Array(_buf64);

/**
 * ULP distance between two f32 scalars.
 * Returns 0 if both have absolute value 0 (±0 are interchangeable in WGSL §15.7.1).
 * @returns integer ULP distance between `a` and `b`
 * @public
 */
export function ulpDiff(a, b) {
  if (Math.abs(a) === 0 && Math.abs(b) === 0) return 0;
  _f32[0] = a;
  _f32[1] = b;
  return Math.abs(_u32[0] - _u32[1]);
}

/**
 * Maximum ULP distance across all elements of two Float32Arrays.
 * @returns `{ max, worstIndex }` — the largest ULP distance and the index where it occurred
 * @public
 */
export function maxUlp(actual, expected) {
  let max = 0;
  let worstIndex = -1;
  for (let i = 0; i < actual.length; i++) {
    const d = ulpDiff(actual[i], expected[i]);
    if (d > max) {
      max = d;
      worstIndex = i;
    }
  }
  return { max, worstIndex };
}

/**
 * Throws if the maximum ULP distance between `actual` and `expected` exceeds `threshold`.
 * @returns void — throws `Error` with element index and values if the threshold is exceeded
 * @public
 */
export function assertUlp(actual, expected, threshold, label = "") {
  const { max, worstIndex } = maxUlp(actual, expected);
  if (max > threshold) {
    const prefix = label ? `[${label}] ` : "";
    throw new Error(
      `${prefix}max ULP ${max} exceeds threshold ${threshold} at index ${worstIndex} ` +
        `(actual=${actual[worstIndex]}, expected=${expected[worstIndex]})`,
    );
  }
}

/**
 * ULP distance between two f64 scalars — f64 counterpart of `ulpDiff`.
 * Returns 0 if both have absolute value 0 (see module doc's ±0 guard).
 * Assumes `a`/`b` share a sign (see module doc's same-sign assumption).
 * @returns integer ULP distance between `a` and `b`
 * @public
 */
export function ulpDiff64(a, b) {
  if (Math.abs(a) === 0 && Math.abs(b) === 0) return 0;
  _f64[0] = a;
  _f64[1] = b;
  const diff = _big64[0] - _big64[1];
  return Number(diff < 0n ? -diff : diff);
}

/**
 * Maximum ULP64 distance across all elements of two Float64Arrays.
 * @returns `{ max, worstIndex }` — the largest ULP distance and the index where it occurred
 * @public
 */
export function maxUlp64(actual, expected) {
  let max = 0;
  let worstIndex = -1;
  for (let i = 0; i < actual.length; i++) {
    const d = ulpDiff64(actual[i], expected[i]);
    if (d > max) {
      max = d;
      worstIndex = i;
    }
  }
  return { max, worstIndex };
}

/**
 * Throws if the maximum ULP64 distance between `actual` and `expected` exceeds `threshold`.
 * @returns void — throws `Error` with element index and values if the threshold is exceeded
 * @public
 */
export function assertUlp64(actual, expected, threshold, label = "") {
  const { max, worstIndex } = maxUlp64(actual, expected);
  if (max > threshold) {
    const prefix = label ? `[${label}] ` : "";
    throw new Error(
      `${prefix}max ULP64 ${max} exceeds threshold ${threshold} at index ${worstIndex} ` +
        `(actual=${actual[worstIndex]}, expected=${expected[worstIndex]})`,
    );
  }
}
