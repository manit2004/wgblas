// Forward error factor for dsymm — ssymm's shape (see tests/ssymm/helpers.js)
// with dgemm's double-double coefficients (see tests/dgemm/helpers.js): A, B
// and C each go through splitDoubleDouble before upload, so the dot-product
// term gets (aOrder+2) and the beta*C term 2*eps. The symmetrize pass only
// copies values, so it adds no rounding of its own.
//   (aOrder+2)*eps*|alpha|*Σ|A[i,p]*B[p,j]|  +  2*eps*|beta|*|C_in[i,j]|
const eps = 2 ** -48;

// A[row,col] mirrored from whichever triangle (uplo) is actually stored.
function symElem(A, lda, layout, uplo, row, col) {
  const isStored = uplo === "lower" ? col <= row : col >= row;
  const [sr, sc] = isStored ? [row, col] : [col, row];
  return layout === "column-major" ? A[sc * lda + sr] : A[sr * lda + sc];
}

// B/C have no trans flag — always logically m×n, subject only to layout.
function matElem(M, ld, layout, row, col) {
  return layout === "column-major" ? M[col * ld + row] : M[row * ld + col];
}

export function forwardFactor(gpu, ref, a) {
  const { side, uplo, m, n, alpha, A, lda, B, ldb, beta, C, ldc, layout } = a;
  const aOrder = side === "left" ? m : n;

  let maxFactor = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const gpuVal = matElem(gpu.C, ldc, layout, i, j);
      const refVal = matElem(ref.C, ldc, layout, i, j);
      const err = Math.abs(gpuVal - refVal);

      let dotBound = 0;
      for (let p = 0; p < aOrder; p++) {
        dotBound +=
          side === "left"
            ? Math.abs(symElem(A, lda, layout, uplo, i, p)) *
              Math.abs(matElem(B, ldb, layout, p, j))
            : Math.abs(matElem(B, ldb, layout, i, p)) *
              Math.abs(symElem(A, lda, layout, uplo, p, j));
      }

      const cIn = Math.abs(matElem(C, ldc, layout, i, j));
      const bound =
        eps *
        ((aOrder + 2) * Math.abs(alpha) * dotBound + 2 * Math.abs(beta) * cIn);
      if (bound === 0) {
        if (err !== 0) maxFactor = Infinity;
      } else maxFactor = Math.max(maxFactor, err / bound);
    }
  }
  return maxFactor;
}
