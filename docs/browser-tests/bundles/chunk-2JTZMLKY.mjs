// tests/sscal/edge-cases.json
var edge_cases_default = [
  {
    label: "alpha=0 \u2014 all elements zeroed",
    n: 3,
    alpha: 0,
    x: [1, 2, 3],
    incx: 1,
  },
  {
    label: "alpha=1 \u2014 x unchanged",
    n: 3,
    alpha: 1,
    x: [1, 2, 3],
    incx: 1,
  },
  {
    label: "alpha=-1 \u2014 sign flip on every element",
    n: 3,
    alpha: -1,
    x: [1, -2, 3],
    incx: 1,
  },
  {
    label: "all zeros scaled by anything \u2192 all zeros",
    n: 3,
    alpha: 5,
    x: [0, 0, 0],
    incx: 1,
  },
  {
    label: "incx=2 \u2014 gap elements untouched",
    n: 3,
    alpha: 2,
    x: [1, 99, 2, 99, 3],
    incx: 2,
  },
  { label: "n=1 \u2014 single element", n: 1, alpha: 3, x: [5], incx: 1 },
];

export { edge_cases_default };
