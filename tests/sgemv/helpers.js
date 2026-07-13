// Forward error factor for sgemv.
//
// Each output element y[i] = alpha * dot(A[i,:], x) + beta * y_in[i].
// The dot product of n (or m) terms accumulates n rounding errors, so the
// combined bound per element is:
//
//   nTerms * eps * |alpha| * Σ_j |A[i,j]| * |x[j]|  +  eps * |beta| * |y_in[i]|
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

    const bound = eps * (nTerms * Math.abs(alpha) * dotBound + Math.abs(beta) * Math.abs(y[i * incy]));
    if (bound > 0) maxFactor = Math.max(maxFactor, err / bound);
  }
  return maxFactor;
}
