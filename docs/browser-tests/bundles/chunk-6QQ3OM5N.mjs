// tests/dtrmv/helpers.js
var eps = 2 ** -48;
function forwardFactor(gpu, ref, a) {
  const { uplo, trans, diag, n, A, lda, x, incx, incy, layout } = a;
  const isLower = uplo === "lower";
  const isNoTrans = trans === "no-transpose";
  const isUnit = diag === "unit";
  const at =
    layout === "column-major"
      ? (row, col) => A[col * lda + row]
      : (row, col) => A[row * lda + col];
  const elem = (r, c) => (isUnit && r === c ? 1 : at(r, c));
  let maxFactor = 0;
  for (let i = 0; i < n; i++) {
    const err = Math.abs(gpu.y[i * incy] - ref.y[i * incy]);
    let dotBound = 0;
    if (isNoTrans) {
      if (isLower) {
        for (let j = 0; j <= i; j++) {
          dotBound += Math.abs(elem(i, j)) * Math.abs(x[j * incx]);
        }
      } else {
        for (let j = i; j < n; j++) {
          dotBound += Math.abs(elem(i, j)) * Math.abs(x[j * incx]);
        }
      }
    } else {
      if (isLower) {
        for (let j = i; j < n; j++) {
          dotBound += Math.abs(elem(j, i)) * Math.abs(x[j * incx]);
        }
      } else {
        for (let j = 0; j <= i; j++) {
          dotBound += Math.abs(elem(j, i)) * Math.abs(x[j * incx]);
        }
      }
    }
    const bound = eps * (n + 1) * dotBound;
    if (bound === 0) {
      if (err !== 0) maxFactor = Infinity;
    } else maxFactor = Math.max(maxFactor, err / bound);
  }
  return maxFactor;
}

// tests/dtrmv/edge-cases.json
var edge_cases_default = [
  {
    label: "lower no-transpose",
    uplo: "lower",
    trans: "no-transpose",
    diag: "non-unit",
    n: 2,
    A: [1, 99, 2, 3],
    lda: 2,
    x: [1, 1],
    incx: 1,
    incy: 1,
  },
  {
    label: "upper no-transpose",
    uplo: "upper",
    trans: "no-transpose",
    diag: "non-unit",
    n: 2,
    A: [1, 2, 99, 3],
    lda: 2,
    x: [1, 1],
    incx: 1,
    incy: 1,
  },
  {
    label: "lower transpose",
    uplo: "lower",
    trans: "transpose",
    diag: "non-unit",
    n: 2,
    A: [1, 99, 2, 3],
    lda: 2,
    x: [1, 1],
    incx: 1,
    incy: 1,
  },
  {
    label: "upper transpose",
    uplo: "upper",
    trans: "transpose",
    diag: "non-unit",
    n: 2,
    A: [1, 2, 99, 3],
    lda: 2,
    x: [1, 1],
    incx: 1,
    incy: 1,
  },
  {
    label: "n=1 lower",
    uplo: "lower",
    trans: "no-transpose",
    diag: "non-unit",
    n: 1,
    A: [5],
    lda: 1,
    x: [2],
    incx: 1,
    incy: 1,
  },
  {
    label: "incx=2 lower no-transpose",
    uplo: "lower",
    trans: "no-transpose",
    diag: "non-unit",
    n: 3,
    A: [1, 0, 0, 0, 1, 0, 0, 0, 1],
    lda: 3,
    x: [1, 99, 2, 99, 3],
    incx: 2,
    incy: 1,
  },
  {
    label: "incy=2 lower no-transpose",
    uplo: "lower",
    trans: "no-transpose",
    diag: "non-unit",
    n: 2,
    A: [1, 0, 2, 3],
    lda: 2,
    x: [1, 1],
    incx: 1,
    incy: 2,
  },
  {
    label: "unit diag lower no-transpose",
    uplo: "lower",
    trans: "no-transpose",
    diag: "unit",
    n: 2,
    A: [99, 0, 2, 99],
    lda: 2,
    x: [1, 1],
    incx: 1,
    incy: 1,
  },
  {
    label: "unit diag upper transpose",
    uplo: "upper",
    trans: "transpose",
    diag: "unit",
    n: 2,
    A: [99, 2, 0, 99],
    lda: 2,
    x: [1, 1],
    incx: 1,
    incy: 1,
  },
];

// tests/dtrmv/edge-cases-column-major.json
var edge_cases_column_major_default = [
  {
    label: "[column-major] lower no-transpose",
    layout: "column-major",
    uplo: "lower",
    trans: "no-transpose",
    diag: "non-unit",
    n: 2,
    A: [1, 2, 99, 3],
    lda: 2,
    x: [1, 1],
    incx: 1,
    incy: 1,
  },
  {
    label: "[column-major] upper no-transpose",
    layout: "column-major",
    uplo: "upper",
    trans: "no-transpose",
    diag: "non-unit",
    n: 2,
    A: [1, 99, 2, 3],
    lda: 2,
    x: [1, 1],
    incx: 1,
    incy: 1,
  },
  {
    label: "[column-major] lower transpose",
    layout: "column-major",
    uplo: "lower",
    trans: "transpose",
    diag: "non-unit",
    n: 2,
    A: [1, 2, 99, 3],
    lda: 2,
    x: [1, 1],
    incx: 1,
    incy: 1,
  },
  {
    label: "[column-major] upper transpose",
    layout: "column-major",
    uplo: "upper",
    trans: "transpose",
    diag: "non-unit",
    n: 2,
    A: [1, 99, 2, 3],
    lda: 2,
    x: [1, 1],
    incx: 1,
    incy: 1,
  },
  {
    label: "[column-major] n=1 lower",
    layout: "column-major",
    uplo: "lower",
    trans: "no-transpose",
    diag: "non-unit",
    n: 1,
    A: [5],
    lda: 1,
    x: [2],
    incx: 1,
    incy: 1,
  },
  {
    label: "[column-major] incx=2 lower no-transpose",
    layout: "column-major",
    uplo: "lower",
    trans: "no-transpose",
    diag: "non-unit",
    n: 3,
    A: [1, 0, 0, 0, 1, 0, 0, 0, 1],
    lda: 3,
    x: [1, 99, 2, 99, 3],
    incx: 2,
    incy: 1,
  },
  {
    label: "[column-major] incy=2 lower no-transpose",
    layout: "column-major",
    uplo: "lower",
    trans: "no-transpose",
    diag: "non-unit",
    n: 2,
    A: [1, 2, 0, 3],
    lda: 2,
    x: [1, 1],
    incx: 1,
    incy: 2,
  },
  {
    label: "[column-major] unit diag lower no-transpose",
    layout: "column-major",
    uplo: "lower",
    trans: "no-transpose",
    diag: "unit",
    n: 2,
    A: [99, 2, 0, 99],
    lda: 2,
    x: [1, 1],
    incx: 1,
    incy: 1,
  },
  {
    label: "[column-major] unit diag upper transpose",
    layout: "column-major",
    uplo: "upper",
    trans: "transpose",
    diag: "unit",
    n: 2,
    A: [99, 0, 2, 99],
    lda: 2,
    x: [1, 1],
    incx: 1,
    incy: 1,
  },
];

export { forwardFactor, edge_cases_default, edge_cases_column_major_default };
