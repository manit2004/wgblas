// tests/sgemv/helpers.js
var eps = 2 ** -23;
function forwardFactor(gpu, ref, a) {
  const { trans, m, n, alpha, A, lda, x, incx, beta, y, incy, layout } = a;
  const isNoTrans = trans === "no-transpose";
  const yLen = isNoTrans ? m : n;
  const nTerms = isNoTrans ? n : m;
  const at =
    layout === "column-major"
      ? (row, col) => A[col * lda + row]
      : (row, col) => A[row * lda + col];
  let maxFactor = 0;
  for (let i = 0; i < yLen; i++) {
    const err = Math.abs(gpu.y[i * incy] - ref.y[i * incy]);
    let dotBound = 0;
    if (isNoTrans) {
      for (let j = 0; j < n; j++)
        dotBound += Math.abs(at(i, j)) * Math.abs(x[j * incx]);
    } else {
      for (let j = 0; j < m; j++)
        dotBound += Math.abs(at(j, i)) * Math.abs(x[j * incx]);
    }
    const bound =
      eps *
      ((nTerms + 1) * Math.abs(alpha) * dotBound +
        Math.abs(beta) * Math.abs(y[i * incy]));
    if (bound === 0) {
      if (err !== 0) maxFactor = Infinity;
    } else maxFactor = Math.max(maxFactor, err / bound);
  }
  return maxFactor;
}

// tests/sgemv/edge-cases.json
var edge_cases_default = [
  {
    label: "alpha=0 \u2014 output is beta*y, no matrix contribution",
    trans: "no-transpose",
    m: 2,
    n: 3,
    alpha: 0,
    A: [9, 9, 9, 9, 9, 9],
    lda: 3,
    x: [1, 1, 1],
    incx: 1,
    beta: 2,
    y: [3, 4],
    incy: 1,
  },
  {
    label: "beta=0 \u2014 output is alpha*A*x, no y contribution",
    trans: "no-transpose",
    m: 2,
    n: 2,
    alpha: 3,
    A: [1, 0, 0, 1],
    lda: 2,
    x: [5, 7],
    incx: 1,
    beta: 0,
    y: [0, 0],
    incy: 1,
  },
  {
    label: "NoTrans: row sums of [[1,2,3],[4,5,6]] with x=[1,1,1]",
    trans: "no-transpose",
    m: 2,
    n: 3,
    alpha: 1,
    A: [1, 2, 3, 4, 5, 6],
    lda: 3,
    x: [1, 1, 1],
    incx: 1,
    beta: 0,
    y: [0, 0],
    incy: 1,
  },
  {
    label: "Trans: column sums of [[1,2,3],[4,5,6]] with x=[1,1]",
    trans: "transpose",
    m: 2,
    n: 3,
    alpha: 1,
    A: [1, 2, 3, 4, 5, 6],
    lda: 3,
    x: [1, 1],
    incx: 1,
    beta: 0,
    y: [0, 0, 0],
    incy: 1,
  },
  {
    label: "lda > n \u2014 padding elements in stride gaps are ignored",
    trans: "no-transpose",
    m: 2,
    n: 2,
    alpha: 1,
    A: [1, 2, 99, 99, 3, 4, 99, 99],
    lda: 4,
    x: [1, 1],
    incx: 1,
    beta: 0,
    y: [0, 0],
    incy: 1,
  },
  {
    label: "incx=2 \u2014 reads every other element of x",
    trans: "no-transpose",
    m: 3,
    n: 3,
    alpha: 1,
    A: [1, 0, 0, 0, 1, 0, 0, 0, 1],
    lda: 3,
    x: [1, 99, 2, 99, 3],
    incx: 2,
    beta: 0,
    y: [0, 0, 0],
    incy: 1,
  },
  {
    label: "incy=2 \u2014 writes every other element, gaps unchanged",
    trans: "no-transpose",
    m: 1,
    n: 1,
    alpha: 1,
    A: [2],
    lda: 1,
    x: [3],
    incx: 1,
    beta: 0,
    y: [0, 99],
    incy: 2,
  },
];

// tests/sgemv/edge-cases-column-major.json
var edge_cases_column_major_default = [
  {
    label:
      "[column-major] alpha=0 \u2014 output is beta*y, no matrix contribution",
    layout: "column-major",
    trans: "no-transpose",
    m: 2,
    n: 3,
    alpha: 0,
    A: [9, 9, 9, 9, 9, 9],
    lda: 2,
    x: [1, 1, 1],
    incx: 1,
    beta: 2,
    y: [3, 4],
    incy: 1,
  },
  {
    label:
      "[column-major] beta=0 \u2014 output is alpha*A*x, no y contribution",
    layout: "column-major",
    trans: "no-transpose",
    m: 2,
    n: 2,
    alpha: 3,
    A: [1, 0, 0, 1],
    lda: 2,
    x: [5, 7],
    incx: 1,
    beta: 0,
    y: [0, 0],
    incy: 1,
  },
  {
    label:
      "[column-major] NoTrans: row sums of [[1,2,3],[4,5,6]] with x=[1,1,1]",
    layout: "column-major",
    trans: "no-transpose",
    m: 2,
    n: 3,
    alpha: 1,
    A: [1, 4, 2, 5, 3, 6],
    lda: 2,
    x: [1, 1, 1],
    incx: 1,
    beta: 0,
    y: [0, 0],
    incy: 1,
  },
  {
    label:
      "[column-major] Trans: column sums of [[1,2,3],[4,5,6]] with x=[1,1]",
    layout: "column-major",
    trans: "transpose",
    m: 2,
    n: 3,
    alpha: 1,
    A: [1, 4, 2, 5, 3, 6],
    lda: 2,
    x: [1, 1],
    incx: 1,
    beta: 0,
    y: [0, 0, 0],
    incy: 1,
  },
  {
    label:
      "[column-major] lda > m \u2014 padding elements in stride gaps are ignored",
    layout: "column-major",
    trans: "no-transpose",
    m: 2,
    n: 2,
    alpha: 1,
    A: [1, 3, 99, 99, 2, 4, 99, 99],
    lda: 4,
    x: [1, 1],
    incx: 1,
    beta: 0,
    y: [0, 0],
    incy: 1,
  },
  {
    label: "[column-major] incx=2 \u2014 reads every other element of x",
    layout: "column-major",
    trans: "no-transpose",
    m: 3,
    n: 3,
    alpha: 1,
    A: [1, 0, 0, 0, 1, 0, 0, 0, 1],
    lda: 3,
    x: [1, 99, 2, 99, 3],
    incx: 2,
    beta: 0,
    y: [0, 0, 0],
    incy: 1,
  },
  {
    label:
      "[column-major] incy=2 \u2014 writes every other element, gaps unchanged",
    layout: "column-major",
    trans: "no-transpose",
    m: 1,
    n: 1,
    alpha: 1,
    A: [2],
    lda: 1,
    x: [3],
    incx: 1,
    beta: 0,
    y: [0, 99],
    incy: 2,
  },
];

export { forwardFactor, edge_cases_default, edge_cases_column_major_default };
