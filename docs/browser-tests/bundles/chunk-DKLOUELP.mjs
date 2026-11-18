// tests/idamax/edge-cases.json
var edge_cases_default = [
  {
    label: "ties \u2014 smallest index wins (CBLAS behaviour)",
    n: 4,
    x: [3, -3, 1, 2],
    incx: 1,
  },
  {
    label: "all same absolute value \u2014 index 0",
    n: 4,
    x: [5, -5, 5, -5],
    incx: 1,
  },
  {
    label: "negative values compared by absolute value",
    n: 3,
    x: [2, -5, 3],
    incx: 1,
  },
  {
    label: "all negative \u2014 largest absolute value wins",
    n: 3,
    x: [-1, -4, -2],
    incx: 1,
  },
  { label: "all zeros \u2014 returns index 0", n: 3, x: [0, 0, 0], incx: 1 },
  { label: "maximum at last position", n: 4, x: [1, 2, 3, 10], incx: 1 },
  { label: "n=1 always returns index 0", n: 1, x: [-7], incx: 1 },
  {
    label: "incx=2 \u2014 only considers strided elements",
    n: 3,
    x: [1, 99, 5, 99, 3],
    incx: 2,
  },
  {
    label: "incx=2 \u2014 tie on strided elements, smallest logical index wins",
    n: 3,
    x: [5, 99, 5, 99, 1],
    incx: 2,
  },
  {
    label: "tie in the middle \u2014 first occurrence wins",
    n: 5,
    x: [1, 5, 2, 5, 3],
    incx: 1,
  },
  {
    label: "incx=3 \u2014 stride correctness",
    n: 3,
    x: [1, 99, 99, 8, 99, 99, 3],
    incx: 3,
  },
  {
    label:
      "values that tie in single precision but not double \u2014 double-double needed",
    n: 2,
    x: [1, 1.0000000001],
    incx: 1,
  },
];

export { edge_cases_default };
