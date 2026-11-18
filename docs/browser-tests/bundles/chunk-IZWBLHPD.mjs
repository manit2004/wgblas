// tests/dswap/helpers.js
var eps = 2 ** -48;
function forwardFactor(gpu, ref, a) {
  let maxFactor = 0;
  for (let i = 0; i < a.n; i++) {
    const ix = i * a.incx;
    const iy = i * a.incy;
    const xBound = eps * Math.abs(a.y[iy]);
    const xErr = Math.abs(gpu.x[ix] - ref.x[ix]);
    if (xBound > 0) maxFactor = Math.max(maxFactor, xErr / xBound);
    else if (xErr !== 0) maxFactor = Infinity;
    const yBound = eps * Math.abs(a.x[ix]);
    const yErr = Math.abs(gpu.y[iy] - ref.y[iy]);
    if (yBound > 0) maxFactor = Math.max(maxFactor, yErr / yBound);
    else if (yErr !== 0) maxFactor = Infinity;
  }
  return maxFactor;
}

// tests/dswap/edge-cases.json
var edge_cases_default = [
  {
    label: "basic swap \u2014 both vectors fully exchanged",
    n: 3,
    x: [1, 2, 3],
    incx: 1,
    y: [4, 5, 6],
    incy: 1,
  },
  {
    label: "incx=2, incy=1 \u2014 gap elements in x untouched",
    n: 3,
    x: [1, 99, 2, 99, 3],
    incx: 2,
    y: [4, 5, 6],
    incy: 1,
  },
  {
    label: "incx=1, incy=2 \u2014 gap elements in y untouched",
    n: 3,
    x: [1, 2, 3],
    incx: 1,
    y: [4, 99, 5, 99, 6],
    incy: 2,
  },
  {
    label: "negative values preserved across swap",
    n: 2,
    x: [-1, -2],
    incx: 1,
    y: [3, 4],
    incy: 1,
  },
  {
    label: "genuine double precision, not f32-exact",
    n: 2,
    x: [3.14159265358979, 2.71828182845905],
    incx: 1,
    y: [1.41421356237309, 1.73205080756888],
    incy: 1,
  },
  {
    label: "n=1 \u2014 single element exchange",
    n: 1,
    x: [7],
    incx: 1,
    y: [8],
    incy: 1,
  },
];

export { forwardFactor, edge_cases_default };
