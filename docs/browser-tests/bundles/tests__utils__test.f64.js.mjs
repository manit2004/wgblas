import {
  mergeDoubleDouble,
  mergeDoubleDoubleExact,
  splitDoubleDouble,
} from "./chunk-XFYS3TNK.mjs";
import { assert_default, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/utils/test.f64.js
test("hi is the f32 rounding and lo is the residual it dropped", () => {
  const x = new Float64Array([Math.PI, Math.E, 1 / 3]);
  const { hi, lo } = splitDoubleDouble(x);
  for (let i = 0; i < x.length; i++) {
    assert_default.equal(
      hi[i],
      Math.fround(x[i]),
      `hi[${i}] should be the f32 rounding`,
    );
    assert_default.equal(
      lo[i],
      Math.fround(x[i] - Math.fround(x[i])),
      `lo[${i}] should be the residual`,
    );
  }
});
test("a round trip is closer than a plain f32 cast", () => {
  const x = new Float64Array([Math.PI, Math.E, 1 / 3, 0.1, 1e-7, 123456.789]);
  const { hi, lo } = splitDoubleDouble(x);
  const merged = mergeDoubleDouble(hi, lo);
  const f32Only = Float64Array.from(new Float32Array(x));
  for (let i = 0; i < x.length; i++) {
    const ddErr = Math.abs(merged[i] - x[i]);
    const f32Err = Math.abs(f32Only[i] - x[i]);
    assert_default.ok(
      ddErr <= f32Err,
      `element ${i}: double-double error ${ddErr} should not exceed f32 error ${f32Err}`,
    );
    if (x[i] !== 0) {
      assert_default.ok(
        ddErr / Math.abs(x[i]) < 2 ** -40,
        `element ${i}: relative error ${ddErr / Math.abs(x[i])} should be well below f32 precision`,
      );
    }
  }
});
test("values exactly representable in f32 leave lo at zero", () => {
  const x = new Float64Array([0, 0.5, 2, -8, 1024]);
  const { hi, lo } = splitDoubleDouble(x);
  assert_default.deepEqual(
    Array.from(lo),
    [0, 0, 0, 0, 0],
    "no residual expected",
  );
  assert_default.deepEqual(
    Array.from(mergeDoubleDouble(hi, lo)),
    Array.from(x),
    "round trip must be exact",
  );
});
test("split preserves length and array types", () => {
  const { hi, lo } = splitDoubleDouble(new Float64Array(5));
  assert_default.ok(hi instanceof Float32Array, "hi should be a Float32Array");
  assert_default.ok(lo instanceof Float32Array, "lo should be a Float32Array");
  assert_default.equal(hi.length, 5);
  assert_default.equal(lo.length, 5);
  assert_default.ok(
    mergeDoubleDouble(hi, lo) instanceof Float64Array,
    "merge should return a Float64Array",
  );
});
test("empty input is handled", () => {
  const { hi, lo } = splitDoubleDouble(new Float64Array(0));
  assert_default.equal(hi.length, 0);
  assert_default.equal(mergeDoubleDouble(hi, lo).length, 0);
});
test("merge is a plain elementwise sum", () => {
  const hi = new Float32Array([1, 2, -3]);
  const lo = new Float32Array([0.5, -0.25, 0.125]);
  assert_default.deepEqual(
    Array.from(mergeDoubleDouble(hi, lo)),
    [1.5, 1.75, -2.875],
  );
});
test("negatives and very small magnitudes survive the round trip", () => {
  const x = new Float64Array([-Math.PI, -1e-30, 1e-30, -0.1]);
  const { hi, lo } = splitDoubleDouble(x);
  const merged = mergeDoubleDouble(hi, lo);
  for (let i = 0; i < x.length; i++) {
    assert_default.equal(
      Math.sign(merged[i]),
      Math.sign(x[i]),
      `element ${i} should keep its sign`,
    );
    assert_default.ok(
      Math.abs(merged[i] - x[i]) / Math.abs(x[i]) < 2 ** -40,
      `element ${i} should stay accurate`,
    );
  }
});
test("mergeDoubleDoubleExact restores values whose pair came back unchanged", () => {
  const before = new Float64Array([1 / 3, Math.PI, 2.5, -0, Infinity]);
  const { hi, lo } = splitDoubleDouble(before);
  assert_default.notEqual(mergeDoubleDouble(hi, lo)[0], before[0]);
  hi[2] = 7;
  lo[2] = 0;
  const out = mergeDoubleDoubleExact(hi, lo, before);
  assert_default.ok(Object.is(out[0], 1 / 3));
  assert_default.ok(Object.is(out[1], Math.PI));
  assert_default.equal(out[2], 7);
  assert_default.ok(Object.is(out[3], -0));
  assert_default.equal(out[4], Infinity);
});
test("mergeDoubleDoubleExact merges normally where the pair changed", () => {
  const before = new Float64Array([1 / 3]);
  const { hi, lo } = splitDoubleDouble(before);
  lo[0] = Math.fround(lo[0] * 2);
  const out = mergeDoubleDoubleExact(hi, lo, before);
  assert_default.equal(out[0], hi[0] + lo[0]);
  assert_default.notEqual(out[0], before[0]);
});
test("splitDoubleDouble keeps \xB1Infinity and NaN, with a zero lo", () => {
  const { hi, lo } = splitDoubleDouble(
    new Float64Array([Infinity, -Infinity, NaN]),
  );
  assert_default.deepEqual(Array.from(hi), [Infinity, -Infinity, NaN]);
  assert_default.deepEqual(Array.from(lo), [0, 0, 0]);
  assert_default.deepEqual(Array.from(mergeDoubleDouble(hi, lo)), [
    Infinity,
    -Infinity,
    NaN,
  ]);
});
test("mergeDoubleDoubleExact never restores values outside f32's range", () => {
  const before = new Float64Array([1e300, 1e-320, Infinity]);
  const { hi, lo } = splitDoubleDouble(before);
  const out = mergeDoubleDoubleExact(hi, lo, before);
  assert_default.equal(out[0], Infinity);
  assert_default.equal(out[1], 0);
  assert_default.equal(out[2], Infinity);
});
