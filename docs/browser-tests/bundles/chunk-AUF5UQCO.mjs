// tests/dscal/helpers.js
var eps = 2 ** -48;
function forwardFactor(gpu, ref, a) {
  let maxFactor = 0;
  for (let i = 0; i < a.n; i++) {
    const idx = i * a.incx;
    const bound = eps * Math.abs(a.alpha * a.x[idx]);
    const err = Math.abs(gpu.x[idx] - ref.x[idx]);
    if (bound > 0) maxFactor = Math.max(maxFactor, err / bound);
    else if (err !== 0) maxFactor = Infinity;
  }
  return maxFactor;
}

// tests/dscal/edge-cases.json
var edge_cases_default = [
  {
    label: "alpha=0 \u2014 all elements zeroed",
    n: 3,
    alpha: 0,
    x: [1.5, 2.25, 3.125],
    incx: 1,
  },
  {
    label: "alpha=1 \u2014 x unchanged",
    n: 3,
    alpha: 1,
    x: [1.123456789012345, 2.5, 3.1],
    incx: 1,
  },
  {
    label: "alpha=-1 \u2014 sign flip on every element",
    n: 3,
    alpha: -1,
    x: [1.5, -2.25, 3.125],
    incx: 1,
  },
  {
    label: "all zeros scaled by anything -> all zeros",
    n: 3,
    alpha: 5,
    x: [0, 0, 0],
    incx: 1,
  },
  {
    label: "incx=2 \u2014 gap elements untouched",
    n: 3,
    alpha: 2,
    x: [1.5, 99, 2.25, 99, 3.125],
    incx: 2,
  },
  { label: "n=1 \u2014 single element", n: 1, alpha: 3, x: [5.5], incx: 1 },
];

export { forwardFactor, edge_cases_default };
