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

export function randomTriangularFloat32Array(
  n, lda, uplo = "lower", low = -1, high = 1, diagLow = 5, diagHigh = 15, layout = "row-major",
) {
  if (uplo !== "lower" && uplo !== "upper")
    throw new Error("uplo must be 'lower' or 'upper'.");
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (lda < n) throw new Error("lda must be >= n.");

  // Row-major stores row i at A[i*lda+j]; column-major stores column j at
  // A[j*lda+i] instead. `uplo` describes the logical triangle (unaffected by
  // storage order) — only which flat index each (i, j) maps to changes.
  const isColMajor = layout === "column-major";
  const idx = (i, j) => (isColMajor ? j * lda + i : i * lda + j);

  const A = new Float32Array(n * lda);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const inTriangle = uplo === "lower" ? j < i : j > i;
      if (inTriangle) A[idx(i, j)] = low + Math.random() * (high - low);
    }
    A[idx(i, i)] = diagLow + Math.random() * (diagHigh - diagLow);
  }
  return A;
}
