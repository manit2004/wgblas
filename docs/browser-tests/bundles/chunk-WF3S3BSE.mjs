// tests/dnrm2/helpers.js
var eps = 2 ** -48;
function forwardFactor(gpu, ref) {
  const err = Math.abs(gpu.nrm2 - ref);
  const bound = eps * Math.abs(ref);
  if (bound === 0) return err === 0 ? 0 : Infinity;
  return err / bound;
}

// tests/dnrm2/edge-cases.json
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
  {
    label: "genuine double precision, not f32-exact",
    n: 3,
    x: [3.14159265358979, 2.71828182845905, 1.41421356237309],
    incx: 1,
  },
];

export { forwardFactor, edge_cases_default };
