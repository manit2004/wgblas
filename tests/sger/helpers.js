const eps = 2 ** -23;

export function forwardFactor(gpu, ref, a) {
  let maxFactor = 0;
  for (let i = 0; i < a.m; i++) {
    const xi = a.x[i * a.incx];
    for (let j = 0; j < a.n; j++) {
      const yj = a.y[j * a.incy];
      const idx = i * a.lda + j;
      const bound = eps * (Math.abs(a.alpha * xi * yj) + Math.abs(a.A[idx]));
      const err = Math.abs(gpu.A[idx] - ref.A[idx]);
      if (bound > 0) maxFactor = Math.max(maxFactor, err / bound);
      else if (err !== 0) maxFactor = Infinity;
    }
  }
  return maxFactor;
}
