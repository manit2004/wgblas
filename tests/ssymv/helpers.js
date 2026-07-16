// Forward error bound for ssymv: y[i] = alpha * Σ_j A_sym[i,j]*x[j] + beta*y_in[i].
// GPU may use FMA (one rounding per term); n+1 captures all accumulation rounds plus
// the final alpha*acc step.
const eps = 2 ** -23;

export function forwardFactor(gpu, ref, a) {
  const { uplo, n, alpha, A, lda, x, incx, beta, y, incy } = a;
  const isLower = uplo === "lower";
  let maxFactor = 0;
  for (let i = 0; i < n; i++) {
    const err = Math.abs(gpu.y[i * incy] - ref.y[i * incy]);
    let dotBound = 0;
    for (let j = 0; j < n; j++) {
      const aij = isLower
        ? (i >= j ? Math.abs(A[i * lda + j]) : Math.abs(A[j * lda + i]))
        : (i <= j ? Math.abs(A[i * lda + j]) : Math.abs(A[j * lda + i]));
      dotBound += aij * Math.abs(x[j * incx]);
    }
    const bound =
      eps * ((n + 1) * Math.abs(alpha) * dotBound + Math.abs(beta) * Math.abs(y[i * incy]));
    if (bound === 0) { if (err !== 0) maxFactor = Infinity; }
    else maxFactor = Math.max(maxFactor, err / bound);
  }
  return maxFactor;
}

