// Double-double gives ~48 mantissa bits, not f64's 53, so the working epsilon
// for a ddot result is 2^-48 rather than 2^-52 — see shaders/f64/dekker.wgsl.
const eps = 2 ** -48;

// Standard forward error bound for a dot product: n * eps * sum|x_i * y_i|.
// The condition number of a dot product is driven by cancellation, so the
// bound uses the sum of absolute products, not the absolute value of the sum —
// a near-cancelling pair has a tiny result but a large bound, correctly.
export function forwardFactor(gpu, ref, a) {
  let sumAbsProd = 0;
  for (let i = 0; i < a.n; i++) {
    sumAbsProd += Math.abs(a.x[i * a.incx] * a.y[i * a.incy]);
  }
  const bound = a.n * eps * sumAbsProd;
  if (bound === 0) return gpu.dot === ref ? 0 : Infinity;
  return Math.abs(gpu.dot - ref) / bound;
}
