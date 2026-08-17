// Forward error factor for ssymm — same shape as sgemm's (see
// tests/sgemm/helpers.js), with A replaced by a mirror-read of its `uplo`
// triangle (no trans flag on either operand) and the k-length dot product
// running over `aOrder` (= m for side='left', n for side='right'):
//   (aOrder+1)*eps*|alpha|*Σ|A[i,p]*B[p,j]|  +  eps*|beta|*|C_in[i,j]|
const eps = 2 ** -23;

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
        dotBound += side === "left"
          ? Math.abs(symElem(A, lda, layout, uplo, i, p)) * Math.abs(matElem(B, ldb, layout, p, j))
          : Math.abs(matElem(B, ldb, layout, i, p)) * Math.abs(symElem(A, lda, layout, uplo, p, j));
      }

      const cIn = Math.abs(matElem(C, ldc, layout, i, j));
      const bound = eps * ((aOrder + 1) * Math.abs(alpha) * dotBound + Math.abs(beta) * cIn);
      if (bound === 0) { if (err !== 0) maxFactor = Infinity; }
      else maxFactor = Math.max(maxFactor, err / bound);
    }
  }
  return maxFactor;
}
