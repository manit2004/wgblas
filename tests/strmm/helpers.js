// Forward error factor for strmm — same shape as ssymm's (see
// tests/ssymm/helpers.js), but A is read through a zero-fill (not mirror)
// and there's no beta*C_in term (strmm has no C):
//   (aOrder+1)*eps*|alpha|*Σ|op(A)[i,p]*B[p,j]|
const eps = 2 ** -23;

// B has no trans flag — always logically m×n, subject only to layout.
function matElem(M, ld, layout, row, col) {
  return layout === "column-major" ? M[col * ld + row] : M[row * ld + col];
}

// op(A)[row,col], zero outside the stored+substituted region — mirrors
// triangularize.wgsl's own logic, not a mirror-read like ssymm's symElem.
function triElem(A, lda, layout, uplo, transA, diag, row, col) {
  if (row === col) return diag === "unit" ? 1 : matElem(A, lda, layout, row, row);
  const meaningful = transA === "no-transpose"
    ? (uplo === "lower" ? col <= row : col >= row)
    : (uplo === "lower" ? col >= row : col <= row);
  if (!meaningful) return 0;
  return transA === "no-transpose" ? matElem(A, lda, layout, row, col) : matElem(A, lda, layout, col, row);
}

export function forwardFactor(gpu, ref, a) {
  const { side, uplo, transA, diag, m, n, alpha, A, lda, B, ldb, layout } = a;
  const aOrder = side === "left" ? m : n;

  let maxFactor = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const gpuVal = matElem(gpu.B, ldb, layout, i, j);
      const refVal = matElem(ref.B, ldb, layout, i, j);
      const err = Math.abs(gpuVal - refVal);

      let dotBound = 0;
      for (let p = 0; p < aOrder; p++) {
        dotBound += side === "left"
          ? Math.abs(triElem(A, lda, layout, uplo, transA, diag, i, p)) * Math.abs(matElem(B, ldb, layout, p, j))
          : Math.abs(matElem(B, ldb, layout, i, p)) * Math.abs(triElem(A, lda, layout, uplo, transA, diag, p, j));
      }

      const bound = eps * (aOrder + 1) * Math.abs(alpha) * dotBound;
      if (bound === 0) { if (err !== 0) maxFactor = Infinity; }
      else maxFactor = Math.max(maxFactor, err / bound);
    }
  }
  return maxFactor;
}
