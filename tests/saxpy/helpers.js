const eps = 2 ** -23;

export function forwardFactor(gpu, ref, a) {
  let maxFactor = 0;
  for (let i = 0; i < a.n; i++) {
    const xi = a.x[i * a.incx];
    const yi = a.y[i * a.incy];
    const bound = eps * (Math.abs(a.alpha * xi) + Math.abs(yi));
    const err = Math.abs(gpu.y[i * a.incy] - ref.y[i * a.incy]);
    if (bound > 0) maxFactor = Math.max(maxFactor, err / bound);
  }
  return maxFactor;
}
