// tests/dger/helpers.js
var eps = 2 ** -48;
function forwardFactor(gpu, ref, a) {
  let maxFactor = 0;
  for (let i = 0; i < a.m; i++) {
    const xi = a.x[i * a.incx];
    for (let j = 0; j < a.n; j++) {
      const yj = a.y[j * a.incy];
      const idx = a.layout === "column-major" ? j * a.lda + i : i * a.lda + j;
      const bound = eps * (Math.abs(a.alpha * xi * yj) + Math.abs(a.A[idx]));
      const err = Math.abs(gpu.A[idx] - ref.A[idx]);
      if (bound > 0) maxFactor = Math.max(maxFactor, err / bound);
      else if (err !== 0) maxFactor = Infinity;
    }
  }
  return maxFactor;
}

// tests/dger/edge-cases.json
var edge_cases_default = [
  {
    label: "alpha=0 \u2014 A unchanged, no rank-1 contribution",
    m: 2,
    n: 2,
    alpha: 0,
    x: [1, 1],
    incx: 1,
    y: [1, 1],
    incy: 1,
    A: [9, 9, 9, 9],
    lda: 2,
  },
  {
    label: "rectangular 2x3 rank-1 update: x=[1,2], y=[1,0,-1]",
    m: 2,
    n: 3,
    alpha: 1,
    x: [1, 2],
    incx: 1,
    y: [1, 0, -1],
    incy: 1,
    A: [0, 0, 0, 0, 0, 0],
    lda: 3,
  },
  {
    label: "lda > n \u2014 padding elements in stride gaps are ignored",
    m: 2,
    n: 2,
    alpha: 1,
    x: [1, 1],
    incx: 1,
    y: [1, 1],
    incy: 1,
    A: [1, 2, 99, 3, 4, 99],
    lda: 3,
  },
  {
    label: "incx=2 \u2014 reads every other element of x",
    m: 3,
    n: 1,
    alpha: 1,
    x: [1, 99, 2, 99, 3],
    incx: 2,
    y: [1],
    incy: 1,
    A: [0, 0, 0],
    lda: 1,
  },
  {
    label: "incy=2 \u2014 reads every other element of y",
    m: 1,
    n: 2,
    alpha: 1,
    x: [1],
    incx: 1,
    y: [2, 99, 3],
    incy: 2,
    A: [0, 0],
    lda: 2,
  },
  {
    label: "alpha=-1 \u2014 subtracts the outer product from A",
    m: 2,
    n: 2,
    alpha: -1,
    x: [1, 2],
    incx: 1,
    y: [1, 1],
    incy: 1,
    A: [10, 10, 10, 10],
    lda: 2,
  },
];

// tests/dger/edge-cases-column-major.json
var edge_cases_column_major_default = [
  {
    label: "[column-major] alpha=0 \u2014 A unchanged, no rank-1 contribution",
    layout: "column-major",
    m: 2,
    n: 2,
    alpha: 0,
    x: [1, 1],
    incx: 1,
    y: [1, 1],
    incy: 1,
    A: [9, 9, 9, 9],
    lda: 2,
  },
  {
    label: "[column-major] rectangular 2x3 rank-1 update: x=[1,2], y=[1,0,-1]",
    layout: "column-major",
    m: 2,
    n: 3,
    alpha: 1,
    x: [1, 2],
    incx: 1,
    y: [1, 0, -1],
    incy: 1,
    A: [0, 0, 0, 0, 0, 0],
    lda: 2,
  },
  {
    label:
      "[column-major] lda > m \u2014 padding elements in stride gaps are ignored",
    layout: "column-major",
    m: 2,
    n: 2,
    alpha: 1,
    x: [1, 1],
    incx: 1,
    y: [1, 1],
    incy: 1,
    A: [1, 3, 99, 2, 4, 99],
    lda: 3,
  },
  {
    label: "[column-major] incx=2 \u2014 reads every other element of x",
    layout: "column-major",
    m: 3,
    n: 1,
    alpha: 1,
    x: [1, 99, 2, 99, 3],
    incx: 2,
    y: [1],
    incy: 1,
    A: [0, 0, 0],
    lda: 3,
  },
  {
    label: "[column-major] incy=2 \u2014 reads every other element of y",
    layout: "column-major",
    m: 1,
    n: 2,
    alpha: 1,
    x: [1],
    incx: 1,
    y: [2, 99, 3],
    incy: 2,
    A: [0, 0],
    lda: 1,
  },
  {
    label: "[column-major] alpha=-1 \u2014 subtracts the outer product from A",
    layout: "column-major",
    m: 2,
    n: 2,
    alpha: -1,
    x: [1, 2],
    incx: 1,
    y: [1, 1],
    incy: 1,
    A: [10, 10, 10, 10],
    lda: 2,
  },
];

export { forwardFactor, edge_cases_default, edge_cases_column_major_default };
