// tests/sdot/helpers.js
var eps = 2 ** -23;
function forwardFactor(gpu, ref, a) {
  let sumAbsProd = 0;
  for (let i = 0; i < a.n; i++) {
    sumAbsProd += Math.abs(a.x[i * a.incx] * a.y[i * a.incy]);
  }
  const bound = a.n * eps * sumAbsProd;
  if (bound === 0) return gpu.dot === ref ? 0 : Infinity;
  return Math.abs(gpu.dot - ref) / bound;
}

// tests/sdot/edge-cases.json
var edge_cases_default = [
  {
    label: "orthogonal vectors \u2014 dot = 0",
    n: 2,
    x: [1, 0],
    incx: 1,
    y: [0, 1],
    incy: 1,
  },
  {
    label: "dot with itself \u2014 equals sum of squares",
    n: 2,
    x: [3, 4],
    incx: 1,
    y: [3, 4],
    incy: 1,
  },
  {
    label: "x all zeros \u2014 dot = 0 regardless of y",
    n: 3,
    x: [0, 0, 0],
    incx: 1,
    y: [1, 2, 3],
    incy: 1,
  },
  {
    label: "perfect cancellation \u2014 signed terms sum to zero",
    n: 2,
    x: [1, -1],
    incx: 1,
    y: [5, 5],
    incy: 1,
  },
  {
    label: "incx=2, incy=1 \u2014 independent strides",
    n: 2,
    x: [1, 99, 2],
    incx: 2,
    y: [3, 4],
    incy: 1,
  },
  {
    label: "n=1 \u2014 single multiply",
    n: 1,
    x: [3],
    incx: 1,
    y: [4],
    incy: 1,
  },
];

export { forwardFactor, edge_cases_default };
