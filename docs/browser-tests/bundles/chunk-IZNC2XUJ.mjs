// tests/cscal/helpers.js
var eps = 2 ** -23;
function cscalForwardFactor(gpu, ref, a) {
  let maxFactor = 0;
  for (let i = 0; i < a.n; i++) {
    const idx = i * a.incx;
    const g = gpu.x[idx],
      r = ref.x[idx],
      in_ = a.x[idx];
    const reErr = Math.abs(g.re - r.re);
    const reBound =
      eps * (Math.abs(a.alpha.re * in_.re) + Math.abs(a.alpha.im * in_.im));
    const imErr = Math.abs(g.im - r.im);
    const imBound =
      eps * (Math.abs(a.alpha.re * in_.im) + Math.abs(a.alpha.im * in_.re));
    for (const [err, bound] of [
      [reErr, reBound],
      [imErr, imBound],
    ]) {
      if (bound === 0) {
        if (err !== 0) maxFactor = Infinity;
      } else maxFactor = Math.max(maxFactor, err / bound);
    }
  }
  return maxFactor;
}

// tests/cscal/edge-cases.json
var edge_cases_default = [
  {
    label: "alpha=0 \u2014 all elements zeroed",
    n: 3,
    alpha: { re: 0, im: 0 },
    x: [1, 2, 3, 4, 5, 6],
    incx: 1,
  },
  {
    label: "alpha=1 (real) \u2014 x unchanged",
    n: 3,
    alpha: { re: 1, im: 0 },
    x: [1, 2, 3, 4, 5, 6],
    incx: 1,
  },
  {
    label: "alpha=-1 (real) \u2014 sign flip on every element",
    n: 3,
    alpha: { re: -1, im: 0 },
    x: [1, -2, 3, 4, -5, 6],
    incx: 1,
  },
  {
    label: "alpha=i \u2014 90 degree rotation",
    n: 2,
    alpha: { re: 0, im: 1 },
    x: [1, 0, 0, 1],
    incx: 1,
  },
  {
    label: "all zeros scaled by anything -> all zeros",
    n: 2,
    alpha: { re: 5, im: -2 },
    x: [0, 0, 0, 0],
    incx: 1,
  },
  {
    label: "incx=2 \u2014 gap elements untouched",
    n: 2,
    alpha: { re: 2, im: 0 },
    x: [1, 1, 99, 99, 2, 2, 99, 99],
    incx: 2,
  },
  {
    label: "n=1 \u2014 single element",
    n: 1,
    alpha: { re: 3, im: -1 },
    x: [5, 2],
    incx: 1,
  },
];

export { cscalForwardFactor, edge_cases_default };
