// tests/srot/helpers.js
var eps = 2 ** -23;
function forwardFactor(gpu, ref, a) {
  let maxFactor = 0;
  for (let i = 0; i < a.n; i++) {
    const xi = a.x[i * a.incx];
    const yi = a.y[i * a.incy];
    const xBound = eps * (Math.abs(a.c * xi) + Math.abs(a.s * yi));
    const yBound = eps * (Math.abs(a.c * yi) + Math.abs(a.s * xi));
    const xErr = Math.abs(gpu.x[i * a.incx] - ref.x[i * a.incx]);
    const yErr = Math.abs(gpu.y[i * a.incy] - ref.y[i * a.incy]);
    if (xBound > 0) maxFactor = Math.max(maxFactor, xErr / xBound);
    else if (xErr !== 0) maxFactor = Infinity;
    if (yBound > 0) maxFactor = Math.max(maxFactor, yErr / yBound);
    else if (yErr !== 0) maxFactor = Infinity;
  }
  return maxFactor;
}

// tests/srot/edge-cases.json
var edge_cases_default = [
  {
    label: "identity rotation (c=1, s=0) \u2014 both vectors unchanged",
    n: 3,
    x: [1, 2, 3],
    incx: 1,
    y: [4, 5, 6],
    incy: 1,
    c: 1,
    s: 0,
  },
  {
    label: "90\xB0 rotation (c=0, s=1) \u2014 x\u2190y, y\u2190\u2212x",
    n: 3,
    x: [1, 2, 3],
    incx: 1,
    y: [4, 5, 6],
    incy: 1,
    c: 0,
    s: 1,
  },
  {
    label: "n=1 \u2014 single pair",
    n: 1,
    x: [2],
    incx: 1,
    y: [3],
    incy: 1,
    c: 0,
    s: 1,
  },
  {
    label: "incx=2, incy=1 \u2014 gap elements in x untouched",
    n: 2,
    x: [1, 99, 2],
    incx: 2,
    y: [3, 4],
    incy: 1,
    c: 0,
    s: 1,
  },
];

export { forwardFactor, edge_cases_default };
