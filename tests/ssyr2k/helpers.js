// Forward error factor for ssyr2k, restricted to the uplo-selected triangle
// of the (square) C.
//
// Unlike ssyrk, ssyr2k has no dedicated shader: it's two separate sgemmtr
// GPU passes writing the same C buffer (see ssyr2k.mjs) —
//   pass 1: C := alpha*op(A)*op(B)^T + beta*C_in
//   pass 2: C := alpha*op(B)*op(A)^T + 1.0*C_intermediate
// Pass 2 reads back pass 1's already-rounded output and adds to it again —
// an independent rounding pass 1's own bound says nothing about. Bounding
// |C_intermediate| via the triangle inequality on pass 1's own terms
// (|alpha|*dotBound1 + |beta|*|C_in|) and adding pass 2's own dot-product
// rounding gives, combining both passes:
//   eps*((k+2)*|alpha|*dotBound1 + (k+1)*|alpha|*dotBound2 + 2*|beta|*|C_in|)
// where dotBound1 = Σ|op(A)[i,p]*op(B)[j,p]| (pass 1's dot product) and
// dotBound2 = Σ|op(B)[i,p]*op(A)[j,p]| (pass 2's). Confirmed against a real
// counterexample (n=2, k=17, tiny alpha, beta-dominated C): the missing
// eps*|C_intermediate| term alone accounted for the observed error almost
// exactly (see the discussion this was derived from).
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
