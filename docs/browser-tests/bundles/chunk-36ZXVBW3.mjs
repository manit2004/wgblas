// tests/drotm/helpers.js
var eps = 2 ** -48;
function forwardFactor(gpu, ref, a) {
  const flag = a.param[0];
  let h11, h21, h12, h22;
  if (flag === -1) {
    h11 = a.param[1];
    h21 = a.param[2];
    h12 = a.param[3];
    h22 = a.param[4];
  } else if (flag === 0) {
    h11 = 1;
    h21 = a.param[2];
    h12 = a.param[3];
    h22 = 1;
  } else if (flag === 1) {
    h11 = a.param[1];
    h21 = -1;
    h12 = 1;
    h22 = a.param[4];
  } else if (flag === -2) {
    h11 = 1;
    h21 = 0;
    h12 = 0;
    h22 = 1;
  } else {
    throw new Error(`Unknown drotm flag: ${flag}`);
  }
  let maxFactor = 0;
  for (let i = 0; i < a.n; i++) {
    const xi = a.x[i * a.incx];
    const yi = a.y[i * a.incy];
    const xBound = eps * (Math.abs(h11 * xi) + Math.abs(h12 * yi));
    const yBound = eps * (Math.abs(h21 * xi) + Math.abs(h22 * yi));
    const xErr = Math.abs(gpu.x[i * a.incx] - ref.x[i * a.incx]);
    const yErr = Math.abs(gpu.y[i * a.incy] - ref.y[i * a.incy]);
    if (xBound > 0) maxFactor = Math.max(maxFactor, xErr / xBound);
    else if (xErr !== 0) maxFactor = Infinity;
    if (yBound > 0) maxFactor = Math.max(maxFactor, yErr / yBound);
    else if (yErr !== 0) maxFactor = Infinity;
  }
  return maxFactor;
}

// tests/drotm/edge-cases.json
var edge_cases_default = [
  {
    label: "flag=-2 \u2014 identity, both vectors unchanged",
    n: 3,
    x: [1, 2, 3],
    incx: 1,
    y: [4, 5, 6],
    incy: 1,
    param: [-2, 99, 99, 99, 99],
  },
  {
    label: "flag=-1 \u2014 full matrix, diagonal scaling",
    n: 2,
    x: [1, 2],
    incx: 1,
    y: [3, 4],
    incy: 1,
    param: [-1, 2, 0, 0, 3],
  },
  {
    label: "flag=0 \u2014 h11=h22=1 implied; x[i]+=y[i], y unchanged",
    n: 2,
    x: [1, 2],
    incx: 1,
    y: [3, 4],
    incy: 1,
    param: [0, 99, 0, 1, 99],
  },
  {
    label: "flag=1 \u2014 h12=1, h21=-1 implied; x[i]+=y[i], y[i]-=x_orig[i]",
    n: 2,
    x: [1, 2],
    incx: 1,
    y: [3, 4],
    incy: 1,
    param: [1, 1, 99, 99, 1],
  },
  {
    label: "flag=-1, incx=2 incy=1 \u2014 gap elements in x untouched",
    n: 2,
    x: [1, 99, 2],
    incx: 2,
    y: [3, 4],
    incy: 1,
    param: [-1, 2, 0, 0, 3],
  },
  {
    label: "genuine double precision, not f32-exact",
    n: 2,
    x: [3.14159265358979, 2.71828182845905],
    incx: 1,
    y: [1.41421356237309, 1.73205080756888],
    incy: 1,
    param: [-1, 1.23456789012345, 0.5, -0.5, 2.34567890123456],
  },
];

export { forwardFactor, edge_cases_default };
