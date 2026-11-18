// tests/snrm2/edge-cases.json
var edge_cases_default = [
  {
    label: "Pythagorean triple \u2014 exact integer result",
    n: 2,
    x: [3, 4],
    incx: 1,
  },
  {
    label: "all negatives \u2014 same result as positives",
    n: 2,
    x: [-3, -4],
    incx: 1,
  },
  { label: "unit vector \u2014 norm = 1", n: 3, x: [1, 0, 0], incx: 1 },
  { label: "all zeros \u2014 norm = 0", n: 3, x: [0, 0, 0], incx: 1 },
  {
    label: "n=1 negative element \u2014 norm is non-negative",
    n: 1,
    x: [-5],
    incx: 1,
  },
  {
    label: "incx=2 \u2014 Pythagorean triple on strided elements",
    n: 2,
    x: [3, 99, 4],
    incx: 2,
  },
  {
    label:
      "magnitude above naive-squaring overflow threshold (~1.8e19) \u2014 must not return Infinity",
    n: 1,
    x: [3e19],
    incx: 1,
  },
  {
    label:
      "huge element mixed with tiny ones \u2014 huge must dominate without overflowing",
    n: 2,
    x: [3e19, 1e-20],
    incx: 1,
  },
  {
    label:
      "tiny magnitudes \u2014 must not lose all precision squaring into the denormal range",
    n: 3,
    x: [1e-20, 1e-20, 1e-20],
    incx: 1,
  },
];

export { edge_cases_default };
