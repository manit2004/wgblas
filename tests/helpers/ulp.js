const _buf = new ArrayBuffer(8);
const _f32 = new Float32Array(_buf);
const _u32 = new Uint32Array(_buf);

export function ulpDiff(a, b) {
  if (Math.abs(a) === 0 && Math.abs(b) === 0) return 0; // https://www.w3.org/TR/WGSL/#floating-point-representation §15.7.1 .GPU may return ±0 interchangeably.
  _f32[0] = a;
  _f32[1] = b;
  return Math.abs(_u32[0] - _u32[1]);
}

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
