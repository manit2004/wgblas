// Forward error factor for dgemm — same shape as sgemm's (see
// tests/sgemm/helpers.js), at DD precision (eps=2**-48). Unlike sgemm, A, B
// and C each go through splitDoubleDouble before upload, an extra rounding
// step sgemm's direct f32 upload doesn't have, so the coefficients follow
// dsymv's DD bound instead of sgemm's: (k+2) for the dot-product term and
// 2*eps for the beta*C term.
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

  let maxFactor = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
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
