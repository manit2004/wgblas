// tests/ddot/helpers.js
var eps = 2 ** -48;
function forwardFactor(gpu, ref, a) {
  let sumAbsProd = 0;
  for (let i = 0; i < a.n; i++) {
    sumAbsProd += Math.abs(a.x[i * a.incx] * a.y[i * a.incy]);
  }
  const bound = a.n * eps * sumAbsProd;
  if (bound === 0) return gpu.dot === ref ? 0 : Infinity;
  return Math.abs(gpu.dot - ref) / bound;
}

// tests/ddot/edge-cases.json
var edge_cases_default = [
  {
    label: "simple positive vectors",
    n: 4,
    x: [1, 2, 3, 4],
    incx: 1,
    y: [5, 6, 7, 8],
    incy: 1,
  },
  {
    label: "mixed signs \u2014 products cancel to zero",
    n: 2,
    x: [3, 3],
    incx: 1,
    y: [4, -4],
    incy: 1,
  },
  {
    label: "all zeros in y \u2192 0",
    n: 3,
    x: [1, 2, 3],
    incx: 1,
    y: [0, 0, 0],
    incy: 1,
  },
  { label: "n=1 negative product", n: 1, x: [-7], incx: 1, y: [3], incy: 1 },
  {
    label: "incx=2 \u2014 only strided elements of x used",
    n: 3,
    x: [1, 99, 2, 99, 3],
    incx: 2,
    y: [4, 5, 6],
    incy: 1,
  },
  {
    label: "incy=3 \u2014 only strided elements of y used",
    n: 3,
    x: [1, 2, 3],
    incx: 1,
    y: [4, 99, 99, 5, 99, 99, 6],
    incy: 3,
  },
  {
    label: "both strided",
    n: 3,
    x: [1, 0, 2, 0, 3],
    incx: 2,
    y: [4, 0, 5, 0, 6],
    incy: 2,
  },
  {
    label: "x aliased with y (dot of a vector with itself)",
    n: 3,
    x: [1, 2, 3],
    incx: 1,
    y: [1, 2, 3],
    incy: 1,
  },
  {
    label: "sum below f32 resolution \u2014 the reason ddot exists",
    n: 2,
    x: [1, 1e-9],
    incx: 1,
    y: [1, 1],
    incy: 1,
  },
  {
    label:
      "values beyond the f32 mantissa \u2014 within double-double ULP tolerance, not bit-exact f64",
    n: 3,
    x: [1.0000000000000002, -2.0000000000000004, 3.000000000000001],
    incx: 1,
    y: [1.0000000000000002, 2.0000000000000004, 1],
    incy: 1,
  },
  {
    label: "catastrophic cancellation \u2014 large terms, tiny result",
    n: 2,
    x: [1e8, 1e8],
    incx: 1,
    y: [1, -0.99999999],
    incy: 1,
  },
];

export { forwardFactor, edge_cases_default };
