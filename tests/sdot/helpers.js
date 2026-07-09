const eps = 2 ** -23;

export function forwardFactor(gpu, ref, a) {
  let sumAbsProd = 0;
  for (let i = 0; i < a.n; i++) {
    sumAbsProd += Math.abs(a.x[i * a.incx] * a.y[i * a.incy]);
  }
  const bound = a.n * eps * sumAbsProd;
  if (bound === 0) return 0;
  return Math.abs(gpu.dot - ref) / bound;
}
