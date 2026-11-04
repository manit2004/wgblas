// Forward error factor for dgemmtr — dgemm's DD bound (see
// tests/dgemm/helpers.js), restricted to the uplo-selected triangle (same
// restriction sgemmtr applies to sgemm's — see tests/sgemmtr/helpers.js):
//   (k+2)*eps*|alpha|*Σ|op(A)[i,p]*op(B)[p,j]|  +  2*eps*|beta|*|C_in[i,j]|
const eps = 2 ** -48;

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
  const {
    uplo,
    transA,
    transB,
    m,
    n,
    k,
    alpha,
    A,
    lda,
    B,
    ldb,
    beta,
    C,
    ldc,
    layout,
  } = a;
  const isLower = uplo === "lower";

  let maxFactor = 0;
  for (let i = 0; i < m; i++) {
    // Only the touched triangle — the other one is a copy of C on both sides
    // (up to the DD split/merge round trip on the GPU side, which isn't what
    // this metric measures; the edge cases check it exactly).
    const jStart = isLower ? 0 : i;
    const jEnd = isLower ? Math.min(i + 1, n) : n;
    for (let j = jStart; j < jEnd; j++) {
      const gpuVal = cElem(gpu.C, ldc, layout, i, j);
      const refVal = cElem(ref.C, ldc, layout, i, j);
      const err = Math.abs(gpuVal - refVal);

      let dotBound = 0;
      for (let p = 0; p < k; p++)
        dotBound +=
          Math.abs(matElem(A, lda, layout, transA, i, p)) *
          Math.abs(matElem(B, ldb, layout, transB, p, j));

      const cIn = Math.abs(cElem(C, ldc, layout, i, j));
      const bound =
        eps * ((k + 2) * Math.abs(alpha) * dotBound + 2 * Math.abs(beta) * cIn);
      if (bound === 0) {
        if (err !== 0) maxFactor = Infinity;
      } else maxFactor = Math.max(maxFactor, err / bound);
    }
  }
  return maxFactor;
}
