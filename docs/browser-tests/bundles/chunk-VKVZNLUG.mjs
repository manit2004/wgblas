// tests/strsv/helpers.js
var eps = 2 ** -23;
function backwardResidualFactor(gpu, ref, a) {
  const { uplo, trans, diag, n, A, lda, incx, layout } = a;
  const b = a.x;
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
    let acc = 0;
    let dotBound = 0;
    const addTerm = (r, c, j) => {
      const coeff = elem(r, c);
      acc += coeff * gpu.x[j * incx];
      dotBound += Math.abs(coeff) * Math.abs(gpu.x[j * incx]);
    };
    if (isNoTrans) {
      if (isLower) for (let j = 0; j <= i; j++) addTerm(i, j, j);
      else for (let j = i; j < n; j++) addTerm(i, j, j);
    } else {
      if (isLower) for (let j = i; j < n; j++) addTerm(j, i, j);
      else for (let j = 0; j <= i; j++) addTerm(j, i, j);
    }
    const err = Math.abs(acc - b[i * incx]);
    const bound = eps * (n + 1) * dotBound;
    if (bound === 0) {
      if (err !== 0) maxFactor = Infinity;
    } else maxFactor = Math.max(maxFactor, err / bound);
  }
  return maxFactor;
}

// tests/strsv/edge-cases.json
var edge_cases_default = [
  {
    label: "lower no-transpose",
    uplo: "lower",
    trans: "no-transpose",
    diag: "non-unit",
    n: 2,
    A: [2, 99, 3, 4],
    lda: 2,
    x: [4, 11],
    incx: 1,
  },
  {
    label: "upper no-transpose",
    uplo: "upper",
    trans: "no-transpose",
    diag: "non-unit",
    n: 2,
    A: [2, 3, 99, 4],
    lda: 2,
    x: [10, 8],
    incx: 1,
  },
  {
    label: "lower transpose",
    uplo: "lower",
    trans: "transpose",
    diag: "non-unit",
    n: 2,
    A: [2, 99, 3, 4],
    lda: 2,
    x: [10, 8],
    incx: 1,
  },
  {
    label: "upper transpose",
    uplo: "upper",
    trans: "transpose",
    diag: "non-unit",
    n: 2,
    A: [2, 3, 99, 4],
    lda: 2,
    x: [4, 14],
    incx: 1,
  },
  {
    label: "n=1 lower",
    uplo: "lower",
    trans: "no-transpose",
    diag: "non-unit",
    n: 1,
    A: [5],
    lda: 1,
    x: [10],
    incx: 1,
  },
  {
    label: "incx=2 lower no-transpose",
    uplo: "lower",
    trans: "no-transpose",
    diag: "non-unit",
    n: 3,
    A: [1, 99, 99, 2, 1, 99, 3, 4, 1],
    lda: 3,
    x: [2, 99, 7, 99, 22],
    incx: 2,
  },
  {
    label: "unit diag lower no-transpose",
    uplo: "lower",
    trans: "no-transpose",
    diag: "unit",
    n: 2,
    A: [99, 99, 3, 99],
    lda: 2,
    x: [2, 11],
    incx: 1,
  },
  {
    label: "unit diag upper transpose",
    uplo: "upper",
    trans: "transpose",
    diag: "unit",
    n: 2,
    A: [99, 3, 99, 99],
    lda: 2,
    x: [2, 13],
    incx: 1,
  },
];

// tests/strsv/edge-cases-column-major.json
var edge_cases_column_major_default = [
  {
    label: "[column-major] lower no-transpose",
    layout: "column-major",
    uplo: "lower",
    trans: "no-transpose",
    diag: "non-unit",
    n: 2,
    A: [2, 3, 99, 4],
    lda: 2,
    x: [4, 11],
    incx: 1,
  },
  {
    label: "[column-major] upper no-transpose",
    layout: "column-major",
    uplo: "upper",
    trans: "no-transpose",
    diag: "non-unit",
    n: 2,
    A: [2, 99, 3, 4],
    lda: 2,
    x: [10, 8],
    incx: 1,
  },
  {
    label: "[column-major] lower transpose",
    layout: "column-major",
    uplo: "lower",
    trans: "transpose",
    diag: "non-unit",
    n: 2,
    A: [2, 3, 99, 4],
    lda: 2,
    x: [10, 8],
    incx: 1,
  },
  {
    label: "[column-major] upper transpose",
    layout: "column-major",
    uplo: "upper",
    trans: "transpose",
    diag: "non-unit",
    n: 2,
    A: [2, 99, 3, 4],
    lda: 2,
    x: [4, 14],
    incx: 1,
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
    x: [10],
    incx: 1,
  },
  {
    label: "[column-major] incx=2 lower no-transpose",
    layout: "column-major",
    uplo: "lower",
    trans: "no-transpose",
    diag: "non-unit",
    n: 3,
    A: [1, 2, 3, 99, 1, 4, 99, 99, 1],
    lda: 3,
    x: [2, 99, 7, 99, 22],
    incx: 2,
  },
  {
    label: "[column-major] unit diag lower no-transpose",
    layout: "column-major",
    uplo: "lower",
    trans: "no-transpose",
    diag: "unit",
    n: 2,
    A: [99, 3, 99, 99],
    lda: 2,
    x: [2, 11],
    incx: 1,
  },
  {
    label: "[column-major] unit diag upper transpose",
    layout: "column-major",
    uplo: "upper",
    trans: "transpose",
    diag: "unit",
    n: 2,
    A: [99, 99, 3, 99],
    lda: 2,
    x: [2, 13],
    incx: 1,
  },
];

export {
  backwardResidualFactor,
  edge_cases_default,
  edge_cases_column_major_default,
};
