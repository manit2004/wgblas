// tests/dtrmm/helpers.js
var eps = 2 ** -48;
function matElem(M, ld, layout, row, col) {
  return layout === "column-major" ? M[col * ld + row] : M[row * ld + col];
}
function triElem(A, lda, layout, uplo, transA, diag, row, col) {
  if (row === col)
    return diag === "unit" ? 1 : matElem(A, lda, layout, row, row);
  const meaningful =
    transA === "no-transpose"
      ? uplo === "lower"
        ? col <= row
        : col >= row
      : uplo === "lower"
        ? col >= row
        : col <= row;
  if (!meaningful) return 0;
  return transA === "no-transpose"
    ? matElem(A, lda, layout, row, col)
    : matElem(A, lda, layout, col, row);
}
function forwardFactor(gpu, ref, a) {
  const { side, uplo, transA, diag, m, n, alpha, A, lda, B, ldb, layout } = a;
  const aOrder = side === "left" ? m : n;
  let maxFactor = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const gpuVal = matElem(gpu.B, ldb, layout, i, j);
      const refVal = matElem(ref.B, ldb, layout, i, j);
      const err = Math.abs(gpuVal - refVal);
      let dotBound = 0;
      for (let p = 0; p < aOrder; p++) {
        dotBound +=
          side === "left"
            ? Math.abs(triElem(A, lda, layout, uplo, transA, diag, i, p)) *
              Math.abs(matElem(B, ldb, layout, p, j))
            : Math.abs(matElem(B, ldb, layout, i, p)) *
              Math.abs(triElem(A, lda, layout, uplo, transA, diag, p, j));
      }
      const bound = eps * (aOrder + 2) * Math.abs(alpha) * dotBound;
      if (bound === 0) {
        if (err !== 0) maxFactor = Infinity;
      } else maxFactor = Math.max(maxFactor, err / bound);
    }
  }
  return maxFactor;
}

// tests/dtrmm/edge-cases.json
var edge_cases_default = [
  {
    label: "side=left, uplo=lower, non-unit diag",
    side: "left",
    uplo: "lower",
    transA: "no-transpose",
    diag: "non-unit",
    m: 2,
    n: 2,
    alpha: 1,
    A: [1, 99, 2, 3],
    lda: 2,
    B: [5, 6, 7, 8],
    ldb: 2,
  },
  {
    label: "side=left, uplo=upper, unit diag \u2014 A's diagonal is never read",
    side: "left",
    uplo: "upper",
    transA: "no-transpose",
    diag: "unit",
    m: 2,
    n: 2,
    alpha: 2,
    A: [99, 2, 99, 99],
    lda: 2,
    B: [1, 0, 0, 1],
    ldb: 2,
  },
  {
    label: "side=right, uplo=lower, m!=n \u2014 A is n x n, order picked by n",
    side: "right",
    uplo: "lower",
    transA: "no-transpose",
    diag: "non-unit",
    m: 2,
    n: 3,
    alpha: 1,
    A: [1, 99, 99, 2, 3, 99, 4, 5, 6],
    lda: 3,
    B: [1, 0, 1, 0, 1, 1],
    ldb: 3,
  },
  {
    label: "side=right, uplo=upper, transA=transpose",
    side: "right",
    uplo: "upper",
    transA: "transpose",
    diag: "non-unit",
    m: 2,
    n: 2,
    alpha: 1,
    A: [1, 2, 99, 3],
    lda: 2,
    B: [1, 2, 3, 4],
    ldb: 2,
  },
  {
    label: "side=left, uplo=lower, transA=transpose, unit diag",
    side: "left",
    uplo: "lower",
    transA: "transpose",
    diag: "unit",
    m: 2,
    n: 2,
    alpha: 1,
    A: [99, 99, 2, 99],
    lda: 2,
    B: [1, 1, 1, 1],
    ldb: 2,
  },
  {
    label: "lda > aOrder \u2014 padding elements in stride gaps are ignored",
    side: "left",
    uplo: "lower",
    transA: "no-transpose",
    diag: "non-unit",
    m: 2,
    n: 2,
    alpha: 1,
    A: [1, 99, 99, 2, 3, 99],
    lda: 3,
    B: [1, 0, 0, 1],
    ldb: 2,
  },
  {
    label: "ldb > n \u2014 padding elements in stride gaps are ignored",
    side: "left",
    uplo: "lower",
    transA: "no-transpose",
    diag: "non-unit",
    m: 2,
    n: 2,
    alpha: 1,
    A: [1, 99, 2, 3],
    lda: 2,
    B: [1, 0, 77, 0, 1, 77],
    ldb: 3,
  },
  {
    label: "aOrder=1 \u2014 single-element triangular operand",
    side: "left",
    uplo: "lower",
    transA: "no-transpose",
    diag: "non-unit",
    m: 1,
    n: 2,
    alpha: 1,
    A: [5],
    lda: 1,
    B: [2, 3],
    ldb: 2,
  },
  {
    label:
      "unit diag \u2014 A's diagonal holds 0.1 (nonzero Lo half), never read",
    side: "left",
    uplo: "lower",
    transA: "no-transpose",
    diag: "unit",
    m: 3,
    n: 2,
    alpha: 1,
    A: [0.1, 99, 99, 2, 0.1, 99, 3, 4, 0.1],
    lda: 3,
    B: [1, 2, 3, 4, 5, 6],
    ldb: 2,
  },
  {
    label: "alpha=2, side=right, uplo=upper, transA=transpose, unit diag",
    side: "right",
    uplo: "upper",
    transA: "transpose",
    diag: "unit",
    m: 2,
    n: 3,
    alpha: 2,
    A: [99, 1, 2, 99, 99, 3, 99, 99, 99],
    lda: 3,
    B: [1, 2, 3, 4, 5, 6],
    ldb: 3,
  },
  {
    label: "alpha=0 \u2014 B becomes 0",
    side: "left",
    uplo: "upper",
    transA: "no-transpose",
    diag: "non-unit",
    m: 2,
    n: 2,
    alpha: 0,
    A: [1, 2, 99, 3],
    lda: 2,
    B: [5, 6, 7, 8],
    ldb: 2,
  },
];

