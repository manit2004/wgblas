// Forward error bound for dsymv: y[i] = alpha * Σ_j A_sym[i,j]*x[j] + beta*y_in[i],
// at DD precision (eps=2**-48 instead of sgemv's 2**-23). n+2 captures all
// accumulation rounds plus the final alpha*acc+beta*y step.
const eps = 2 ** -48;

export function forwardFactor(gpu, ref, a) {
  const { uplo, n, alpha, A, lda, x, incx, beta, y, incy, layout } = a;
  const isLower = uplo === "lower";
  // A[row,col] flat index — column-major storage swaps which dimension lda strides over.
  // `uplo` names the mathematically-populated triangle regardless of storage layout.
  const at =
    layout === "column-major"
      ? (row, col) => A[col * lda + row]
      : (row, col) => A[row * lda + col];
  let maxFactor = 0;
  for (let i = 0; i < n; i++) {
    const err = Math.abs(gpu.y[i * incy] - ref.y[i * incy]);
    let dotBound = 0;
    for (let j = 0; j < n; j++) {
      const aij = isLower
        ? i >= j
          ? Math.abs(at(i, j))
          : Math.abs(at(j, i))
        : i <= j
          ? Math.abs(at(i, j))
          : Math.abs(at(j, i));
      dotBound += aij * Math.abs(x[j * incx]);
    }
    const bound =
      eps *
      ((n + 2) * Math.abs(alpha) * dotBound +
        2 * Math.abs(beta) * Math.abs(y[i * incy]));
    if (bound === 0) {
      if (err !== 0) maxFactor = Infinity;
    } else maxFactor = Math.max(maxFactor, err / bound);
  }
  return maxFactor;
}
