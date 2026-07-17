// Forward error bound for strmv
const eps = 2 ** -23;

export function forwardFactor(gpu, ref, a) {
  const { uplo, trans, diag, n, A, lda, x, incx, incy } = a;
  const isLower = uplo === "lower";
  const isNoTrans = trans === "no-transpose";
  const isUnit = diag === "unit";
  const elem = (r, c) => (isUnit && r === c ? 1 : A[r * lda + c]);

  let maxFactor = 0;
  for (let i = 0; i < n; i++) {
    const err = Math.abs(gpu.y[i * incy] - ref.y[i * incy]);
    let dotBound = 0;

    if (isNoTrans) {
      // y[i] = Σ_j A[i,j] * x[j]
      if (isLower) {
        for (let j = 0; j <= i; j++) {
          dotBound += Math.abs(elem(i, j)) * Math.abs(x[j * incx]);
        }
      } else {
        for (let j = i; j < n; j++) {
          dotBound += Math.abs(elem(i, j)) * Math.abs(x[j * incx]);
        }
      }
    } else {
      // y[i] = Σ_j A[j,i] * x[j]
      if (isLower) {
        for (let j = i; j < n; j++) {
          dotBound += Math.abs(elem(j, i)) * Math.abs(x[j * incx]);
        }
      } else {
        for (let j = 0; j <= i; j++) {
          dotBound += Math.abs(elem(j, i)) * Math.abs(x[j * incx]);
        }
      }
    }

    const bound = eps * (n + 1) * dotBound;
    if (bound === 0) { if (err !== 0) maxFactor = Infinity; }
    else maxFactor = Math.max(maxFactor, err / bound);
  }
  return maxFactor;
}
