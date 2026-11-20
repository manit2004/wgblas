// Backward residual bound for dtrsm — strsm's metric (tests/strsm/helpers.js)
// at double-double precision, as dtrsv's is strsv's. Triangular solves are
// backward stable regardless of A's conditioning (Higham, ch. 8), so instead
// of comparing X to a reference (which can differ a lot on an ill-conditioned
// A even though both are correct), plug the computed X back into op(A)*X (or
// X*op(A)) and check the residual against alpha*B_original:
//   |op(A)*X - alpha*B| <= (aOrder+2) * eps * Σ|op(A)| * |X|
// with eps = 2^-48, double-double's, and dtrmm's (aOrder+2) coefficient (see
// tests/dtrmm/helpers.js): A and B each go through splitDoubleDouble before
// upload. The residual itself is computed in f64, 2^5 times finer.
const eps = 2 ** -48;

function matElem(M, ld, layout, row, col) {
  return layout === "column-major" ? M[col * ld + row] : M[row * ld + col];
}

// op(A)[row,col], zero outside the stored+substituted region.
function triElem(A, lda, layout, uplo, transA, diag, row, col) {
  if (row === col)
    return diag === "unit" ? 1 : matElem(A, lda, layout, row, row);
  const meaningful =
    transA === "no-transpose"
      ? uplo === "lower"
        ? col <= row
        : col >= row
      : uplo === "lower"
        ? col >= row
        : col <= row;
  if (!meaningful) return 0;
  return transA === "no-transpose"
    ? matElem(A, lda, layout, row, col)
    : matElem(A, lda, layout, col, row);
}

export function backwardResidualFactor(gpu, ref, a) {
  const {
    side,
    uplo,
    transA,
    diag,
    m,
    n,
    alpha,
    A,
    lda,
    B: Borig,
    ldb,
    layout,
  } = a;
  const aOrder = side === "left" ? m : n;
  const X = gpu.B;

  let maxFactor = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      let acc = 0;
      let dotBound = 0;
      for (let k = 0; k < aOrder; k++) {
        let aVal, xVal;
        if (side === "left") {
          aVal = triElem(A, lda, layout, uplo, transA, diag, i, k);
          xVal = matElem(X, ldb, layout, k, j);
        } else {
          xVal = matElem(X, ldb, layout, i, k);
          aVal = triElem(A, lda, layout, uplo, transA, diag, k, j);
        }
        acc += aVal * xVal;
        dotBound += Math.abs(aVal) * Math.abs(xVal);
      }

      // BLAS: alpha=0 means B is not referenced — the right-hand side is a
      // literal zero, not alpha*Borig[i,j] (0*Infinity would give NaN).
      const rhs = alpha === 0 ? 0 : alpha * matElem(Borig, ldb, layout, i, j);
      const err = Math.abs(acc - rhs);
      const bound = eps * (aOrder + 2) * dotBound;
      if (bound === 0) {
        if (err !== 0) maxFactor = Infinity;
      } else maxFactor = Math.max(maxFactor, err / bound);
    }
  }
  return maxFactor;
}
