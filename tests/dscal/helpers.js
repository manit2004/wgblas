// Double-double gives ~48 mantissa bits, not f64's 53, so the working epsilon
// for a dscal result is 2^-48 rather than 2^-52 — see shaders/f64/dekker.wgsl.
const eps = 2 ** -48;

// Forward error bound for a scalar multiply: eps * |alpha * x_i| — same shape
// as ddot's own bound (tests/ddot/helpers.js), just a single term, no
// accumulation. Raw ULP64 is the wrong tool for the same reason it's wrong
// for ddot: at small magnitudes, tiny relative error can still land far away
// in true-f64 ULP terms.
export function forwardFactor(gpu, ref, a) {
  let maxFactor = 0;
  for (let i = 0; i < a.n; i++) {
    const idx = i * a.incx;
    const bound = eps * Math.abs(a.alpha * a.x[idx]);
    const err = Math.abs(gpu.x[idx] - ref.x[idx]);
    if (bound > 0) maxFactor = Math.max(maxFactor, err / bound);
    else if (err !== 0) maxFactor = Infinity;
  }
  return maxFactor;
}
