// Complex32/Complex64 value types and array-of-structs containers, plus
// GpuMatrix's non-Float32Array dtype paths (Float64Array, Complex32Array,
// Complex64Array) — none of these are exercised yet by any shipped routine
// (only single-precision real/complex matrix routines exist so far), so they
// need direct coverage rather than riding along with a routine's own tests.
//
// GpuVector's Float64Array and Complex32Array paths are exercised by
// ddot/dasum/dscal/daxpy's and cscal's gpustorage.*.js tests respectively —
// but those files aren't matched by package.json's `coverage` script (it
// only globs test.*.js), so those branches are invisible in the actual
// coverage report despite being genuinely tested. All of GpuVector.from's
// dtype paths get direct coverage here too, not just the ones with no
// routine coverage at all (Complex64Array, and the type-guard throw).
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { getPowerPreference } from "../helpers/device.js";
import { Complex32, Complex32Array } from "../../src/classes/Complex32.mjs";
import { Complex64, Complex64Array } from "../../src/classes/Complex64.mjs";
import { GpuMatrix } from "../../src/classes/GpuMatrix.mjs";
import { GpuVector } from "../../src/classes/GpuVector.mjs";
import { getDevice } from "../../src/init.mjs";

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

  test(`${name}([]) is also empty`, () => {
    // Distinct from the no-arg form above: arg is an empty *iterable* here,
    // not undefined, so this exercises the constructor's own early return
    // for items.length === 0 rather than its arg === undefined branch.
    assert.equal(new Arr([]).length, 0);
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

test("GpuMatrix round-trips a dense Float32Array", async () => {
  // Every matrix routine's own gpustorage.*.js test builds a plain
  // Float32Array GpuMatrix, but none of those files count toward the
  // `coverage` script (see the header comment), and no test.*.js file
  // actually calls .read() on one — test.device.js constructs one just to
  // check its .device, never reading it back — so read()'s dense (no lda
  // padding) return needs its own direct test too.
  const data = new Float32Array([1, 2, 3, 4]); // 2x2, row-major, dense
  const m = GpuMatrix.from(device, data, 2, 2);
  const back = await m.read();
  m.destroy();
  assert.ok(back instanceof Float32Array);
  assert.deepEqual(Array.from(back), [1, 2, 3, 4]);
});

test("GpuMatrix strips lda padding when reading back a Float32Array", async () => {
  // rows=2, cols=2, lda=3: row 0 = [a, b, pad], row 1 = [c, d, pad].
  const data = new Float32Array([1, 2, 0, 3, 4, 0]);
  const m = GpuMatrix.from(device, data, 2, 2, 3);
  const back = await m.read();
  m.destroy();
  assert.ok(back instanceof Float32Array);
  assert.equal(back.length, 4);
  assert.deepEqual(Array.from(back), [1, 2, 3, 4]);
});

test("GpuMatrix strips lda padding when reading back a column-major Float32Array", async () => {
  // Every other read() test here is row-major, which never touches read()'s
  // `isRowMajor ? this.rows : this.cols` (and cols/rows swapped) branch —
  // rows=2, cols=2, lda=3, column-major: col 0 = [a, b, pad], col 1 = [c, d, pad].
  const data = new Float32Array([1, 2, 0, 3, 4, 0]);
  const m = GpuMatrix.from(device, data, 2, 2, 3, "column-major");
  const back = await m.read();
  m.destroy();
  assert.ok(back instanceof Float32Array);
  assert.equal(back.length, 4);
  assert.deepEqual(Array.from(back), [1, 2, 3, 4]);
});

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

test("GpuMatrix.from rejects an lda smaller than cols (row-major)", () => {
  assert.throws(
    () => GpuMatrix.from(device, new Float32Array(4), 2, 2, 1),
    /lda must be an integer >= cols/,
  );
});

test("GpuMatrix.from rejects an lda smaller than rows (column-major)", () => {
  assert.throws(
    () => GpuMatrix.from(device, new Float32Array(4), 2, 2, 1, "column-major"),
    /lda must be an integer >= rows/,
  );
});

test("GpuMatrix.from rejects data too short for rows, cols, and lda", () => {
  // rows=2, cols=2, lda=3 needs 2*3=6 elements; this data has only 5.
  assert.throws(
    () => GpuMatrix.from(device, new Float32Array(5), 2, 2, 3),
    /data does not have enough elements/,
  );
});

test("GpuMatrix.from rejects an invalid layout", () => {
  assert.throws(
    () => GpuMatrix.from(device, new Float32Array(4), 2, 2, undefined, "bogus"),
    /layout must be 'row-major' or 'column-major'/,
  );
});

test("GpuMatrix.from rejects a non-positive-integer rows", () => {
  assert.throws(
    () => GpuMatrix.from(device, new Float32Array(4), 0, 2),
    /rows must be a positive integer/,
  );
});

test("GpuMatrix.from rejects a non-positive-integer cols", () => {
  assert.throws(
    () => GpuMatrix.from(device, new Float32Array(4), 2, 0),
    /cols must be a positive integer/,
  );
});

test("GpuMatrix.from defaults lda to rows for column-major", async () => {
  // No lda passed — the column-major default (`rows`) is never exercised
  // otherwise, since every other column-major test above passes lda
  // explicitly.
  const data = new Float32Array([1, 2, 3, 4]); // 2x2, column-major, dense
  const m = GpuMatrix.from(device, data, 2, 2, undefined, "column-major");
  assert.equal(m.lda, 2);
  const back = await m.read();
  m.destroy();
  assert.deepEqual(Array.from(back), [1, 2, 3, 4]);
});

test("new GpuMatrix() without an explicit device falls back to getDevice()", () => {
  // Same reasoning as GpuVector's own constructor-fallback test below —
  // from() always resolves and passes a device explicitly, so direct
  // construction is the only way to reach this branch.
  const m = new GpuMatrix({ destroy() {} }, 1, 1, 1);
  assert.equal(
    m.device,
    getDevice(),
    "expected the primary device from init()",
  );
});

test("GpuMatrix.from(data, ...) without an explicit device falls back to getDevice()", () => {
  const m = GpuMatrix.from(new Float32Array([1, 2, 3, 4]), 2, 2);
  assert.equal(
    m.device,
    getDevice(),
    "expected the primary device from init()",
  );
  m.destroy();
});

// ── GpuVector's own dtype paths + type guard ────────────────────────────────
// (Float64Array/Complex32Array are also exercised via routines' own
// gpustorage.*.js tests, but those don't count toward the `coverage` script's
// report — see the header comment.)

test("new GpuVector() without an explicit device falls back to getDevice()", () => {
  // The constructor's own fallback — from() always resolves a device and
  // passes it explicitly, so direct construction (still public API, just
  // unused internally) is the only way to reach this branch. No real GPU
  // buffer needed: the constructor just stores whatever it's given.
  const v = new GpuVector({ destroy() {} }, 0, Float32Array);
  assert.equal(
    v.device,
    getDevice(),
    "expected the primary device from init()",
  );
});

test("GpuVector.from(data) without an explicit device falls back to getDevice()", async () => {
  // The single-arg calling convention — every other test in this file uses
  // the explicit GpuVector.from(device, data) form, which never touches
  // `explicit`'s false branch in from() or the `?? getDevice()` fallback in
  // the constructor.
  const data = new Float32Array([1, 2, 3]);
  const v = GpuVector.from(data);
  assert.equal(
    v.device,
    getDevice(),
    "expected the primary device from init()",
  );
  v.destroy();
});

test("GpuVector round-trips a Float32Array", async () => {
  const data = new Float32Array([1, 2, 3, 4]);
  const v = GpuVector.from(device, data);
  assert.equal(v.dtype, Float32Array);
  const back = await v.read();
  v.destroy();
  assert.ok(back instanceof Float32Array);
  assert.deepEqual(Array.from(back), [1, 2, 3, 4]);
});

test("GpuVector round-trips a Float64Array", async () => {
  const data = new Float64Array([1 / 3, -2.5, Math.PI]);
  const v = GpuVector.from(device, data);
  assert.equal(v.dtype, Float64Array);
  const back = await v.read();
  v.destroy();
  assert.ok(back instanceof Float64Array);
  assert.equal(back.length, 3);
  const relErr = (got, want) => Math.abs(got - want) / Math.abs(want);
  for (let i = 0; i < data.length; i++) {
    assert.ok(relErr(back[i], data[i]) < 2 ** -40);
  }
});

test("GpuVector round-trips a Complex32Array", async () => {
  const data = new Complex32Array([1, 2, 3, 4]);
  const v = GpuVector.from(device, data);
  assert.equal(v.dtype, Complex32Array);
  const back = await v.read();
  v.destroy();
  assert.ok(back instanceof Complex32Array);
  assert.equal(back.length, 2);
  assert.equal(back[0].re, 1);
  assert.equal(back[0].im, 2);
  assert.equal(back[1].re, 3);
  assert.equal(back[1].im, 4);
});

test("GpuVector round-trips a Complex64Array", async () => {
  const data = new Complex64Array([
    new Complex64(1 / 3, Math.PI),
    new Complex64(-2.5, 100.125),
  ]);
  const v = GpuVector.from(device, data);
  assert.equal(v.dtype, Complex64Array);
  const back = await v.read();
  v.destroy();
  assert.ok(back instanceof Complex64Array);
  assert.equal(back.length, 2);
  const relErr = (got, want) => Math.abs(got - want) / Math.abs(want);
  assert.ok(relErr(back[0].re, data[0].re) < 2 ** -40);
  assert.ok(relErr(back[0].im, data[0].im) < 2 ** -40);
  assert.equal(back[1].re, data[1].re);
  assert.equal(back[1].im, data[1].im);
});

test("GpuVector.from rejects an unsupported data type", () => {
  assert.throws(
    () => GpuVector.from(device, [1, 2, 3, 4]),
    /Float32Array, Float64Array, Complex32Array, or Complex64Array/,
  );
});