// tests/dtrmm/edge-cases-column-major.json
var edge_cases_column_major_default = [
  {
    label: "[column-major] side=left, uplo=lower, non-unit diag",
    layout: "column-major",
    side: "left",
    uplo: "lower",
    transA: "no-transpose",
    diag: "non-unit",
    m: 2,
    n: 2,
    alpha: 1,
    A: [1, 2, 99, 3],
    lda: 2,
    B: [5, 7, 6, 8],
    ldb: 2,
  },
  {
    label: "[column-major] side=left, uplo=upper, unit diag",
    layout: "column-major",
    side: "left",
    uplo: "upper",
    transA: "no-transpose",
    diag: "unit",
    m: 2,
    n: 2,
    alpha: 2,
    A: [99, 99, 2, 99],
    lda: 2,
    B: [1, 0, 0, 1],
    ldb: 2,
  },
  {
    label: "[column-major] side=right, uplo=lower, m!=n \u2014 A is n x n",
    layout: "column-major",
    side: "right",
    uplo: "lower",
    transA: "no-transpose",
    diag: "non-unit",
    m: 2,
    n: 3,
    alpha: 1,
    A: [1, 2, 4, 99, 3, 5, 99, 99, 6],
    lda: 3,
    B: [1, 0, 0, 1, 1, 1],
    ldb: 2,
  },
  {
    label:
      "[column-major] lda > aOrder \u2014 padding elements in stride gaps are ignored",
    layout: "column-major",
    side: "left",
    uplo: "lower",
    transA: "no-transpose",
    diag: "non-unit",
    m: 2,
    n: 2,
    alpha: 1,
    A: [1, 2, 99, 99, 3, 99],
    lda: 3,
    B: [1, 0, 0, 1],
    ldb: 2,
  },
  {
    label: "[column-major] ldb > m \u2014 padding in stride gaps is ignored",
    layout: "column-major",
    side: "left",
    uplo: "upper",
    transA: "no-transpose",
    diag: "unit",
    m: 2,
    n: 3,
    alpha: 1,
    A: [99, 99, 2, 99],
    lda: 2,
    B: [1, 0, 99, 0, 1, 99, 1, 1, 99],
    ldb: 3,
  },
  {
    label: "[column-major] side=right, uplo=upper, transA=transpose",
    layout: "column-major",
    side: "right",
    uplo: "upper",
    transA: "transpose",
    diag: "non-unit",
    m: 2,
    n: 2,
    alpha: 1,
    A: [1, 99, 2, 1],
    lda: 2,
    B: [1, 0, 0, 1],
    ldb: 2,
  },
  {
    label:
      "[column-major] unit diag \u2014 A's diagonal holds 0.1 (nonzero Lo half), never read",
    layout: "column-major",
    side: "right",
    uplo: "lower",
    transA: "transpose",
    diag: "unit",
    m: 2,
    n: 3,
    alpha: 1,
    A: [0.1, 2, 3, 99, 0.1, 4, 99, 99, 0.1],
    lda: 3,
    B: [1, 2, 3, 4, 5, 6],
    ldb: 2,
  },
];

export { forwardFactor, edge_cases_default, edge_cases_column_major_default };
