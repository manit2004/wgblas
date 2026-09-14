// Double-double gives ~48 mantissa bits, not f64's 53, so the working epsilon
// for a dcopy result is 2^-48 rather than 2^-52 — see shaders/f64/dekker.wgsl.
// Unlike dscal/daxpy/ddot, dcopy performs no arithmetic at all: the entire
// gap between gpu and ref is the double-double representable-precision loss
// from splitDoubleDouble/mergeDoubleDouble at the JS boundary (see
// src/util/f64.mjs), not anything the shader itself computes.
const eps = 2 ** -48;

export function forwardFactor(gpu, ref, a) {
  let maxFactor = 0;
  for (let i = 0; i < a.n; i++) {
    const ix = i * a.incx;
    const iy = i * a.incy;
    const bound = eps * Math.abs(a.x[ix]);
    const err = Math.abs(gpu.y[iy] - ref.y[iy]);
    if (bound > 0) maxFactor = Math.max(maxFactor, err / bound);
    else if (err !== 0) maxFactor = Infinity;
  }
  return maxFactor;
}
