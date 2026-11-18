import {
  GpuMatrix,
  GpuVector,
  cleanup,
  getDevice,
  init,
} from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import {
  Complex32,
  Complex32Array,
  Complex64,
  Complex64Array,
} from "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/utils/test.classes.js
var device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => cleanup());
test("Complex32 rounds its components to f32 precision", () => {
  const z = new Complex32(1 / 3, Math.PI);
  assert_default.equal(z.re, Math.fround(1 / 3));
  assert_default.equal(z.im, Math.fround(Math.PI));
});
test("Complex64 keeps full f64 precision, no rounding", () => {
  const z = new Complex64(1 / 3, Math.PI);
  assert_default.equal(z.re, 1 / 3);
  assert_default.equal(z.im, Math.PI);
});
for (const [Value, Arr, name] of [
  [Complex32, Complex32Array, "Complex32Array"],
  [Complex64, Complex64Array, "Complex64Array"],
]) {
  test(`${name}() is empty`, () => {
    assert_default.equal(new Arr().length, 0);
  });
  test(`${name}([]) is also empty`, () => {
    assert_default.equal(new Arr([]).length, 0);
  });
  test(`${name}(length) fills with zero-valued instances`, () => {
    const a = new Arr(3);
    assert_default.equal(a.length, 3);
    for (const z of a) {
      assert_default.ok(z instanceof Value);
      assert_default.equal(z.re, 0);
      assert_default.equal(z.im, 0);
    }
  });
  test(`${name}([...interleaved numbers]) pairs them up`, () => {
    const a = new Arr([1, 2, 3, 4]);
    assert_default.equal(a.length, 2);
    assert_default.equal(a[0].re, 1);
    assert_default.equal(a[0].im, 2);
    assert_default.equal(a[1].re, 3);
    assert_default.equal(a[1].im, 4);
  });
  test(`${name}([...instances]) copies existing values`, () => {
    const src = [new Value(1, 2), new Value(3, 4)];
    const a = new Arr(src);
    assert_default.equal(a.length, 2);
    assert_default.equal(a[0].re, 1);
    assert_default.equal(a[1].im, 4);
  });
  test(`${name} rejects an odd number of interleaved values`, () => {
    assert_default.throws(
      () => new Arr([1, 2, 3]),
      /even number of interleaved/,
    );
  });
  test(`${name} rejects non-number interleaved values`, () => {
    assert_default.throws(() => new Arr([1, "not a number"]), /to be numbers/);
  });
  test(`${name} rejects a mixed list of instances and non-instances`, () => {
    assert_default.throws(
      () => new Arr([new Value(1, 2), "not a complex value"]),
      /every element to be a/,
    );
  });
}
test("GpuMatrix round-trips a dense Float32Array", async () => {
  const data = new Float32Array([1, 2, 3, 4]);
  const m = GpuMatrix.from(device, data, 2, 2);
  const back = await m.read();
  m.destroy();
  assert_default.ok(back instanceof Float32Array);
  assert_default.deepEqual(Array.from(back), [1, 2, 3, 4]);
});
test("GpuMatrix strips lda padding when reading back a Float32Array", async () => {
  const data = new Float32Array([1, 2, 0, 3, 4, 0]);
  const m = GpuMatrix.from(device, data, 2, 2, 3);
  const back = await m.read();
  m.destroy();
  assert_default.ok(back instanceof Float32Array);
  assert_default.equal(back.length, 4);
  assert_default.deepEqual(Array.from(back), [1, 2, 3, 4]);
});
test("GpuMatrix strips lda padding when reading back a column-major Float32Array", async () => {
  const data = new Float32Array([1, 2, 0, 3, 4, 0]);
  const m = GpuMatrix.from(device, data, 2, 2, 3, "column-major");
  const back = await m.read();
  m.destroy();
  assert_default.ok(back instanceof Float32Array);
  assert_default.equal(back.length, 4);
  assert_default.deepEqual(Array.from(back), [1, 2, 3, 4]);
});
test("GpuMatrix round-trips a Float64Array through the double-double GPU path", async () => {
  const data = new Float64Array([1 / 3, Math.PI, -2.5, 100.125]);
  const m = GpuMatrix.from(device, data, 2, 2);
  assert_default.equal(m.dtype, Float64Array);
  const back = await m.read();
  m.destroy();
  assert_default.ok(back instanceof Float64Array);
  for (let i = 0; i < data.length; i++) {
    const relErr = Math.abs(back[i] - data[i]) / Math.abs(data[i]);
    assert_default.ok(
      relErr < 2 ** -40,
      `element ${i}: relative error ${relErr}`,
    );
  }
});
test("GpuMatrix strips lda padding when reading back a Float64Array", async () => {
  const data = new Float64Array([1, 2, 0, 3, 4, 0]);
  const m = GpuMatrix.from(device, data, 2, 2, 3);
  const back = await m.read();
  m.destroy();
  assert_default.equal(back.length, 4);
  assert_default.deepEqual(Array.from(back), [1, 2, 3, 4]);
});
test("GpuMatrix round-trips a Complex32Array", async () => {
  const data = new Complex32Array([1, 2, 3, 4]);
  const m = GpuMatrix.from(device, data, 2, 1);
  assert_default.equal(m.dtype, Complex32Array);
  const back = await m.read();
  m.destroy();
  assert_default.ok(back instanceof Complex32Array);
  assert_default.equal(back.length, 2);
  assert_default.equal(back[0].re, 1);
  assert_default.equal(back[0].im, 2);
  assert_default.equal(back[1].re, 3);
  assert_default.equal(back[1].im, 4);
});
test("GpuMatrix strips lda padding when reading back a Complex32Array", async () => {
  const data = new Complex32Array([1, 2, 0, 0, 3, 4, 0, 0]);
  const m = GpuMatrix.from(device, data, 2, 1, 2);
  const back = await m.read();
  m.destroy();
  assert_default.equal(back.length, 2);
  assert_default.equal(back[0].re, 1);
  assert_default.equal(back[0].im, 2);
  assert_default.equal(back[1].re, 3);
  assert_default.equal(back[1].im, 4);
});
test("GpuMatrix round-trips a Complex64Array", async () => {
  const data = new Complex64Array([
    new Complex64(1 / 3, Math.PI),
    new Complex64(-2.5, 100.125),
  ]);
  const m = GpuMatrix.from(device, data, 2, 1);
  assert_default.equal(m.dtype, Complex64Array);
  const back = await m.read();
  m.destroy();
  assert_default.ok(back instanceof Complex64Array);
  assert_default.equal(back.length, 2);
  const relErr = (got, want) => Math.abs(got - want) / Math.abs(want);
  assert_default.ok(relErr(back[0].re, data[0].re) < 2 ** -40);
  assert_default.ok(relErr(back[0].im, data[0].im) < 2 ** -40);
  assert_default.equal(back[1].re, data[1].re);
  assert_default.equal(back[1].im, data[1].im);
});
test("GpuMatrix strips lda padding when reading back a Complex64Array", async () => {
  const data = new Complex64Array([
    new Complex64(1, 2),
    new Complex64(0, 0),
    new Complex64(3, 4),
    new Complex64(0, 0),
  ]);
  const m = GpuMatrix.from(device, data, 2, 1, 2);
  const back = await m.read();
  m.destroy();
  assert_default.equal(back.length, 2);
  assert_default.equal(back[0].re, 1);
  assert_default.equal(back[0].im, 2);
  assert_default.equal(back[1].re, 3);
  assert_default.equal(back[1].im, 4);
});
test("GpuMatrix.from rejects an unsupported data type", () => {
  assert_default.throws(
    () => GpuMatrix.from(device, [1, 2, 3, 4], 2, 2),
    /Float32Array, Float64Array, Complex32Array, or Complex64Array/,
  );
});
test("GpuMatrix.from rejects an lda smaller than cols (row-major)", () => {
  assert_default.throws(
    () => GpuMatrix.from(device, new Float32Array(4), 2, 2, 1),
    /lda must be an integer >= cols/,
  );
});
test("GpuMatrix.from rejects an lda smaller than rows (column-major)", () => {
  assert_default.throws(
    () => GpuMatrix.from(device, new Float32Array(4), 2, 2, 1, "column-major"),
    /lda must be an integer >= rows/,
  );
});
test("GpuMatrix.from rejects data too short for rows, cols, and lda", () => {
  assert_default.throws(
    () => GpuMatrix.from(device, new Float32Array(5), 2, 2, 3),
    /data does not have enough elements/,
  );
});
test("GpuMatrix.from rejects an invalid layout", () => {
  assert_default.throws(
    () => GpuMatrix.from(device, new Float32Array(4), 2, 2, void 0, "bogus"),
    /layout must be 'row-major' or 'column-major'/,
  );
});
test("GpuMatrix.from rejects a non-positive-integer rows", () => {
  assert_default.throws(
    () => GpuMatrix.from(device, new Float32Array(4), 0, 2),
    /rows must be a positive integer/,
  );
});
test("GpuMatrix.from rejects a non-positive-integer cols", () => {
  assert_default.throws(
    () => GpuMatrix.from(device, new Float32Array(4), 2, 0),
    /cols must be a positive integer/,
  );
});
test("GpuMatrix.from defaults lda to rows for column-major", async () => {
  const data = new Float32Array([1, 2, 3, 4]);
  const m = GpuMatrix.from(device, data, 2, 2, void 0, "column-major");
  assert_default.equal(m.lda, 2);
  const back = await m.read();
  m.destroy();
  assert_default.deepEqual(Array.from(back), [1, 2, 3, 4]);
});
test("new GpuMatrix() without an explicit device falls back to getDevice()", () => {
  const m = new GpuMatrix({ destroy() {} }, 1, 1, 1);
  assert_default.equal(
    m.device,
    getDevice(),
    "expected the primary device from init()",
  );
});
test("GpuMatrix.from(data, ...) without an explicit device falls back to getDevice()", () => {
  const m = GpuMatrix.from(new Float32Array([1, 2, 3, 4]), 2, 2);
  assert_default.equal(
    m.device,
    getDevice(),
    "expected the primary device from init()",
  );
  m.destroy();
});
test("new GpuVector() without an explicit device falls back to getDevice()", () => {
  const v = new GpuVector({ destroy() {} }, 0, Float32Array);
  assert_default.equal(
    v.device,
    getDevice(),
    "expected the primary device from init()",
  );
});
test("GpuVector.from(data) without an explicit device falls back to getDevice()", async () => {
  const data = new Float32Array([1, 2, 3]);
  const v = GpuVector.from(data);
  assert_default.equal(
    v.device,
    getDevice(),
    "expected the primary device from init()",
  );
  v.destroy();
});
test("GpuVector round-trips a Float32Array", async () => {
  const data = new Float32Array([1, 2, 3, 4]);
  const v = GpuVector.from(device, data);
  assert_default.equal(v.dtype, Float32Array);
  const back = await v.read();
  v.destroy();
  assert_default.ok(back instanceof Float32Array);
  assert_default.deepEqual(Array.from(back), [1, 2, 3, 4]);
});
test("GpuVector round-trips a Float64Array", async () => {
  const data = new Float64Array([1 / 3, -2.5, Math.PI]);
  const v = GpuVector.from(device, data);
  assert_default.equal(v.dtype, Float64Array);
  const back = await v.read();
  v.destroy();
  assert_default.ok(back instanceof Float64Array);
  assert_default.equal(back.length, 3);
  const relErr = (got, want) => Math.abs(got - want) / Math.abs(want);
  for (let i = 0; i < data.length; i++) {
    assert_default.ok(relErr(back[i], data[i]) < 2 ** -40);
  }
});
test("GpuVector round-trips a Complex32Array", async () => {
  const data = new Complex32Array([1, 2, 3, 4]);
  const v = GpuVector.from(device, data);
  assert_default.equal(v.dtype, Complex32Array);
  const back = await v.read();
  v.destroy();
  assert_default.ok(back instanceof Complex32Array);
  assert_default.equal(back.length, 2);
  assert_default.equal(back[0].re, 1);
  assert_default.equal(back[0].im, 2);
  assert_default.equal(back[1].re, 3);
  assert_default.equal(back[1].im, 4);
});
test("GpuVector round-trips a Complex64Array", async () => {
  const data = new Complex64Array([
    new Complex64(1 / 3, Math.PI),
    new Complex64(-2.5, 100.125),
  ]);
  const v = GpuVector.from(device, data);
  assert_default.equal(v.dtype, Complex64Array);
  const back = await v.read();
  v.destroy();
  assert_default.ok(back instanceof Complex64Array);
  assert_default.equal(back.length, 2);
  const relErr = (got, want) => Math.abs(got - want) / Math.abs(want);
  assert_default.ok(relErr(back[0].re, data[0].re) < 2 ** -40);
  assert_default.ok(relErr(back[0].im, data[0].im) < 2 ** -40);
  assert_default.equal(back[1].re, data[1].re);
  assert_default.equal(back[1].im, data[1].im);
});
test("GpuVector.from rejects an unsupported data type", () => {
  assert_default.throws(
    () => GpuVector.from(device, [1, 2, 3, 4]),
    /Float32Array, Float64Array, Complex32Array, or Complex64Array/,
  );
});
