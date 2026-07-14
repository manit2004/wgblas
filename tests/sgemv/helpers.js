// Forward error factor for sgemv.
//
// Each output element y[i] = alpha * dot(A[i,:], x) + beta * y_in[i].
//
// The GPU accumulates the dot product using FMA (one rounding per term), while
// the CPU reference may compute alpha*A[j]*x[j] left-to-right — scaling A before
// multiplying x. These two orderings add an extra eps*|alpha|*|A[j]*x[j]| of
// discrepancy per term beyond what the naive nTerms*eps bound covers.
// The final alpha*acc+beta*y step may also use FMA on the GPU, contributing
// one more eps*(|alpha|*dotBound + |beta|*|y_in|) of discrepancy.
//
// The bound that correctly accounts for all these sources is:
//
//   (nTerms + 1) * eps * |alpha| * Σ_j |A[i,j]| * |x[j]|  +  eps * |beta| * |y_in[i]|
const eps = 2 ** -23;

export function forwardFactor(gpu, ref, a) {
  const { trans, m, n, alpha, A, lda, x, incx, beta, y, incy } = a;
  const isNoTrans = trans === "no-transpose";
  const yLen   = isNoTrans ? m : n;
  const nTerms = isNoTrans ? n : m;

  let maxFactor = 0;
  for (let i = 0; i < yLen; i++) {
    const err = Math.abs(gpu.y[i * incy] - ref.y[i * incy]);

    let dotBound = 0;
    if (isNoTrans) {
      for (let j = 0; j < n; j++)
        dotBound += Math.abs(A[i * lda + j]) * Math.abs(x[j * incx]);
    } else {
      for (let j = 0; j < m; j++)
        dotBound += Math.abs(A[j * lda + i]) * Math.abs(x[j * incx]);
    }

    const bound = eps * ((nTerms + 1) * Math.abs(alpha) * dotBound + Math.abs(beta) * Math.abs(y[i * incy]));
    if (bound > 0) maxFactor = Math.max(maxFactor, err / bound);
  }
  return maxFactor;
}
