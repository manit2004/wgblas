import { randomFloat64Array } from "./chunk-KEJR4IRF.mjs";
import { assert_default } from "./chunk-I62COF5X.mjs";

// tests/helpers/specials.js
function assertIeeeMatch(got, want, what, tol = 1e-12) {
  const g = typeof got === "number" ? [got] : got;
  const w = typeof want === "number" ? [want] : want;
  assert_default.equal(g.length, w.length, `${what}: length`);
  for (let i = 0; i < w.length; i++) {
    const label = `${what}[${i}]: got ${g[i]}, want ${w[i]}`;
    if (Number.isNaN(w[i])) assert_default.ok(Number.isNaN(g[i]), label);
    else if (!Number.isFinite(w[i])) assert_default.equal(g[i], w[i], label);
    else
      assert_default.ok(
        Number.isFinite(g[i]) &&
          Math.abs(g[i] - w[i]) <= tol * Math.max(1, Math.abs(w[i])),
        label,
      );
  }
}
function withValues(x, entries) {
  const out = x.slice();
  for (const [i, v] of Object.entries(entries)) out[Number(i)] = v;
  return out;
}
var at = (n, row, col) => row * n + col;
var values = (len, seed) => randomFloat64Array(len, -1, 1, seed);
var F32_MAX = 34028234663852886e22;
function inF32Range(v) {
  const one = (x) => {
    const f = Math.fround(x);
    return !Number.isFinite(f) || f === 0 ? f : x;
  };
  if (typeof v === "number") return one(v);
  if (v instanceof Float64Array) return v.map(one);
  return v;
}
var argsInF32Range = (a) =>
  Object.fromEntries(
    Object.entries(a).map(([k, v]) => [
      k,
      typeof v === "number" && Number.isInteger(v) ? v : inF32Range(v),
    ]),
  );
function saturate(v) {
  const one = (x) => (Math.abs(x) > F32_MAX ? Math.sign(x) * Infinity : x);
  return typeof v === "number" ? one(v) : v.map(one);
}

export { assertIeeeMatch, withValues, at, values, argsInF32Range, saturate };
