// Forward error factor for ssyrk — same bound as sgemmtr's (see
// tests/sgemmtr/helpers.js), with B := A and transB := opposite(trans),
// restricted to the uplo-selected triangle of the (square) C:
//   (k+1)*eps*|alpha|*Σ|op(A)[i,p]*op(A)[j,p]|  +  eps*|beta|*|C_in[i,j]|
const eps = 2 ** -23;

// op(M)[row,col] — accounts for trans and layout independently.
function matElem(M, ld, layout, trans, row, col) {
  const [sr, sc] = trans === "transpose" ? [col, row] : [row, col];
  return layout === "column-major" ? M[sc * ld + sr] : M[sr * ld + sc];
}

// C is always square, but still subject to layout.
function cElem(C, ldc, layout, row, col) {
  return layout === "column-major" ? C[col * ldc + row] : C[row * ldc + col];
}

export function forwardFactor(gpu, ref, a) {
  const { uplo, trans, n, k, alpha, A, lda, beta, C, ldc, layout } = a;
  const transB = trans === "no-transpose" ? "transpose" : "no-transpose";
  const isLower = uplo === "lower";

  let maxFactor = 0;
  for (let i = 0; i < n; i++) {
    const jStart = isLower ? 0 : i;
    const jEnd = isLower ? Math.min(i + 1, n) : n;
    for (let j = jStart; j < jEnd; j++) {
      const gpuVal = cElem(gpu.C, ldc, layout, i, j);
      const refVal = cElem(ref.C, ldc, layout, i, j);
      const err = Math.abs(gpuVal - refVal);

      let dotBound = 0;
      for (let p = 0; p < k; p++)
        dotBound += Math.abs(matElem(A, lda, layout, trans, i, p)) * Math.abs(matElem(A, lda, layout, transB, p, j));

      const cIn = Math.abs(cElem(C, ldc, layout, i, j));
      const bound = eps * ((k + 1) * Math.abs(alpha) * dotBound + Math.abs(beta) * cIn);
      if (bound === 0) { if (err !== 0) maxFactor = Infinity; }
      else maxFactor = Math.max(maxFactor, err / bound);
    }
  }
  return maxFactor;
}
