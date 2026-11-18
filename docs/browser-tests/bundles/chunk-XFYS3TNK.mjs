// src/util/f64.mjs
var loOf = (v, h) => (Number.isFinite(h) ? Math.fround(v - h) : 0);
var representable = (v, h, l) =>
  Number.isFinite(v)
    ? Math.abs(h + l - v) <= Math.abs(v) * 2 ** -40
    : Object.is(h, v);
function splitDoubleDouble(x) {
  const n = x.length;
  const hi = new Float32Array(n);
  const lo = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const h = Math.fround(x[i]);
    hi[i] = h;
    lo[i] = loOf(x[i], h);
  }
  return { hi, lo };
}
function mergeDoubleDouble(hi, lo) {
  const n = hi.length;
  const out = new Float64Array(n);
  for (let i = 0; i < n; i++) out[i] = hi[i] + lo[i];
  return out;
}
function mergeDoubleDoubleExact(hi, lo, before) {
  const out = mergeDoubleDouble(hi, lo);
  const n = Math.min(out.length, before.length);
  for (let i = 0; i < n; i++) {
    const v = before[i];
    const h = Math.fround(v);
    const l = loOf(v, h);
    if (Object.is(hi[i], h) && Object.is(lo[i], l) && representable(v, h, l))
      out[i] = v;
  }
  return out;
}

export { splitDoubleDouble, mergeDoubleDouble, mergeDoubleDoubleExact };
