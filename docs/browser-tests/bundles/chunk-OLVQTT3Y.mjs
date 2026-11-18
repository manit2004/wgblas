// tests/dcopy/helpers.js
var eps = 2 ** -48;
function forwardFactor(gpu, ref, a) {
  let maxFactor = 0;
  for (let i = 0; i < a.n; i++) {
    const ix = i * a.incx;
    const iy = i * a.incy;
    const bound = eps * Math.abs(a.x[ix]);
    const err = Math.abs(gpu.y[iy] - ref.y[iy]);
    if (bound > 0) maxFactor = Math.max(maxFactor, err / bound);
    else if (err !== 0) maxFactor = Infinity;
  }
  return maxFactor;
}

// tests/dcopy/edge-cases.json
var edge_cases_default = [
  {
    label: "incx=2, incy=1 \u2014 independent strides",
    n: 3,
    x: [1, 99, 2, 99, 3],
    incx: 2,
    y: [0, 0, 0],
    incy: 1,
  },
  {
    label: "incx=1, incy=2 \u2014 odd y slots untouched",
    n: 3,
    x: [1, 2, 3],
    incx: 1,
    y: [0, 99, 0, 99, 0],
    incy: 2,
  },
  {
    label: "y elements beyond n are untouched",
    n: 2,
    x: [7, 8],
    incx: 1,
    y: [1, 2, 3, 4, 5],
    incy: 1,
  },
  {
    label: "negative values preserved \u2014 bitwise copy",
    n: 3,
    x: [-1, -2, -3],
    incx: 1,
    y: [0, 0, 0],
    incy: 1,
  },
  {
    label: "genuine double precision, not f32-exact",
    n: 2,
    x: [3.14159265358979, 2.71828182845905],
    incx: 1,
    y: [0, 0],
    incy: 1,
  },
  {
    label: "n=1 \u2014 single element",
    n: 1,
    x: [5],
    incx: 1,
    y: [0],
    incy: 1,
  },
];

export { forwardFactor, edge_cases_default };
