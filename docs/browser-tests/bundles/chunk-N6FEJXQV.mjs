// tests/ssymm/helpers.js
var eps = 2 ** -23;
function symElem(A, lda, layout, uplo, row, col) {
  const isStored = uplo === "lower" ? col <= row : col >= row;
  const [sr, sc] = isStored ? [row, col] : [col, row];
  return layout === "column-major" ? A[sc * lda + sr] : A[sr * lda + sc];
}
function matElem(M, ld, layout, row, col) {
  return layout === "column-major" ? M[col * ld + row] : M[row * ld + col];
}
function forwardFactor(gpu, ref, a) {
  const { side, uplo, m, n, alpha, A, lda, B, ldb, beta, C, ldc, layout } = a;
  const aOrder = side === "left" ? m : n;
  let maxFactor = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const gpuVal = matElem(gpu.C, ldc, layout, i, j);
      const refVal = matElem(ref.C, ldc, layout, i, j);
      const err = Math.abs(gpuVal - refVal);
      let dotBound = 0;
      for (let p = 0; p < aOrder; p++) {
        dotBound +=
          side === "left"
            ? Math.abs(symElem(A, lda, layout, uplo, i, p)) *
              Math.abs(matElem(B, ldb, layout, p, j))
            : Math.abs(matElem(B, ldb, layout, i, p)) *
              Math.abs(symElem(A, lda, layout, uplo, p, j));
      }
      const cIn = Math.abs(matElem(C, ldc, layout, i, j));
      const bound =
        eps *
        ((aOrder + 1) * Math.abs(alpha) * dotBound + Math.abs(beta) * cIn);
      if (bound === 0) {
        if (err !== 0) maxFactor = Infinity;
      } else maxFactor = Math.max(maxFactor, err / bound);
    }
  }
  return maxFactor;
}

// tests/ssymm/edge-cases.json
var edge_cases_default = [
  {
    label: "alpha=0 \u2014 output is beta*C, side=left, uplo=lower",
    side: "left",
    uplo: "lower",
    m: 2,
    n: 2,
    alpha: 0,
    A: [1, 99, 2, 3],
    lda: 2,
    B: [8, 8, 8, 8],
    ldb: 2,
    beta: 2,
    C: [1, 2, 3, 4],
    ldc: 2,
  },
  {
    label: "beta=0 \u2014 output is alpha*A*B, side=left, uplo=upper",
    side: "left",
    uplo: "upper",
    m: 2,
    n: 2,
    alpha: 1,
    A: [1, 2, 99, 3],
    lda: 2,
    B: [2, 0, 0, 3],
    ldb: 2,
    beta: 0,
    C: [99, 99, 99, 99],
    ldc: 2,
  },
  {
    label: "side=right, uplo=lower, m!=n \u2014 A is n x n, order picked by n",
    side: "right",
    uplo: "lower",
    m: 2,
    n: 3,
    alpha: 1,
    A: [1, 0, 0, 2, 3, 0, 4, 5, 6],
    lda: 3,
    B: [1, 0, 1, 0, 1, 1],
    ldb: 3,
    beta: 0,
    C: [0, 0, 0, 0, 0, 0],
    ldc: 3,
  },
  {
    label: "side=right, uplo=upper, m=n",
    side: "right",
    uplo: "upper",
    m: 2,
    n: 2,
    alpha: 1,
    A: [1, 2, 99, 3],
    lda: 2,
    B: [1, 0, 0, 1],
    ldb: 2,
    beta: 0,
    C: [0, 0, 0, 0],
    ldc: 2,
  },
  {
    label: "lda > aOrder \u2014 padding elements in stride gaps are ignored",
    side: "left",
    uplo: "lower",
    m: 2,
    n: 2,
    alpha: 1,
    A: [1, 99, 99, 2, 3, 99],
    lda: 3,
    B: [1, 0, 0, 1],
    ldb: 2,
    beta: 0,
    C: [0, 0, 0, 0],
    ldc: 2,
  },
  {
    label: "ldb > n \u2014 padding elements in stride gaps are ignored",
    side: "left",
    uplo: "lower",
    m: 2,
    n: 2,
    alpha: 1,
    A: [1, 99, 2, 3],
    lda: 2,
    B: [1, 0, 77, 0, 1, 77],
    ldb: 3,
    beta: 0,
    C: [0, 0, 0, 0],
    ldc: 2,
  },
  {
    label:
      "ldc > n \u2014 padding in output stride (write positions correct, gaps unchanged)",
    side: "left",
    uplo: "upper",
    m: 2,
    n: 3,
    alpha: 1,
    A: [1, 2, 99, 3],
    lda: 2,
    B: [1, 0, 1, 0, 1, 1],
    ldb: 3,
    beta: 0,
    C: [0, 0, 0, 99, 0, 0, 0, 99],
    ldc: 4,
  },
  {
    label: "aOrder=1 \u2014 single-element symmetric operand",
    side: "left",
    uplo: "lower",
    m: 1,
    n: 2,
    alpha: 1,
    A: [5],
    lda: 1,
    B: [2, 3],
    ldb: 2,
    beta: 0,
    C: [0, 0],
    ldc: 2,
  },
];

