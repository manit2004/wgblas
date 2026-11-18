// src/util/finite.mjs
var nonFinite = (v) => !Number.isFinite(Math.fround(v));
function hasNonFinite(x, n, inc = 1) {
  for (let i = 0; i < n; i++) if (nonFinite(x[i * inc])) return true;
  return false;
}
function triangleHasNonFinite(A, order, ld, lower, unit) {
  const skip = unit ? 1 : 0;
  for (let r = 0; r < order; r++) {
    const start = r * ld + (lower ? 0 : r + skip);
    const end = r * ld + (lower ? r + 1 - skip : order);
    for (let i = start; i < end; i++) if (nonFinite(A[i])) return true;
  }
  return false;
}

export { hasNonFinite, triangleHasNonFinite };
