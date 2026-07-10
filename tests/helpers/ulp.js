/**
 * ULP (Units in the Last Place) distance helpers for f32 comparison.
 *
 * A ULP is the gap between two adjacent representable f32 values at a given
 * magnitude — it grows as values get larger. Comparing by ULP distance rather
 * than absolute error gives a scale-invariant correctness criterion: a result
 * 0 ULP away is bit-for-bit identical; 1 ULP means the nearest representable
 * neighbour; anything beyond that is a rounding error.
 *
 * ULP distance is computed by reinterpreting both floats as unsigned 32-bit
 * integers and taking their absolute difference. IEEE 754 f32 bit patterns are
 * ordered the same way as the real line (for same-sign values), so this
 * directly counts how many f32 values lie between `a` and `b`.
 *
 * **±0 guard** — WGSL §15.7.1 permits implementations to return either `+0`
 * or `-0` interchangeably. Their bit patterns differ (`0x00000000` vs
 * `0x80000000`), which would give a ULP distance of 2^31 even though both
 * represent the same real number. `ulpDiff` special-cases this: if both values
 * have absolute value 0 the distance is 0.
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
 * @module tests/helpers/ulp
 */

const _buf = new ArrayBuffer(8);
const _f32 = new Float32Array(_buf);
const _u32 = new Uint32Array(_buf);

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
