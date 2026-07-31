const eps = 2 ** -23;

export function forwardFactor(gpu, ref, a) {
  const isLower = a.uplo === "lower";
  // A[row,col] flat index — column-major storage swaps which dimension lda strides over.
  const idxOf = a.layout === "column-major"
    ? (row, col) => col * a.lda + row
    : (row, col) => row * a.lda + col;
  let maxFactor = 0;
  for (let i = 0; i < a.n; i++) {
    const xi = a.x[i * a.incx];
    const yi = a.y[i * a.incy];
    const jStart = isLower ? 0 : i;
    const jEnd = isLower ? i + 1 : a.n;
    for (let j = jStart; j < jEnd; j++) {
      const xj = a.x[j * a.incx];
      const yj = a.y[j * a.incy];
      const idx = idxOf(i, j);
      const bound = eps * (
        Math.abs(a.alpha * xi * yj) +
        Math.abs(a.alpha * yi * xj) +
        Math.abs(a.A[idx])
      );
      const err = Math.abs(gpu.A[idx] - ref.A[idx]);
      if (bound > 0) maxFactor = Math.max(maxFactor, err / bound);
      else if (err !== 0) maxFactor = Infinity;
    }
  }
  return maxFactor;
}
