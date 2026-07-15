const eps = 2 ** -23;

export function forwardFactor(gpu, ref, a) {
  const flag = a.param[0];
  let h11, h21, h12, h22;
  if (flag === -1) {
    h11 = a.param[1]; h21 = a.param[2]; h12 = a.param[3]; h22 = a.param[4];
  } else if (flag === 0) {
    h11 = 1.0; h21 = a.param[2]; h12 = a.param[3]; h22 = 1.0;
  } else {
    h11 = a.param[1]; h21 = -1.0; h12 = 1.0; h22 = a.param[4];
  }
  let maxFactor = 0;
  for (let i = 0; i < a.n; i++) {
    const xi = a.x[i * a.incx];
    const yi = a.y[i * a.incy];
    const xBound = eps * (Math.abs(h11 * xi) + Math.abs(h12 * yi));
    const yBound = eps * (Math.abs(h21 * xi) + Math.abs(h22 * yi));
    const xErr = Math.abs(gpu.x[i * a.incx] - ref.x[i * a.incx]);
    const yErr = Math.abs(gpu.y[i * a.incy] - ref.y[i * a.incy]);
    if (xBound > 0) maxFactor = Math.max(maxFactor, xErr / xBound);
    else if (xErr !== 0) maxFactor = Infinity;
    if (yBound > 0) maxFactor = Math.max(maxFactor, yErr / yBound);
    else if (yErr !== 0) maxFactor = Infinity;
  }
  return maxFactor;
}
