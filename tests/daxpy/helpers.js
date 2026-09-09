// Double-double gives ~48 mantissa bits, not f64's 53, so the working epsilon
// for a daxpy result is 2^-48 rather than 2^-52 — see shaders/f64/dekker.wgsl.
const eps = 2 ** -48;

// Forward error bound for daxpy: eps * (|alpha * x_i| + |y_i|) — same shape
// as saxpy's own bound (tests/saxpy/helpers.js), just double-double's own
// epsilon in place of f32's. Raw ULP64 is the wrong tool for the same reason
// it's wrong for ddot/dscal: at small magnitudes, tiny relative error can
// still land far away in true-f64 ULP terms.
export function forwardFactor(gpu, ref, a) {
  let maxFactor = 0;
  for (let i = 0; i < a.n; i++) {
    const xi = a.x[i * a.incx];
    const yi = a.y[i * a.incy];
    const bound = eps * (Math.abs(a.alpha * xi) + Math.abs(yi));
    const err = Math.abs(gpu.y[i * a.incy] - ref.y[i * a.incy]);
    if (bound > 0) maxFactor = Math.max(maxFactor, err / bound);
    else if (err !== 0) maxFactor = Infinity;
  }
  return maxFactor;
}