// tests/ssymm/edge-cases-column-major.json
var edge_cases_column_major_default = [
  {
    label:
      "[column-major] alpha=0 \u2014 output is beta*C, side=left, uplo=lower",
    layout: "column-major",
    side: "left",
    uplo: "lower",
    m: 2,
    n: 2,
    alpha: 0,
    A: [1, 2, 99, 3],
    lda: 2,
    B: [8, 8, 8, 8],
    ldb: 2,
    beta: 2,
    C: [1, 3, 2, 4],
    ldc: 2,
  },
  {
    label:
      "[column-major] beta=0 \u2014 output is alpha*A*B, side=left, uplo=upper",
    layout: "column-major",
    side: "left",
    uplo: "upper",
    m: 2,
    n: 2,
    alpha: 1,
    A: [1, 99, 0, 1],
    lda: 2,
    B: [2, 0, 0, 3],
    ldb: 2,
    beta: 0,
    C: [99, 99, 99, 99],
    ldc: 2,
  },
  {
    label: "[column-major] side=right, uplo=lower, m!=n \u2014 A is n x n",
    layout: "column-major",
    side: "right",
    uplo: "lower",
    m: 2,
    n: 3,
    alpha: 1,
    A: [1, 2, 4, 99, 3, 5, 99, 99, 6],
    lda: 3,
    B: [1, 0, 0, 1, 1, 1],
    ldb: 2,
    beta: 0,
    C: [0, 0, 0, 0, 0, 0],
    ldc: 2,
  },
  {
    label:
      "[column-major] lda > aOrder \u2014 padding elements in stride gaps are ignored",
    layout: "column-major",
    side: "left",
    uplo: "lower",
    m: 2,
    n: 2,
    alpha: 1,
    A: [1, 2, 99, 99, 3, 99],
    lda: 3,
    B: [1, 0, 0, 1],
    ldb: 2,
    beta: 0,
    C: [0, 0, 0, 0],
    ldc: 2,
  },
  {
    label:
      "[column-major] ldc > m \u2014 padding in output stride (write positions correct, gaps unchanged)",
    layout: "column-major",
    side: "left",
    uplo: "upper",
    m: 2,
    n: 3,
    alpha: 1,
    A: [1, 99, 0, 1],
    lda: 2,
    B: [1, 0, 0, 1, 1, 1],
    ldb: 2,
    beta: 0,
    C: [0, 0, 99, 0, 0, 99, 0, 0, 99],
    ldc: 3,
  },
  {
    label: "[column-major] side=right, uplo=upper, m=n",
    layout: "column-major",
    side: "right",
    uplo: "upper",
    m: 2,
    n: 2,
    alpha: 1,
    A: [1, 99, 0, 1],
    lda: 2,
    B: [1, 0, 0, 1],
    ldb: 2,
    beta: 0,
    C: [0, 0, 0, 0],
    ldc: 2,
  },
];

export { forwardFactor, edge_cases_default, edge_cases_column_major_default };
