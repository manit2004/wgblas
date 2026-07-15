const eps = 2 ** -23;

export function forwardFactor(gpu, ref, a) {
  let maxFactor = 0;
  for (let i = 0; i < a.n; i++) {
    const xi = a.x[i * a.incx];
    const yi = a.y[i * a.incy];
    const xBound = eps * (Math.abs(a.c * xi) + Math.abs(a.s * yi));
    const yBound = eps * (Math.abs(a.c * yi) + Math.abs(a.s * xi));
    const xErr = Math.abs(gpu.x[i * a.incx] - ref.x[i * a.incx]);
    const yErr = Math.abs(gpu.y[i * a.incy] - ref.y[i * a.incy]);
    if (xBound > 0) maxFactor = Math.max(maxFactor, xErr / xBound);
    else if (xErr !== 0) maxFactor = Infinity;
    if (yBound > 0) maxFactor = Math.max(maxFactor, yErr / yBound);
    else if (yErr !== 0) maxFactor = Infinity;
  }
  return maxFactor;
}
