// tests/daxpy/helpers.js
var eps = 2 ** -48;
function forwardFactor(gpu, ref, a) {
  let maxFactor = 0;
  for (let i = 0; i < a.n; i++) {
    const xi = a.x[i * a.incx];
    const yi = a.y[i * a.incy];
    const bound = eps * (Math.abs(a.alpha * xi) + Math.abs(yi));
    const err = Math.abs(gpu.y[i * a.incy] - ref.y[i * a.incy]);
    if (bound > 0) maxFactor = Math.max(maxFactor, err / bound);
    else if (err !== 0) maxFactor = Infinity;
  }
  return maxFactor;
}

// tests/daxpy/edge-cases.json
var edge_cases_default = [
  {
    label: "alpha=0 \u2014 y unchanged even with large x",
    n: 3,
    alpha: 0,
    x: [100, 200, 300],
    incx: 1,
    y: [3, 4, 5],
    incy: 1,
  },
  {
    label: "alpha=1 \u2014 reduces to y[i] += x[i]",
    n: 3,
    alpha: 1,
    x: [1, 2, 3],
    incx: 1,
    y: [4, 5, 6],
    incy: 1,
  },
  {
    label: "alpha=-1 \u2014 reduces to y[i] -= x[i]",
    n: 3,
    alpha: -1,
    x: [1, 2, 3],
    incx: 1,
    y: [4, 5, 6],
    incy: 1,
  },
  {
    label: "x all zeros \u2014 y unchanged regardless of alpha",
    n: 3,
    alpha: 5,
    x: [0, 0, 0],
    incx: 1,
    y: [1, 2, 3],
    incy: 1,
  },
  {
    label: "incx=2, incy=1 \u2014 independent strides",
    n: 3,
    alpha: 2,
    x: [1, 99, 2, 99, 3],
    incx: 2,
    y: [10, 20, 30],
    incy: 1,
  },
  {
    label: "n=1 \u2014 single element",
    n: 1,
    alpha: 2,
    x: [5],
    incx: 1,
    y: [3],
    incy: 1,
  },
  {
    label: "x aliased with y (y := (alpha+1)*x)",
    n: 3,
    alpha: 2,
    x: [1, 2, 3],
    incx: 1,
    y: [1, 2, 3],
    incy: 1,
  },
  {
    label:
      "values beyond the f32 mantissa \u2014 within double-double tolerance, not bit-exact f64",
    n: 3,
    alpha: 1.0000000000000002,
    x: [1.0000000000000002, -2.0000000000000004, 3.000000000000001],
    incx: 1,
    y: [1.0000000000000002, 2.0000000000000004, 1],
    incy: 1,
  },
  {
    label: "catastrophic cancellation \u2014 alpha*x nearly cancels y",
    n: 2,
    alpha: 1e8,
    x: [1, 1],
    incx: 1,
    y: [-9999999999999999e-8, -10000000000000001e-8],
    incy: 1,
  },
];

export { forwardFactor, edge_cases_default };
