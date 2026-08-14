// Forward error factor for sgemmtr — same bound as sgemm's (see
// tests/sgemm/helpers.js), restricted to the uplo-selected triangle (same
// restriction ssyr's forwardFactor applies — see tests/ssyr/helpers.js):
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
  const { uplo, transA, transB, m, n, k, alpha, A, lda, B, ldb, beta, C, ldc, layout } = a;
  const isLower = uplo === "lower";

  let maxFactor = 0;
  for (let i = 0; i < m; i++) {
    // Untouched cells are a pure copy on both sides (gpu and ref agree
    // trivially) — restricting to the touched triangle keeps the loop
    // honest about what's actually being checked, same as ssyr's.
    const jStart = isLower ? 0 : i;
    const jEnd = isLower ? Math.min(i + 1, n) : n;
    for (let j = jStart; j < jEnd; j++) {
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
