// src/random/random.mjs
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 1831565813) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function randomFloat32Array(n, low = -1, high = 1, seed) {
  const x = new Float32Array(n);
  const next = seed === void 0 ? Math.random : mulberry32(seed);
  for (let i = 0; i < n; i++) x[i] = low + next() * (high - low);
  return x;
}
function randomFloat64Array(n, low = -1, high = 1, seed) {
  const x = new Float64Array(n);
  const next = seed === void 0 ? Math.random : mulberry32(seed);
  for (let i = 0; i < n; i++) x[i] = low + next() * (high - low);
  return x;
}
function randomTriangularFloat32Array(
  n,
  lda,
  uplo = "lower",
  low = -1,
  high = 1,
  diagLow = 5,
  diagHigh = 15,
  layout = "row-major",
) {
  if (uplo !== "lower" && uplo !== "upper")
    throw new Error("uplo must be 'lower' or 'upper'.");
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (lda < n) throw new Error("lda must be >= n.");
  const isColMajor = layout === "column-major";
  const idx = (i, j) => (isColMajor ? j * lda + i : i * lda + j);
  const A = new Float32Array(n * lda);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const inTriangle = uplo === "lower" ? j < i : j > i;
      if (inTriangle) A[idx(i, j)] = low + Math.random() * (high - low);
    }
    A[idx(i, i)] = diagLow + Math.random() * (diagHigh - diagLow);
  }
  return A;
}

export { randomFloat32Array, randomFloat64Array, randomTriangularFloat32Array };
