// Forward error factor for sgemm — same reasoning as sgemv's (see
// tests/sgemv/helpers.js), extended to a k-term dot product:
//   (k+1)*eps*|alpha|*Σ|op(A)[i,p]*op(B)[p,j]|  +  eps*|beta|*|C_in[i,j]|
const eps = 2 ** -23;

// op(M)[row,col] — accounts for trans and layout independently.
function matElem(M, ld, layout, trans, row, col) {
  const [sr, sc] = trans === "transpose" ? [col, row] : [row, col];
  return layout === "column-major" ? M[sc * ld + sr] : M[sr * ld + sc];
}

// C has no trans flag (always logically m×n) but is still subject to layout.
function cElem(C, ldc, layout, row, col) {
  return layout === "column-major" ? C[col * ldc + row] : C[row * ldc + col];
}

export function forwardFactor(gpu, ref, a) {
  const { transA, transB, m, n, k, alpha, A, lda, B, ldb, beta, C, ldc, layout } = a;

  let maxFactor = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const gpuVal = cElem(gpu.C, ldc, layout, i, j);
      const refVal = cElem(ref.C, ldc, layout, i, j);
      const err = Math.abs(gpuVal - refVal);

      let dotBound = 0;
      for (let p = 0; p < k; p++)
        dotBound += Math.abs(matElem(A, lda, layout, transA, i, p)) * Math.abs(matElem(B, ldb, layout, transB, p, j));

      const cIn = Math.abs(cElem(C, ldc, layout, i, j));
      const bound = eps * ((k + 1) * Math.abs(alpha) * dotBound + Math.abs(beta) * cIn);
      if (bound === 0) { if (err !== 0) maxFactor = Infinity; }
      else maxFactor = Math.max(maxFactor, err / bound);
    }
  }
  return maxFactor;
}
