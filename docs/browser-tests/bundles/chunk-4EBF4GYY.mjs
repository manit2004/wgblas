// tests/dgemm/helpers.js
var eps = 2 ** -48;
function matElem(M, ld, layout, trans, row, col) {
  const [sr, sc] = trans === "transpose" ? [col, row] : [row, col];
  return layout === "column-major" ? M[sc * ld + sr] : M[sr * ld + sc];
}
function cElem(C, ldc, layout, row, col) {
  return layout === "column-major" ? C[col * ldc + row] : C[row * ldc + col];
}
function forwardFactor(gpu, ref, a) {
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
        eps * ((k + 2) * Math.abs(alpha) * dotBound + 3 * Math.abs(beta) * cIn);
      if (bound === 0) {
        if (err !== 0) maxFactor = Infinity;
      } else maxFactor = Math.max(maxFactor, err / bound);
    }
  }
  return maxFactor;
}

// tests/dgemm/edge-cases.json
var edge_cases_default = [
  {
    label: "alpha=0 \u2014 output is beta*C, no matrix contribution",
    transA: "no-transpose",
    transB: "no-transpose",
    m: 2,
    n: 2,
    k: 2,
    alpha: 0,
    A: [9, 9, 9, 9],
    lda: 2,
    B: [9, 9, 9, 9],
    ldb: 2,
    beta: 2,
    C: [1, 2, 3, 4],
    ldc: 2,
  },
  {
    label: "beta=0 \u2014 output is alpha*A*B, no C contribution",
    transA: "no-transpose",
    transB: "no-transpose",
    m: 2,
    n: 2,
    k: 2,
    alpha: 1,
    A: [1, 0, 0, 1],
    lda: 2,
    B: [5, 6, 7, 8],
    ldb: 2,
    beta: 0,
    C: [99, 99, 99, 99],
    ldc: 2,
  },
  {
    label: "NoTrans/NoTrans: [[1,2,3],[4,5,6]] * [[1,0],[0,1],[1,1]]",
    transA: "no-transpose",
    transB: "no-transpose",
    m: 2,
    n: 2,
    k: 3,
    alpha: 1,
    A: [1, 2, 3, 4, 5, 6],
    lda: 3,
    B: [1, 0, 0, 1, 1, 1],
    ldb: 2,
    beta: 0,
    C: [0, 0, 0, 0],
    ldc: 2,
  },
  {
    label: "TransA: A stored k\xD7m, op(A) = same logical [[1,2,3],[4,5,6]]",
    transA: "transpose",
    transB: "no-transpose",
    m: 2,
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
    label: "TransB: B stored n\xD7k, op(B) = same logical [[1,0],[0,1],[1,1]]",
    transA: "no-transpose",
    transB: "transpose",
    m: 2,
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
    label: "TransA+TransB together",
    transA: "transpose",
    transB: "transpose",
    m: 2,
    n: 2,
    k: 3,
    alpha: 1,
    A: [1, 4, 2, 5, 3, 6],
    lda: 2,
    B: [1, 0, 1, 0, 1, 1],
    ldb: 3,
    beta: 0,
    C: [0, 0, 0, 0],
    ldc: 2,
  },
  {
    label:
      "lda > k (NoTrans A) \u2014 padding elements in stride gaps are ignored",
    transA: "no-transpose",
    transB: "no-transpose",
    m: 2,
    n: 2,
    k: 3,
    alpha: 1,
    A: [1, 2, 3, 99, 4, 5, 6, 99],
    lda: 4,
    B: [1, 0, 0, 1, 1, 1],
    ldb: 2,
    beta: 0,
    C: [0, 0, 0, 0],
    ldc: 2,
  },
  {
    label:
      "ldb > n (NoTrans B) \u2014 padding elements in stride gaps are ignored",
    transA: "no-transpose",
    transB: "no-transpose",
    m: 2,
    n: 2,
    k: 3,
    alpha: 1,
    A: [1, 2, 3, 4, 5, 6],
    lda: 3,
    B: [1, 0, 99, 0, 1, 99, 1, 1, 99],
    ldb: 3,
    beta: 0,
    C: [0, 0, 0, 0],
    ldc: 2,
  },
  {
    label:
      "ldc > n \u2014 padding in output stride (write positions correct, gaps unchanged)",
    transA: "no-transpose",
    transB: "no-transpose",
    m: 2,
    n: 2,
    k: 3,
    alpha: 1,
    A: [1, 2, 3, 4, 5, 6],
    lda: 3,
    B: [1, 0, 0, 1, 1, 1],
    ldb: 2,
    beta: 0,
    C: [0, 0, 99, 0, 0, 99],
    ldc: 3,
  },
  {
    label: "rectangular (m=3, n=2, k=1) \u2014 single accumulation term",
    transA: "no-transpose",
    transB: "no-transpose",
    m: 3,
    n: 2,
    k: 1,
    alpha: 1,
    A: [2, 3, 4],
    lda: 1,
    B: [5, 6],
    ldb: 2,
    beta: 0,
    C: [0, 0, 0, 0, 0, 0],
    ldc: 2,
  },
];

