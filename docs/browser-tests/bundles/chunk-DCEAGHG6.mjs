// tests/dsyr2/helpers.js
var eps = 2 ** -48;
function forwardFactor(gpu, ref, a) {
  const isLower = a.uplo === "lower";
  const idxOf =
    a.layout === "column-major"
      ? (row, col) => col * a.lda + row
      : (row, col) => row * a.lda + col;
  let maxFactor = 0;
  for (let i = 0; i < a.n; i++) {
    const xi = a.x[i * a.incx];
    const yi = a.y[i * a.incy];
    const jStart = isLower ? 0 : i;
    const jEnd = isLower ? i + 1 : a.n;
    for (let j = jStart; j < jEnd; j++) {
      const xj = a.x[j * a.incx];
      const yj = a.y[j * a.incy];
      const idx = idxOf(i, j);
      const bound =
        eps *
        (Math.abs(a.alpha * xi * yj) +
          Math.abs(a.alpha * yi * xj) +
          Math.abs(a.A[idx]));
      const err = Math.abs(gpu.A[idx] - ref.A[idx]);
      if (bound > 0) maxFactor = Math.max(maxFactor, err / bound);
      else if (err !== 0) maxFactor = Infinity;
    }
  }
  return maxFactor;
}

// tests/dsyr2/edge-cases.json
var edge_cases_default = [
  {
    label: "alpha=0 \u2014 A unchanged, no rank-2 contribution",
    uplo: "lower",
    n: 2,
    alpha: 0,
    x: [1, 2],
    incx: 1,
    y: [3, 4],
    incy: 1,
    A: [9, 9, 9, 9],
    lda: 2,
  },
  {
    label: "lower: x=[1,2], y=[3,4], only lower triangle touched",
    uplo: "lower",
    n: 2,
    alpha: 1,
    x: [1, 2],
    incx: 1,
    y: [3, 4],
    incy: 1,
    A: [0, 99, 0, 0],
    lda: 2,
  },
  {
    label: "upper: same x,y, only upper triangle touched",
    uplo: "upper",
    n: 2,
    alpha: 1,
    x: [1, 2],
    incx: 1,
    y: [3, 4],
    incy: 1,
    A: [0, 0, 99, 0],
    lda: 2,
  },
  {
    label: "lda > n \u2014 padding elements in stride gaps are ignored",
    uplo: "lower",
    n: 2,
    alpha: 1,
    x: [1, 1],
    incx: 1,
    y: [1, 1],
    incy: 1,
    A: [1, 0, 99, 0, 1, 99],
    lda: 3,
  },
  {
    label: "incx=2 \u2014 reads every other element of x",
    uplo: "lower",
    n: 3,
    alpha: 1,
    x: [2, 99, 3, 99, 4],
    incx: 2,
    y: [1, 1, 1],
    incy: 1,
    A: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    lda: 3,
  },
  {
    label: "alpha=-1 \u2014 subtracts the rank-2 update from A",
    uplo: "lower",
    n: 2,
    alpha: -1,
    x: [1, 2],
    incx: 1,
    y: [3, 4],
    incy: 1,
    A: [10, 10, 10, 10],
    lda: 2,
  },
];

// tests/dsyr2/edge-cases-column-major.json
var edge_cases_column_major_default = [
  {
    label: "[column-major] alpha=0 \u2014 A unchanged, no rank-2 contribution",
    layout: "column-major",
    uplo: "lower",
    n: 2,
    alpha: 0,
    x: [1, 2],
    incx: 1,
    y: [3, 4],
    incy: 1,
    A: [9, 9, 9, 9],
    lda: 2,
  },
  {
    label:
      "[column-major] lower: x=[1,2], y=[3,4], only lower triangle touched",
    layout: "column-major",
    uplo: "lower",
    n: 2,
    alpha: 1,
    x: [1, 2],
    incx: 1,
    y: [3, 4],
    incy: 1,
    A: [0, 0, 99, 0],
    lda: 2,
  },
  {
    label: "[column-major] upper: same x,y, only upper triangle touched",
    layout: "column-major",
    uplo: "upper",
    n: 2,
    alpha: 1,
    x: [1, 2],
    incx: 1,
    y: [3, 4],
    incy: 1,
    A: [0, 99, 0, 0],
    lda: 2,
  },
  {
    label:
      "[column-major] lda > n \u2014 padding elements in stride gaps are ignored",
    layout: "column-major",
    uplo: "lower",
    n: 2,
    alpha: 1,
    x: [1, 1],
    incx: 1,
    y: [1, 1],
    incy: 1,
    A: [1, 0, 99, 99, 1, 99],
    lda: 3,
  },
  {
    label: "[column-major] incx=2 \u2014 reads every other element of x",
    layout: "column-major",
    uplo: "lower",
    n: 3,
    alpha: 1,
    x: [2, 99, 3, 99, 4],
    incx: 2,
    y: [1, 1, 1],
    incy: 1,
    A: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    lda: 3,
  },
  {
    label: "[column-major] alpha=-1 \u2014 subtracts the rank-2 update from A",
    layout: "column-major",
    uplo: "lower",
    n: 2,
    alpha: -1,
    x: [1, 2],
    incx: 1,
    y: [3, 4],
    incy: 1,
    A: [10, 10, 10, 10],
    lda: 2,
  },
];

export { forwardFactor, edge_cases_default, edge_cases_column_major_default };
