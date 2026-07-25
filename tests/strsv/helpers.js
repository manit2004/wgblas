// Forward error bound for strsv
const eps = 2 ** -23;

// Triangular solves are backward stable regardless of A's conditioning
// (Higham, ch. 8): computed x satisfies op(A+E)*x=b for small E, even on an
// ill-conditioned A where x itself would differ a lot from another correct
// solve. So instead of comparing x to a reference, plug it back into op(A)*x
// and check the residual against b.
export function backwardResidualFactor(gpu, ref, a) {
  const { uplo, trans, diag, n, A, lda, incx } = a;
  const b = a.x; // original right-hand side (strsv solves in place)
  const isLower = uplo === "lower";
  const isNoTrans = trans === "no-transpose";
  const isUnit = diag === "unit";
  const elem = (r, c) => (isUnit && r === c ? 1 : A[r * lda + c]);

  let maxFactor = 0;
  for (let i = 0; i < n; i++) {
    let acc = 0;
    let dotBound = 0;

    // j is the vector index; in the transposed branches j !== c, so pass it separately
    const addTerm = (r, c, j) => {
      const coeff = elem(r, c);
      acc += coeff * gpu.x[j * incx];
      dotBound += Math.abs(coeff) * Math.abs(gpu.x[j * incx]);
    };

    if (isNoTrans) {
      if (isLower) for (let j = 0; j <= i; j++) addTerm(i, j, j);
      else for (let j = i; j < n; j++) addTerm(i, j, j);
    } else {
      if (isLower) for (let j = i; j < n; j++) addTerm(j, i, j);
      else for (let j = 0; j <= i; j++) addTerm(j, i, j);
    }

    const err = Math.abs(acc - b[i * incx]);
    const bound = eps * (n + 1) * dotBound;
    if (bound === 0) { if (err !== 0) maxFactor = Infinity; }
    else maxFactor = Math.max(maxFactor, err / bound);
  }
  return maxFactor;
}
