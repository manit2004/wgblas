// tests/sasum/edge-cases.json
var edge_cases_default = [
  {
    label: "all negative \u2014 abs applied to each element",
    n: 4,
    x: [-3, -1, -4, -1],
    incx: 1,
  },
  {
    label: "mixed signs \u2014 abs sum not net sum",
    n: 3,
    x: [100, -100, 5],
    incx: 1,
  },
  { label: "all zeros \u2192 0", n: 3, x: [0, 0, 0], incx: 1 },
  { label: "n=1 negative element", n: 1, x: [-7], incx: 1 },
  {
    label: "incx=2 \u2014 only strided elements summed",
    n: 3,
    x: [1, 99, 2, 99, 3],
    incx: 2,
  },
];

export { edge_cases_default };
