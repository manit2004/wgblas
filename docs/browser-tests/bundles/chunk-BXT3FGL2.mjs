// tests/sswap/edge-cases.json
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
    label: "n=1 \u2014 single element exchange",
    n: 1,
    x: [7],
    incx: 1,
    y: [8],
    incy: 1,
  },
];

export { edge_cases_default };
