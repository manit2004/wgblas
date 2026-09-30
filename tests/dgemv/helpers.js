// Forward error factor for dgemv — same per-term accounting as sgemv's own
// metric (tests/sgemv/helpers.js), just at DD precision (eps=2**-48 instead
// of 2**-23): the GPU accumulates each row's dot product using
// ddMulProtected/ddAddProtected (one rounding per term), while the CPU
// reference may compute alpha*A[j]*x[j] left-to-right — scaling A before
// multiplying x. These two orderings add an extra eps*|alpha|*|A[j]*x[j]|
// of discrepancy per term beyond what the naive nTerms*eps bound covers.
// The final alpha*dot+beta*y step also costs its own rounding, contributing
// one more eps*(|alpha|*dotBound + |beta|*|y_in|) of discrepancy.
const eps = 2 ** -48;

export function forwardFactor(gpu, ref, a) {
  const { trans, m, n, alpha, A, lda, x, incx, beta, y, incy, layout } = a;
  const isNoTrans = trans === "no-transpose";
  const yLen = isNoTrans ? m : n;
  const nTerms = isNoTrans ? n : m;
  // A[row,col] flat index — column-major storage swaps which dimension lda strides over.
  const at =
    layout === "column-major"
      ? (row, col) => A[col * lda + row]
      : (row, col) => A[row * lda + col];

  let maxFactor = 0;
  for (let i = 0; i < yLen; i++) {
    const err = Math.abs(gpu.y[i * incy] - ref.y[i * incy]);

    let dotBound = 0;
    if (isNoTrans) {
      for (let j = 0; j < n; j++)
        dotBound += Math.abs(at(i, j)) * Math.abs(x[j * incx]);
    } else {
      for (let j = 0; j < m; j++)
        dotBound += Math.abs(at(j, i)) * Math.abs(x[j * incx]);
    }

    const bound =
      eps *
      ((nTerms + 1) * Math.abs(alpha) * dotBound +
        Math.abs(beta) * Math.abs(y[i * incy]));
    if (bound === 0) {
      if (err !== 0) maxFactor = Infinity;
    } else maxFactor = Math.max(maxFactor, err / bound);
  }
  return maxFactor;
}
