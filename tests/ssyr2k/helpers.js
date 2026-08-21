// Forward error factor for ssyr2k, restricted to the uplo-selected triangle.
//
// ssyr2k has no dedicated shader — it's two sgemmtr passes on one C buffer:
//   pass 1: C := alpha*op(A)*op(B)^T + beta*C_in
//   pass 2: C := alpha*op(B)*op(A)^T + 1.0*C_intermediate
// Pass 2 re-reads and re-adds pass 1's already-rounded output — an
// independent rounding a single-pass bound misses. Bounding
// |C_intermediate| ~ |alpha|*dotBound1 + |beta|*|C_in| gives:
//   eps*((k+2)*|alpha|*dotBound1 + (k+1)*|alpha|*dotBound2 + 2*|beta|*|C_in|)
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
  const { uplo, trans, n, k, alpha, A, lda, B, ldb, beta, C, ldc, layout } = a;
  const transOther = trans === "no-transpose" ? "transpose" : "no-transpose";
  const isLower = uplo === "lower";

  let maxFactor = 0;
  for (let i = 0; i < n; i++) {
    const jStart = isLower ? 0 : i;
    const jEnd = isLower ? Math.min(i + 1, n) : n;
    for (let j = jStart; j < jEnd; j++) {
      const gpuVal = cElem(gpu.C, ldc, layout, i, j);
      const refVal = cElem(ref.C, ldc, layout, i, j);
      const err = Math.abs(gpuVal - refVal);

      let dotBound1 = 0; // pass 1: alpha*op(A)*op(B)^T
      let dotBound2 = 0; // pass 2: alpha*op(B)*op(A)^T
      for (let p = 0; p < k; p++) {
        dotBound1 += Math.abs(matElem(A, lda, layout, trans, i, p)) * Math.abs(matElem(B, ldb, layout, transOther, p, j));
        dotBound2 += Math.abs(matElem(B, ldb, layout, trans, i, p)) * Math.abs(matElem(A, lda, layout, transOther, p, j));
      }

      const cIn = Math.abs(cElem(C, ldc, layout, i, j));
      // +1 extra unit on each coefficient beyond the exact first-order
      // derivation above, as safety margin against the eps^2 cross-terms
      // that derivation drops.
      const bound = eps * (
        (k + 3) * Math.abs(alpha) * dotBound1 +
        (k + 2) * Math.abs(alpha) * dotBound2 +
        3 * Math.abs(beta) * cIn
      );
      if (bound === 0) { if (err !== 0) maxFactor = Infinity; }
      else maxFactor = Math.max(maxFactor, err / bound);
    }
  }
  return maxFactor;
}
