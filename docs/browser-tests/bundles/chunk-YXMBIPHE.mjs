// tests/ssyr2k/helpers.js
var eps = 2 ** -23;
function matElem(M, ld, layout, trans, row, col) {
  const [sr, sc] = trans === "transpose" ? [col, row] : [row, col];
  return layout === "column-major" ? M[sc * ld + sr] : M[sr * ld + sc];
}
function cElem(C, ldc, layout, row, col) {
  return layout === "column-major" ? C[col * ldc + row] : C[row * ldc + col];
}
function forwardFactor(gpu, ref, a) {
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
      let dotBound1 = 0;
      let dotBound2 = 0;
      for (let p = 0; p < k; p++) {
        dotBound1 +=
          Math.abs(matElem(A, lda, layout, trans, i, p)) *
          Math.abs(matElem(B, ldb, layout, transOther, p, j));
        dotBound2 +=
          Math.abs(matElem(B, ldb, layout, trans, i, p)) *
          Math.abs(matElem(A, lda, layout, transOther, p, j));
      }
      const cIn = Math.abs(cElem(C, ldc, layout, i, j));
      const bound =
        eps *
        ((k + 3) * Math.abs(alpha) * dotBound1 +
          (k + 2) * Math.abs(alpha) * dotBound2 +
          3 * Math.abs(beta) * cIn);
      if (bound === 0) {
        if (err !== 0) maxFactor = Infinity;
      } else maxFactor = Math.max(maxFactor, err / bound);
    }
  }
  return maxFactor;
}

// tests/ssyr2k/edge-cases.json
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
    B: [8, 8, 8, 8],
    ldb: 2,
    beta: 2,
    C: [1, 2, 3, 4],
    ldc: 2,
  },
  {
    label:
      "beta=0 \u2014 output is alpha*(A*B^T+B*A^T) on the upper triangle, lower untouched",
    uplo: "upper",
    trans: "no-transpose",
    n: 2,
    k: 2,
    alpha: 1,
    A: [1, 0, 0, 1],
    lda: 2,
    B: [2, 0, 0, 3],
    ldb: 2,
    beta: 0,
    C: [99, 99, 99, 99],
    ldc: 2,
  },
  {
    label: "uplo=lower: A*B^T + B*A^T, only col<=row kept",
    uplo: "lower",
    trans: "no-transpose",
    n: 3,
    k: 3,
    alpha: 1,
    A: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    lda: 3,
    B: [9, 8, 7, 6, 5, 4, 3, 2, 1],
    ldb: 3,
    beta: 0,
    C: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ldc: 3,
  },
  {
    label: "uplo=upper: same A,B, only col>=row kept",
    uplo: "upper",
    trans: "no-transpose",
    n: 3,
    k: 3,
    alpha: 1,
    A: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    lda: 3,
    B: [9, 8, 7, 6, 5, 4, 3, 2, 1],
    ldb: 3,
    beta: 0,
    C: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ldc: 3,
  },
  {
    label: "trans=transpose: A, B stored k\xD7n, op(A)=A^T, op(B)=B^T",
    uplo: "lower",
    trans: "transpose",
    n: 2,
    k: 3,
    alpha: 1,
    A: [1, 4, 2, 5, 3, 6],
    lda: 2,
    B: [1, 0, 0, 1, 1, 1],
    ldb: 2,
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
    B: [1, 0, 1, 0, 1, 1],
    ldb: 3,
    beta: 0,
    C: [0, 0, 0, 0],
    ldc: 2,
  },
  {
    label:
      "ldb > k (NoTrans B) \u2014 padding elements in stride gaps are ignored",
    uplo: "lower",
    trans: "no-transpose",
    n: 2,
    k: 3,
    alpha: 1,
    A: [1, 2, 3, 4, 5, 6],
    lda: 3,
    B: [1, 0, 1, 99, 0, 1, 1, 99],
    ldb: 4,
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
    B: [1, 0, 1, 0, 1, 1],
    ldb: 3,
    beta: 0,
    C: [0, 0, 99, 0, 0, 99],
    ldc: 3,
  },
  {
    label: "k=1 \u2014 single accumulation term per product",
    uplo: "lower",
    trans: "no-transpose",
    n: 3,
    k: 1,
    alpha: 1,
    A: [2, 3, 4],
    lda: 1,
    B: [5, 6, 7],
    ldb: 1,
    beta: 0,
    C: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ldc: 3,
  },
];

// tests/ssyr2k/edge-cases-column-major.json
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
    B: [8, 8, 8, 8],
    ldb: 2,
    beta: 2,
    C: [1, 3, 2, 4],
    ldc: 2,
  },
  {
    label:
      "[column-major] beta=0 \u2014 output is alpha*(A*B^T+B*A^T) on the upper triangle",
    layout: "column-major",
    uplo: "upper",
    trans: "no-transpose",
    n: 2,
    k: 2,
    alpha: 1,
    A: [1, 0, 0, 1],
    lda: 2,
    B: [2, 0, 0, 3],
    ldb: 2,
    beta: 0,
    C: [99, 99, 99, 99],
    ldc: 2,
  },
  {
    label: "[column-major] uplo=lower: A*B^T + B*A^T, only col<=row kept",
    layout: "column-major",
    uplo: "lower",
    trans: "no-transpose",
    n: 2,
    k: 3,
    alpha: 1,
    A: [1, 4, 2, 5, 3, 6],
    lda: 2,
    B: [1, 0, 0, 1, 1, 1],
    ldb: 2,
    beta: 0,
    C: [0, 0, 0, 0],
    ldc: 2,
  },
  {
    label:
      "[column-major] trans=transpose: A, B stored k\xD7n, op(A)=A^T, op(B)=B^T",
    layout: "column-major",
    uplo: "upper",
    trans: "transpose",
    n: 2,
    k: 3,
    alpha: 1,
    A: [1, 2, 3, 4, 5, 6],
    lda: 3,
    B: [1, 0, 1, 0, 1, 1],
    ldb: 3,
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
    B: [1, 0, 0, 1, 1, 1],
    ldb: 2,
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
    B: [1, 0, 0, 1, 1, 1],
    ldb: 2,
    beta: 0,
    C: [0, 0, 99, 0, 0, 99],
    ldc: 3,
  },
];

export { forwardFactor, edge_cases_default, edge_cases_column_major_default };
