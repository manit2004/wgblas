// tests/dsymv/helpers.js
var eps = 2 ** -48;
function forwardFactor(gpu, ref, a) {
  const { uplo, n, alpha, A, lda, x, incx, beta, y, incy, layout } = a;
  const isLower = uplo === "lower";
  const at =
    layout === "column-major"
      ? (row, col) => A[col * lda + row]
      : (row, col) => A[row * lda + col];
  let maxFactor = 0;
  for (let i = 0; i < n; i++) {
    const err = Math.abs(gpu.y[i * incy] - ref.y[i * incy]);
    let dotBound = 0;
    for (let j = 0; j < n; j++) {
      const aij = isLower
        ? i >= j
          ? Math.abs(at(i, j))
          : Math.abs(at(j, i))
        : i <= j
          ? Math.abs(at(i, j))
          : Math.abs(at(j, i));
      dotBound += aij * Math.abs(x[j * incx]);
    }
    const bound =
      eps *
      ((n + 2) * Math.abs(alpha) * dotBound +
        2 * Math.abs(beta) * Math.abs(y[i * incy]));
    if (bound === 0) {
      if (err !== 0) maxFactor = Infinity;
    } else maxFactor = Math.max(maxFactor, err / bound);
  }
  return maxFactor;
}

// tests/dsymv/edge-cases.json
var edge_cases_default = [
  {
    label: "alpha=0 \u2014 output is beta*y, no matrix contribution",
    uplo: "lower",
    n: 2,
    alpha: 0,
    A: [9, 9, 9, 9],
    lda: 2,
    x: [1, 1],
    incx: 1,
    beta: 2,
    y: [3, 4],
    incy: 1,
  },
  {
    label: "beta=0 \u2014 output is alpha*A*x, no y contribution",
    uplo: "lower",
    n: 2,
    alpha: 3,
    A: [1, 0, 0, 1],
    lda: 2,
    x: [5, 7],
    incx: 1,
    beta: 0,
    y: [99, 99],
    incy: 1,
  },
  {
    label: "lower: [[1,2],[2,3]] * [1,1] = [3,5]",
    uplo: "lower",
    n: 2,
    alpha: 1,
    A: [1, 99, 2, 3],
    lda: 2,
    x: [1, 1],
    incx: 1,
    beta: 0,
    y: [0, 0],
    incy: 1,
  },
  {
    label:
      "upper: [[1,2],[2,3]] * [1,1] = [3,5] \u2014 same matrix, different storage",
    uplo: "upper",
    n: 2,
    alpha: 1,
    A: [1, 2, 99, 3],
    lda: 2,
    x: [1, 1],
    incx: 1,
    beta: 0,
    y: [0, 0],
    incy: 1,
  },
  {
    label: "lda > n \u2014 padding elements in stride gaps are ignored",
    uplo: "lower",
    n: 3,
    alpha: 1,
    A: [1, 0, 0, 99, 0, 1, 0, 99, 0, 0, 1, 99],
    lda: 4,
    x: [2, 3, 5],
    incx: 1,
    beta: 0,
    y: [0, 0, 0],
    incy: 1,
  },
  {
    label: "incx=2 \u2014 reads every other element of x",
    uplo: "lower",
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
    label: "incy=2 \u2014 writes every other element of y, gaps unchanged",
    uplo: "lower",
    n: 1,
    alpha: 1,
    A: [5],
    lda: 1,
    x: [2],
    incx: 1,
    beta: 0,
    y: [0, 99],
    incy: 2,
  },
  {
    label: "beta accumulation \u2014 y_out = alpha*A*x + beta*y_in",
    uplo: "lower",
    n: 2,
    alpha: 1,
    A: [1, 0, 0, 1],
    lda: 2,
    x: [1, 2],
    incx: 1,
    beta: 2,
    y: [10, 20],
    incy: 1,
  },
];

// tests/dsymv/edge-cases-column-major.json
var edge_cases_column_major_default = [
  {
    label:
      "[column-major] alpha=0 \u2014 output is beta*y, no matrix contribution",
    layout: "column-major",
    uplo: "lower",
    n: 2,
    alpha: 0,
    A: [9, 9, 9, 9],
    lda: 2,
    x: [1, 1],
    incx: 1,
    beta: 2,
    y: [3, 4],
    incy: 1,
  },
  {
    label:
      "[column-major] beta=0 \u2014 output is alpha*A*x, no y contribution",
    layout: "column-major",
    uplo: "lower",
    n: 2,
    alpha: 3,
    A: [1, 0, 0, 1],
    lda: 2,
    x: [5, 7],
    incx: 1,
    beta: 0,
    y: [99, 99],
    incy: 1,
  },
  {
    label: "[column-major] lower: [[1,2],[2,3]] * [1,1] = [3,5]",
    layout: "column-major",
    uplo: "lower",
    n: 2,
    alpha: 1,
    A: [1, 2, 99, 3],
    lda: 2,
    x: [1, 1],
    incx: 1,
    beta: 0,
    y: [0, 0],
    incy: 1,
  },
  {
    label:
      "[column-major] upper: [[1,2],[2,3]] * [1,1] = [3,5] \u2014 same matrix, different storage",
    layout: "column-major",
    uplo: "upper",
    n: 2,
    alpha: 1,
    A: [1, 99, 2, 3],
    lda: 2,
    x: [1, 1],
    incx: 1,
    beta: 0,
    y: [0, 0],
    incy: 1,
  },
  {
    label:
      "[column-major] lda > n \u2014 padding elements in stride gaps are ignored",
    layout: "column-major",
    uplo: "lower",
    n: 3,
    alpha: 1,
    A: [1, 0, 0, 99, 0, 1, 0, 99, 0, 0, 1, 99],
    lda: 4,
    x: [2, 3, 5],
    incx: 1,
    beta: 0,
    y: [0, 0, 0],
    incy: 1,
  },
  {
    label: "[column-major] incx=2 \u2014 reads every other element of x",
    layout: "column-major",
    uplo: "lower",
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
      "[column-major] incy=2 \u2014 writes every other element of y, gaps unchanged",
    layout: "column-major",
    uplo: "lower",
    n: 1,
    alpha: 1,
    A: [5],
    lda: 1,
    x: [2],
    incx: 1,
    beta: 0,
    y: [0, 99],
    incy: 2,
  },
  {
    label:
      "[column-major] beta accumulation \u2014 y_out = alpha*A*x + beta*y_in",
    layout: "column-major",
    uplo: "lower",
    n: 2,
    alpha: 1,
    A: [1, 0, 0, 1],
    lda: 2,
    x: [1, 2],
    incx: 1,
    beta: 2,
    y: [10, 20],
    incy: 1,
  },
];

export { forwardFactor, edge_cases_default, edge_cases_column_major_default };
