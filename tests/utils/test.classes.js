// Complex32/Complex64 value types and array-of-structs containers, plus
// GpuMatrix's non-Float32Array dtype paths (Float64Array, Complex32Array,
// Complex64Array) — none of these are exercised yet by any shipped routine
// (only single-precision real/complex matrix routines exist so far), so they
// need direct coverage rather than riding along with a routine's own tests.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { getPowerPreference } from "../helpers/device.js";
import { Complex32, Complex32Array } from "../../src/classes/Complex32.mjs";
import { Complex64, Complex64Array } from "../../src/classes/Complex64.mjs";
import { GpuMatrix } from "../../src/classes/GpuMatrix.mjs";

let device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => cleanup());

// ── Complex32 / Complex64 value types ───────────────────────────────────────

test("Complex32 rounds its components to f32 precision", () => {
  const z = new Complex32(1 / 3, Math.PI);
  assert.equal(z.re, Math.fround(1 / 3));
  assert.equal(z.im, Math.fround(Math.PI));
});

test("Complex64 keeps full f64 precision, no rounding", () => {
  const z = new Complex64(1 / 3, Math.PI);
  assert.equal(z.re, 1 / 3);
  assert.equal(z.im, Math.PI);
});

for (const [Value, Arr, name] of [
  [Complex32, Complex32Array, "Complex32Array"],
  [Complex64, Complex64Array, "Complex64Array"],
]) {
  test(`${name}() is empty`, () => {
    assert.equal(new Arr().length, 0);
  });

  test(`${name}(length) fills with zero-valued instances`, () => {
    const a = new Arr(3);
    assert.equal(a.length, 3);
    for (const z of a) {
      assert.ok(z instanceof Value);
      assert.equal(z.re, 0);
      assert.equal(z.im, 0);
    }
  });

  test(`${name}([...interleaved numbers]) pairs them up`, () => {
    const a = new Arr([1, 2, 3, 4]);
    assert.equal(a.length, 2);
    assert.equal(a[0].re, 1);
    assert.equal(a[0].im, 2);
    assert.equal(a[1].re, 3);
    assert.equal(a[1].im, 4);
  });

  test(`${name}([...instances]) copies existing values`, () => {
    const src = [new Value(1, 2), new Value(3, 4)];
    const a = new Arr(src);
    assert.equal(a.length, 2);
    assert.equal(a[0].re, 1);
    assert.equal(a[1].im, 4);
  });

  test(`${name} rejects an odd number of interleaved values`, () => {
    assert.throws(() => new Arr([1, 2, 3]), /even number of interleaved/);
  });

  test(`${name} rejects non-number interleaved values`, () => {
    assert.throws(() => new Arr([1, "not a number"]), /to be numbers/);
  });

  test(`${name} rejects a mixed list of instances and non-instances`, () => {
    assert.throws(
      () => new Arr([new Value(1, 2), "not a complex value"]),
      /every element to be a/,
    );
  });
}

// ── GpuMatrix dtype round trips ──────────────────────────────────────────────

test("GpuMatrix round-trips a Float64Array through the double-double GPU path", async () => {
  const data = new Float64Array([1 / 3, Math.PI, -2.5, 100.125]); // 2x2, row-major
  const m = GpuMatrix.from(device, data, 2, 2);
  assert.equal(m.dtype, Float64Array);
  const back = await m.read();
  m.destroy();
  assert.ok(back instanceof Float64Array);
  for (let i = 0; i < data.length; i++) {
    const relErr = Math.abs(back[i] - data[i]) / Math.abs(data[i]);
    assert.ok(relErr < 2 ** -40, `element ${i}: relative error ${relErr}`);
  }
});

test("GpuMatrix strips lda padding when reading back a Float64Array", async () => {
  // rows=2, cols=2, lda=3: row 0 = [a, b, pad], row 1 = [c, d, pad].
  const data = new Float64Array([1, 2, 0, 3, 4, 0]);
  const m = GpuMatrix.from(device, data, 2, 2, 3);
  const back = await m.read();
  m.destroy();
  assert.equal(back.length, 4);
  assert.deepEqual(Array.from(back), [1, 2, 3, 4]);
});

test("GpuMatrix round-trips a Complex32Array", async () => {
  const data = new Complex32Array([1, 2, 3, 4]); // 2x1, row-major
  const m = GpuMatrix.from(device, data, 2, 1);
  assert.equal(m.dtype, Complex32Array);
  const back = await m.read();
  m.destroy();
  assert.ok(back instanceof Complex32Array);
  assert.equal(back.length, 2);
  assert.equal(back[0].re, 1);
  assert.equal(back[0].im, 2);
  assert.equal(back[1].re, 3);
  assert.equal(back[1].im, 4);
});

test("GpuMatrix strips lda padding when reading back a Complex32Array", async () => {
  // rows=2, cols=1, lda=2: row 0 = [z0, pad], row 1 = [z1, pad].
  const data = new Complex32Array([1, 2, 0, 0, 3, 4, 0, 0]);
  const m = GpuMatrix.from(device, data, 2, 1, 2);
  const back = await m.read();
  m.destroy();
  assert.equal(back.length, 2);
  assert.equal(back[0].re, 1);
  assert.equal(back[0].im, 2);
  assert.equal(back[1].re, 3);
  assert.equal(back[1].im, 4);
});

test("GpuMatrix round-trips a Complex64Array", async () => {
  const data = new Complex64Array([
    new Complex64(1 / 3, Math.PI),
    new Complex64(-2.5, 100.125),
  ]); // 2x1, row-major
  const m = GpuMatrix.from(device, data, 2, 1);
  assert.equal(m.dtype, Complex64Array);
  const back = await m.read();
  m.destroy();
  assert.ok(back instanceof Complex64Array);
  assert.equal(back.length, 2);
  const relErr = (got, want) => Math.abs(got - want) / Math.abs(want);
  assert.ok(relErr(back[0].re, data[0].re) < 2 ** -40);
  assert.ok(relErr(back[0].im, data[0].im) < 2 ** -40);
  assert.equal(back[1].re, data[1].re);
  assert.equal(back[1].im, data[1].im);
});

test("GpuMatrix strips lda padding when reading back a Complex64Array", async () => {
  // rows=2, cols=1, lda=2: row 0 = [z0, pad], row 1 = [z1, pad].
  const data = new Complex64Array([
    new Complex64(1, 2),
    new Complex64(0, 0),
    new Complex64(3, 4),
    new Complex64(0, 0),
  ]);
  const m = GpuMatrix.from(device, data, 2, 1, 2);
  const back = await m.read();
  m.destroy();
  assert.equal(back.length, 2);
  assert.equal(back[0].re, 1);
  assert.equal(back[0].im, 2);
  assert.equal(back[1].re, 3);
  assert.equal(back[1].im, 4);
});

test("GpuMatrix.from rejects an unsupported data type", () => {
  assert.throws(
    () => GpuMatrix.from(device, [1, 2, 3, 4], 2, 2),
    /Float32Array, Float64Array, Complex32Array, or Complex64Array/,
  );
});
