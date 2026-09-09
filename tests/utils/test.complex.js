// Complex32Array <-> flat f32 buffer, and Complex64Array <-> double-double
// (hi, lo) f32 buffer pair. Pure JS, no GPU device needed — these are the
// pack/unpack helpers GpuMatrix's Complex32Array/Complex64Array dtype paths
// build on, not GPU calls themselves.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  interleaveComplex32,
  splitComplex64,
  mergeComplex64,
} from "../../src/util/complex.mjs";
import { Complex32Array } from "../../src/classes/Complex32.mjs";
import { Complex64, Complex64Array } from "../../src/classes/Complex64.mjs";

test("interleaveComplex32 packs [re, im, ...] in order", () => {
  const data = new Complex32Array([1, 2, 3, 4, 5, 6]); // 3 complex values
  const flat = interleaveComplex32(data);
  assert.ok(flat instanceof Float32Array);
  assert.deepEqual(Array.from(flat), [1, 2, 3, 4, 5, 6]);
});

test("interleaveComplex32 respects an explicit n shorter than data.length", () => {
  const data = new Complex32Array([1, 2, 3, 4, 5, 6]);
  const flat = interleaveComplex32(data, 2);
  assert.deepEqual(Array.from(flat), [1, 2, 3, 4]);
});

test("splitComplex64 + mergeComplex64 round-trip ordinary values exactly", () => {
  const data = new Complex64Array([
    new Complex64(1.5, -2.25),
    new Complex64(3.75, 4.125),
    new Complex64(-100.5, 0.0625),
  ]);
  const { hi, lo } = splitComplex64(data);
  assert.ok(hi instanceof Float32Array);
  assert.ok(lo instanceof Float32Array);
  assert.equal(hi.length, data.length * 2);
  assert.equal(lo.length, data.length * 2);

  const merged = mergeComplex64(hi, lo);
  assert.equal(merged.length, data.length);
  for (let i = 0; i < data.length; i++) {
    assert.equal(merged[i].re, data[i].re, `re[${i}]`);
    assert.equal(merged[i].im, data[i].im, `im[${i}]`);
  }
});

test("splitComplex64 + mergeComplex64 round-trip a value beyond f32 precision", () => {
  // Exercises the actual reason for the (hi, lo) split: a value an ordinary
  // f32 can't represent exactly must still survive the round trip to well
  // beyond f32 precision. Double-double via two f32 components can't be
  // bit-exact to an arbitrary f64 (see test.f64.js's own tolerance), so this
  // checks relative error rather than strict equality.
  const data = new Complex64Array([new Complex64(1 / 3, Math.PI)]);
  const { hi, lo } = splitComplex64(data);
  const merged = mergeComplex64(hi, lo);
  const relErr = (got, want) => Math.abs(got - want) / Math.abs(want);
  assert.ok(
    relErr(merged[0].re, data[0].re) < 2 ** -40,
    "re within double-double precision",
  );
  assert.ok(
    relErr(merged[0].im, data[0].im) < 2 ** -40,
    "im within double-double precision",
  );
});

test("splitComplex64 respects an explicit n shorter than data.length", () => {
  const data = new Complex64Array([new Complex64(1, 2), new Complex64(3, 4)]);
  const { hi, lo } = splitComplex64(data, 1);
  assert.equal(hi.length, 2);
  assert.equal(lo.length, 2);
  const merged = mergeComplex64(hi, lo);
  assert.equal(merged.length, 1);
  assert.equal(merged[0].re, 1);
  assert.equal(merged[0].im, 2);
});
