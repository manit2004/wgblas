// Double-double split/merge. Pure CPU — no GPU needed.
//
// splitDoubleDouble stores a double as an (hi, lo) pair of f32s where hi is the
// f32 rounding of the value and lo is the residual hi threw away, giving ~48
// bits of mantissa instead of f32's 24. mergeDoubleDouble is its inverse. The
// property that matters is that a round trip beats a plain f32 cast — that is
// the entire reason dasum and the Float64Array paths of GpuVector/GpuMatrix
// carry a second buffer around.
import { test } from "node:test";
import assert from "node:assert/strict";
import { splitDoubleDouble, mergeDoubleDouble } from "../../src/util/f64.mjs";

test("hi is the f32 rounding and lo is the residual it dropped", () => {
  const x = new Float64Array([Math.PI, Math.E, 1 / 3]);
  const { hi, lo } = splitDoubleDouble(x);
  for (let i = 0; i < x.length; i++) {
    assert.equal(hi[i], Math.fround(x[i]), `hi[${i}] should be the f32 rounding`);
    assert.equal(lo[i], Math.fround(x[i] - Math.fround(x[i])), `lo[${i}] should be the residual`);
  }
});

test("a round trip is closer than a plain f32 cast", () => {
  // The whole point of carrying `lo`: without it these values lose ~24 bits.
  const x = new Float64Array([Math.PI, Math.E, 1 / 3, 0.1, 1e-7, 123456.789]);
  const { hi, lo } = splitDoubleDouble(x);
  const merged = mergeDoubleDouble(hi, lo);
  const f32Only = Float64Array.from(new Float32Array(x));

  for (let i = 0; i < x.length; i++) {
    const ddErr = Math.abs(merged[i] - x[i]);
    const f32Err = Math.abs(f32Only[i] - x[i]);
    assert.ok(
      ddErr <= f32Err,
      `element ${i}: double-double error ${ddErr} should not exceed f32 error ${f32Err}`,
    );
    // ~48 bits of mantissa, so the relative error must be far below f32's 2^-24.
    if (x[i] !== 0) {
      assert.ok(
        ddErr / Math.abs(x[i]) < 2 ** -40,
        `element ${i}: relative error ${ddErr / Math.abs(x[i])} should be well below f32 precision`,
      );
    }
  }
});

test("values exactly representable in f32 leave lo at zero", () => {
  // 0.5, 2, -8 and 0 are all exact f32s, so there is no residual to carry.
  const x = new Float64Array([0, 0.5, 2, -8, 1024]);
  const { hi, lo } = splitDoubleDouble(x);
  assert.deepEqual(Array.from(lo), [0, 0, 0, 0, 0], "no residual expected");
  assert.deepEqual(Array.from(mergeDoubleDouble(hi, lo)), Array.from(x), "round trip must be exact");
});

test("split preserves length and array types", () => {
  const { hi, lo } = splitDoubleDouble(new Float64Array(5));
  assert.ok(hi instanceof Float32Array, "hi should be a Float32Array");
  assert.ok(lo instanceof Float32Array, "lo should be a Float32Array");
  assert.equal(hi.length, 5);
  assert.equal(lo.length, 5);
  assert.ok(mergeDoubleDouble(hi, lo) instanceof Float64Array, "merge should return a Float64Array");
});

test("empty input is handled", () => {
  const { hi, lo } = splitDoubleDouble(new Float64Array(0));
  assert.equal(hi.length, 0);
  assert.equal(mergeDoubleDouble(hi, lo).length, 0);
});

test("merge is a plain elementwise sum", () => {
  const hi = new Float32Array([1, 2, -3]);
  const lo = new Float32Array([0.5, -0.25, 0.125]);
  assert.deepEqual(Array.from(mergeDoubleDouble(hi, lo)), [1.5, 1.75, -2.875]);
});

test("negatives and very small magnitudes survive the round trip", () => {
  const x = new Float64Array([-Math.PI, -1e-30, 1e-30, -0.1]);
  const { hi, lo } = splitDoubleDouble(x);
  const merged = mergeDoubleDouble(hi, lo);
  for (let i = 0; i < x.length; i++) {
    assert.equal(Math.sign(merged[i]), Math.sign(x[i]), `element ${i} should keep its sign`);
    assert.ok(Math.abs(merged[i] - x[i]) / Math.abs(x[i]) < 2 ** -40, `element ${i} should stay accurate`);
  }
});
