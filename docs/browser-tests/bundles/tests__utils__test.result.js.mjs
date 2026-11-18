import {
  cleanup,
  clearReadbackPool,
  extractResult,
  init,
  stageReadback,
  uploadBuffer,
} from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/utils/test.result.js
var device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => cleanup());
async function roundTrip(data, readbackType) {
  const src = uploadBuffer(device, data, "result-test-src", true);
  const enc = device.createCommandEncoder();
  const readBuffer = stageReadback(device, enc, src);
  device.queue.submit([enc.finish()]);
  const out = await extractResult(readBuffer, readbackType);
  src.destroy();
  return out;
}
test("reads back exactly what was uploaded", async () => {
  const data = new Float32Array([1, -2.5, 3.25, 0, 1e-7]);
  assert_default.deepEqual(await roundTrip(data), data);
});
test("defaults to Float32Array", async () => {
  const out = await roundTrip(new Float32Array([1, 2, 3]));
  assert_default.ok(
    out instanceof Float32Array,
    "expected a Float32Array by default",
  );
});
test("honours the requested typed-array type, preserving raw bits", async () => {
  const bits = new Uint32Array([2143289345, 3735928559, 0, 4294967295]);
  const out = await roundTrip(bits, Uint32Array);
  assert_default.ok(out instanceof Uint32Array, "expected a Uint32Array");
  assert_default.deepEqual(
    Array.from(out),
    Array.from(bits),
    "bit patterns must survive unchanged",
  );
});
test("the returned array survives the unmap", async () => {
  const out = await roundTrip(new Float32Array([7, 8, 9]));
  assert_default.equal(
    out.buffer.byteLength,
    12,
    "result should own its memory, not view mapped GPU memory",
  );
  assert_default.deepEqual(
    Array.from(out),
    [7, 8, 9],
    "values should still be readable after unmap",
  );
});
function stage(src) {
  const enc = device.createCommandEncoder();
  const readBuffer = stageReadback(device, enc, src);
  device.queue.submit([enc.finish()]);
  return readBuffer;
}
test("returns the readback buffer to the pool, and reuses it with fresh data", async () => {
  clearReadbackPool(device);
  const a = uploadBuffer(device, new Float32Array([1, 2, 3]), "a", true);
  const b = uploadBuffer(device, new Float32Array([7, 8, 9]), "b", true);
  const first = stage(a);
  assert_default.deepEqual(
    await extractResult(first),
    new Float32Array([1, 2, 3]),
  );
  const second = stage(b);
  assert_default.strictEqual(
    second,
    first,
    "same-size readback should reuse the pooled buffer",
  );
  assert_default.deepEqual(
    await extractResult(second),
    new Float32Array([7, 8, 9]),
  );
  a.destroy();
  b.destroy();
});
test("only reuses an exact size", async () => {
  clearReadbackPool(device);
  const a = uploadBuffer(device, new Float32Array(4), "a", true);
  const b = uploadBuffer(device, new Float32Array(8), "b", true);
  const first = stage(a);
  await extractResult(first);
  const other = stage(b);
  assert_default.notStrictEqual(
    other,
    first,
    "a different size must not reuse the buffer",
  );
  await extractResult(other);
  a.destroy();
  b.destroy();
});
test("keeps at most 4 buffers per size; the rest are destroyed", async () => {
  clearReadbackPool(device);
  const src = uploadBuffer(device, new Float32Array(16), "src", true);
  const six = Array.from({ length: 6 }, () => stage(src));
  await Promise.all(six.map((rb) => extractResult(rb)));
  const next = Array.from({ length: 6 }, () => stage(src));
  const reused = next.filter((rb) => six.includes(rb)).length;
  assert_default.equal(reused, 4, "four pooled buffers should be reused");
  await Promise.all(next.map((rb) => extractResult(rb)));
  src.destroy();
});
test("doesn't pool readbacks larger than 4 MB", async () => {
  clearReadbackPool(device);
  const src = uploadBuffer(
    device,
    new Float32Array(1024 * 1024 + 4),
    "big",
    true,
  );
  const rb = stage(src);
  await extractResult(rb);
  await assert_default.rejects(() => rb.mapAsync(GPUMapMode.READ));
  src.destroy();
});
test("clearReadbackPool destroys pooled buffers", async () => {
  clearReadbackPool(device);
  const src = uploadBuffer(device, new Float32Array([1, 2]), "src", true);
  const rb = stage(src);
  await extractResult(rb);
  clearReadbackPool(device);
  await assert_default.rejects(() => rb.mapAsync(GPUMapMode.READ));
  assert_default.notStrictEqual(
    stage(src),
    rb,
    "a cleared pool must not hand the buffer out again",
  );
  src.destroy();
});
test("destroys the readback buffer even when mapping fails", async () => {
  const src = uploadBuffer(
    device,
    new Float32Array([1, 2]),
    "result-test-src",
    true,
  );
  const enc = device.createCommandEncoder();
  const readBuffer = stageReadback(device, enc, src);
  device.queue.submit([enc.finish()]);
  readBuffer.destroy();
  await assert_default.rejects(
    () => extractResult(readBuffer),
    "expected the mapping failure to propagate",
  );
  assert_default.doesNotThrow(() => readBuffer.destroy());
  const next = stage(src);
  assert_default.notStrictEqual(
    next,
    readBuffer,
    "a failed buffer must not be reused",
  );
  await extractResult(next);
  src.destroy();
});
var denoPanics = globalThis.Deno ? "panics Deno's WebGPU" : false;
test("handles an empty readback", { skip: denoPanics }, async () => {
  const out = await roundTrip(new Float32Array(0));
  assert_default.equal(out.length, 0);
});
