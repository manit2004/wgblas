// tests/dsyrk/helpers.js
var eps = 2 ** -48;
function matElem(M, ld, layout, trans, row, col) {
  const [sr, sc] = trans === "transpose" ? [col, row] : [row, col];
  return layout === "column-major" ? M[sc * ld + sr] : M[sr * ld + sc];
}
function cElem(C, ldc, layout, row, col) {
  return layout === "column-major" ? C[col * ldc + row] : C[row * ldc + col];
}
function forwardFactor(gpu, ref, a) {
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
        dotBound +=
          Math.abs(matElem(A, lda, layout, trans, i, p)) *
          Math.abs(matElem(A, lda, layout, transB, p, j));
      const cIn = Math.abs(cElem(C, ldc, layout, i, j));
      const bound =
        eps * ((k + 2) * Math.abs(alpha) * dotBound + 3 * Math.abs(beta) * cIn);
      if (bound === 0) {
        if (err !== 0) maxFactor = Infinity;
      } else maxFactor = Math.max(maxFactor, err / bound);
    }
  }
  return maxFactor;
}

// tests/dsyrk/edge-cases.json
var edge_cases_default = [
  {
    label:
      "alpha=0 \u2014 output is beta*C on the lower triangle, upper untouched",
    uplo: "lower",
    trans: "no-transpose",
    n: 2,
    k: 2,
    alpha: 0,
    A: [9, 9, 9, 9],
    lda: 2,
    beta: 2,
    C: [1, 2, 3, 4],
    ldc: 2,
  },
  {
    label:
      "beta=0 \u2014 output is alpha*A*A^T on the upper triangle, lower untouched",
    uplo: "upper",
    trans: "no-transpose",
    n: 2,
    k: 2,
    alpha: 1,
    A: [1, 0, 0, 1],
    lda: 2,
    beta: 0,
    C: [99, 99, 99, 99],
    ldc: 2,
  },
  {
    label: "uplo=lower: A=[[1,2,3],[4,5,6],[7,8,9]] * A^T, only col<=row kept",
    uplo: "lower",
    trans: "no-transpose",
    n: 3,
    k: 3,
    alpha: 1,
    A: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    lda: 3,
    beta: 0,
    C: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ldc: 3,
  },
  {
    label: "uplo=upper: same A*A^T, only col>=row kept",
    uplo: "upper",
    trans: "no-transpose",
    n: 3,
    k: 3,
    alpha: 1,
    A: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    lda: 3,
    beta: 0,
    C: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ldc: 3,
  },
  {
    label: "trans=transpose: A stored k\xD7n, op(A) = A^T",
    uplo: "lower",
    trans: "transpose",
    n: 2,
    k: 3,
    alpha: 1,
    A: [1, 4, 2, 5, 3, 6],
    lda: 2,
    beta: 0,
    C: [0, 0, 0, 0],
    ldc: 2,
  },
  {
    label:
      "lda > k (NoTrans A) \u2014 padding elements in stride gaps are ignored",
    uplo: "lower",
    trans: "no-transpose",
    n: 2,
    k: 3,
    alpha: 1,
    A: [1, 2, 3, 99, 4, 5, 6, 99],
    lda: 4,
    beta: 0,
    C: [0, 0, 0, 0],
    ldc: 2,
  },
  {
    label:
      "ldc > n \u2014 padding in output stride (write positions correct, gaps unchanged)",
    uplo: "upper",
    trans: "no-transpose",
    n: 2,
    k: 3,
    alpha: 1,
    A: [1, 2, 3, 4, 5, 6],
    lda: 3,
    beta: 0,
    C: [0, 0, 99, 0, 0, 99],
    ldc: 3,
  },
  {
    label: "k=1 \u2014 single accumulation term",
    uplo: "lower",
    trans: "no-transpose",
    n: 3,
    k: 1,
    alpha: 1,
    A: [2, 3, 4],
    lda: 1,
    beta: 0,
    C: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ldc: 3,
  },
];

// tests/dsyrk/edge-cases-column-major.json
var edge_cases_column_major_default = [
  {
    label:
      "[column-major] alpha=0 \u2014 output is beta*C on the lower triangle",
    layout: "column-major",
    uplo: "lower",
    trans: "no-transpose",
    n: 2,
    k: 2,
    alpha: 0,
    A: [9, 9, 9, 9],
    lda: 2,
    beta: 2,
    C: [1, 3, 2, 4],
    ldc: 2,
  },
  {
    label:
      "[column-major] beta=0 \u2014 output is alpha*A*A^T on the upper triangle",
    layout: "column-major",
    uplo: "upper",
    trans: "no-transpose",
    n: 2,
    k: 2,
    alpha: 1,
    A: [1, 0, 0, 1],
    lda: 2,
    beta: 0,
    C: [99, 99, 99, 99],
    ldc: 2,
  },
  {
    label: "[column-major] uplo=lower: A*A^T, only col<=row kept",
    layout: "column-major",
    uplo: "lower",
    trans: "no-transpose",
    n: 2,
    k: 3,
    alpha: 1,
    A: [1, 4, 2, 5, 3, 6],
    lda: 2,
    beta: 0,
    C: [0, 0, 0, 0],
    ldc: 2,
  },
  {
    label: "[column-major] trans=transpose: A stored k\xD7n, op(A) = A^T",
    layout: "column-major",
    uplo: "upper",
    trans: "transpose",
    n: 2,
    k: 3,
    alpha: 1,
    A: [1, 2, 3, 4, 5, 6],
    lda: 3,
    beta: 0,
    C: [0, 0, 0, 0],
    ldc: 2,
  },
  {
    label:
      "[column-major] lda > n (NoTrans A) \u2014 padding elements in stride gaps are ignored",
    layout: "column-major",
    uplo: "lower",
    trans: "no-transpose",
    n: 2,
    k: 3,
    alpha: 1,
    A: [1, 4, 99, 2, 5, 99, 3, 6, 99],
    lda: 3,
    beta: 0,
    C: [0, 0, 0, 0],
    ldc: 2,
  },
  {
    label:
      "[column-major] ldc > n \u2014 padding in output stride (write positions correct, gaps unchanged)",
    layout: "column-major",
    uplo: "upper",
    trans: "no-transpose",
    n: 2,
    k: 3,
    alpha: 1,
    A: [1, 4, 2, 5, 3, 6],
    lda: 2,
    beta: 0,
    C: [0, 0, 99, 0, 0, 99],
    ldc: 3,
  },
];

export { forwardFactor, edge_cases_default, edge_cases_column_major_default };