// tests/dgemm/edge-cases-column-major.json
var edge_cases_column_major_default = [
  {
    label:
      "[column-major] alpha=0 \u2014 output is beta*C, no matrix contribution",
    layout: "column-major",
    transA: "no-transpose",
    transB: "no-transpose",
    m: 2,
    n: 2,
    k: 2,
    alpha: 0,
    A: [9, 9, 9, 9],
    lda: 2,
    B: [9, 9, 9, 9],
    ldb: 2,
    beta: 2,
    C: [1, 3, 2, 4],
    ldc: 2,
  },
  {
    label:
      "[column-major] beta=0 \u2014 output is alpha*A*B, no C contribution",
    layout: "column-major",
    transA: "no-transpose",
    transB: "no-transpose",
    m: 2,
    n: 2,
    k: 2,
    alpha: 1,
    A: [1, 0, 0, 1],
    lda: 2,
    B: [5, 7, 6, 8],
    ldb: 2,
    beta: 0,
    C: [99, 99, 99, 99],
    ldc: 2,
  },
  {
    label:
      "[column-major] NoTrans/NoTrans: [[1,2,3],[4,5,6]] * [[1,0],[0,1],[1,1]]",
    layout: "column-major",
    transA: "no-transpose",
    transB: "no-transpose",
    m: 2,
    n: 2,
    k: 3,
    alpha: 1,
    A: [1, 4, 2, 5, 3, 6],
    lda: 2,
    B: [1, 0, 1, 0, 1, 1],
    ldb: 3,
    beta: 0,
    C: [0, 0, 0, 0],
    ldc: 2,
  },
  {
    label:
      "[column-major] TransA: A stored k\xD7m, op(A) = same logical [[1,2,3],[4,5,6]]",
    layout: "column-major",
    transA: "transpose",
    transB: "no-transpose",
    m: 2,
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
      "[column-major] TransB: B stored n\xD7k, op(B) = same logical [[1,0],[0,1],[1,1]]",
    layout: "column-major",
    transA: "no-transpose",
    transB: "transpose",
    m: 2,
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
      "[column-major] lda > m (NoTrans A) \u2014 padding elements in stride gaps are ignored",
    layout: "column-major",
    transA: "no-transpose",
    transB: "no-transpose",
    m: 2,
    n: 2,
    k: 3,
    alpha: 1,
    A: [1, 4, 99, 2, 5, 99, 3, 6, 99],
    lda: 3,
    B: [1, 0, 1, 0, 1, 1],
    ldb: 3,
    beta: 0,
    C: [0, 0, 0, 0],
    ldc: 2,
  },
  {
    label:
      "[column-major] ldc > m \u2014 padding in output stride (write positions correct, gaps unchanged)",
    layout: "column-major",
    transA: "no-transpose",
    transB: "no-transpose",
    m: 2,
    n: 2,
    k: 3,
    alpha: 1,
    A: [1, 4, 2, 5, 3, 6],
    lda: 2,
    B: [1, 0, 1, 0, 1, 1],
    ldb: 3,
    beta: 0,
    C: [0, 0, 99, 0, 0, 99],
    ldc: 3,
  },
];

export { forwardFactor, edge_cases_default, edge_cases_column_major_default };
