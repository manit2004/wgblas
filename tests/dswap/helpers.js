// Double-double gives ~48 mantissa bits, not f64's 53, so the working epsilon
// for a dswap result is 2^-48 rather than 2^-52 — see shaders/f64/dekker.wgsl.
// Unlike dscal/daxpy/ddot, dswap performs no arithmetic at all: the entire
// gap between gpu and ref is the double-double representable-precision loss
// from splitDoubleDouble/mergeDoubleDouble at the JS boundary (see
// src/util/f64.mjs), not anything the shader itself computes. The new x[i]
// came from the original y[i] (and vice versa), so each bound is keyed off
// the ORIGINAL value that ended up there, not the post-swap one.
const eps = 2 ** -48;

export function forwardFactor(gpu, ref, a) {
  let maxFactor = 0;
  for (let i = 0; i < a.n; i++) {
    const ix = i * a.incx;
    const iy = i * a.incy;

    const xBound = eps * Math.abs(a.y[iy]); // new x[i] came from original y[i]
    const xErr = Math.abs(gpu.x[ix] - ref.x[ix]);
    if (xBound > 0) maxFactor = Math.max(maxFactor, xErr / xBound);
    else if (xErr !== 0) maxFactor = Infinity;

    const yBound = eps * Math.abs(a.x[ix]); // new y[i] came from original x[i]
    const yErr = Math.abs(gpu.y[iy] - ref.y[iy]);
    if (yBound > 0) maxFactor = Math.max(maxFactor, yErr / yBound);
    else if (yErr !== 0) maxFactor = Infinity;
  }
  return maxFactor;
}
