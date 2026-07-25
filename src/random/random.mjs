export function randomFloat32Array(n, low = -1, high = 1) {
  const x = new Float32Array(n);
  for (let i = 0; i < n; i++) x[i] = low + Math.random() * (high - low);
  return x;
}

export function randomFloat64Array(n, low = -1, high = 1) {
  const x = new Float64Array(n);
  for (let i = 0; i < n; i++) x[i] = low + Math.random() * (high - low);
  return x;
}

export function randomTriangularFloat32Array(n, lda, uplo = "lower", low = -1, high = 1, diagLow = 5, diagHigh = 15) {
  if (uplo !== "lower" && uplo !== "upper")
    throw new Error("uplo must be 'lower' or 'upper'.");
  if (lda < n) throw new Error("lda must be >= n.");

  const A = new Float32Array(n * lda);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const inTriangle = uplo === "lower" ? j < i : j > i;
      if (inTriangle) A[i * lda + j] = low + Math.random() * (high - low);
    }
    A[i * lda + i] = diagLow + Math.random() * (diagHigh - diagLow);
  }
  return A;
}
