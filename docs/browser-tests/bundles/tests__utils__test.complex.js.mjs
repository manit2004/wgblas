import {
  Complex32Array,
  Complex64,
  Complex64Array,
  interleaveComplex32,
  mergeComplex64,
  splitComplex64,
} from "./chunk-3HAMCUKM.mjs";
import "./chunk-XFYS3TNK.mjs";
import { assert_default, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/utils/test.complex.js
test("interleaveComplex32 packs [re, im, ...] in order", () => {
  const data = new Complex32Array([1, 2, 3, 4, 5, 6]);
  const flat = interleaveComplex32(data);
  assert_default.ok(flat instanceof Float32Array);
  assert_default.deepEqual(Array.from(flat), [1, 2, 3, 4, 5, 6]);
});
test("interleaveComplex32 respects an explicit n shorter than data.length", () => {
  const data = new Complex32Array([1, 2, 3, 4, 5, 6]);
  const flat = interleaveComplex32(data, 2);
  assert_default.deepEqual(Array.from(flat), [1, 2, 3, 4]);
});
test("splitComplex64 + mergeComplex64 round-trip ordinary values exactly", () => {
  const data = new Complex64Array([
    new Complex64(1.5, -2.25),
    new Complex64(3.75, 4.125),
    new Complex64(-100.5, 0.0625),
  ]);
  const { hi, lo } = splitComplex64(data);
  assert_default.ok(hi instanceof Float32Array);
  assert_default.ok(lo instanceof Float32Array);
  assert_default.equal(hi.length, data.length * 2);
  assert_default.equal(lo.length, data.length * 2);
  const merged = mergeComplex64(hi, lo);
  assert_default.equal(merged.length, data.length);
  for (let i = 0; i < data.length; i++) {
    assert_default.equal(merged[i].re, data[i].re, `re[${i}]`);
    assert_default.equal(merged[i].im, data[i].im, `im[${i}]`);
  }
});
test("splitComplex64 + mergeComplex64 round-trip a value beyond f32 precision", () => {
  const data = new Complex64Array([new Complex64(1 / 3, Math.PI)]);
  const { hi, lo } = splitComplex64(data);
  const merged = mergeComplex64(hi, lo);
  const relErr = (got, want) => Math.abs(got - want) / Math.abs(want);
  assert_default.ok(
    relErr(merged[0].re, data[0].re) < 2 ** -40,
    "re within double-double precision",
  );
  assert_default.ok(
    relErr(merged[0].im, data[0].im) < 2 ** -40,
    "im within double-double precision",
  );
});
test("splitComplex64 respects an explicit n shorter than data.length", () => {
  const data = new Complex64Array([new Complex64(1, 2), new Complex64(3, 4)]);
  const { hi, lo } = splitComplex64(data, 1);
  assert_default.equal(hi.length, 2);
  assert_default.equal(lo.length, 2);
  const merged = mergeComplex64(hi, lo);
  assert_default.equal(merged.length, 1);
  assert_default.equal(merged[0].re, 1);
  assert_default.equal(merged[0].im, 2);
});
