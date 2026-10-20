// Readback extraction.
//
// extractResult maps a MAP_READ buffer, copies the bytes out, unmaps, and
// hands the buffer back to the readback pool (see stageReadback) — or, if the
// map failed, destroys it. The .slice() before unmap is load-bearing:
// getMappedRange() returns a view into mapped GPU memory that goes invalid the
// moment unmap() runs, so returning it directly would hand back a detached
// buffer. Destroying on failure is what stops a broken buffer from leaking or
// being handed to the next call.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import {
  uploadBuffer,
  stageReadback,
  clearReadbackPool,
} from "../../src/util/buffer.mjs";
import { extractResult } from "../../src/util/result.mjs";
import { getPowerPreference } from "../helpers/device.js";

let device;

before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => cleanup());

/** Round-trips `data` through the GPU without touching it, via a copy. */
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
  assert.deepEqual(await roundTrip(data), data);
});

test("defaults to Float32Array", async () => {
  const out = await roundTrip(new Float32Array([1, 2, 3]));
  assert.ok(out instanceof Float32Array, "expected a Float32Array by default");
});

test("honours the requested typed-array type, preserving raw bits", async () => {
  // dasum's aux half depends on this: routed through a Float32Array view, NaN
  // bit patterns can be canonicalized and the low half of a double-double is
  // corrupted. Uint32Array must hand back the bits untouched.
  const bits = new Uint32Array([0x7fc00001, 0xdeadbeef, 0, 0xffffffff]);
  const out = await roundTrip(bits, Uint32Array);
  assert.ok(out instanceof Uint32Array, "expected a Uint32Array");
  assert.deepEqual(
    Array.from(out),
    Array.from(bits),
    "bit patterns must survive unchanged",
  );
});

test("the returned array survives the unmap", async () => {
  // If the .slice() were dropped, the view would be detached by unmap() and
  // reading it would give zeroes or throw.
  const out = await roundTrip(new Float32Array([7, 8, 9]));
  assert.equal(
    out.buffer.byteLength,
    12,
    "result should own its memory, not view mapped GPU memory",
  );
  assert.deepEqual(
    Array.from(out),
    [7, 8, 9],
    "values should still be readable after unmap",
  );
});

/** Stages a readback of `src` (one submit) and returns the readback buffer. */
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
  assert.deepEqual(await extractResult(first), new Float32Array([1, 2, 3]));
  const second = stage(b); // same size: must come from the pool
  assert.strictEqual(
    second,
    first,
    "same-size readback should reuse the pooled buffer",
  );
  assert.deepEqual(await extractResult(second), new Float32Array([7, 8, 9]));
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
  assert.notStrictEqual(
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
  assert.equal(reused, 4, "four pooled buffers should be reused");
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
  // Destroyed rather than pooled: a destroyed buffer can't be mapped again.
  await assert.rejects(() => rb.mapAsync(GPUMapMode.READ));
  src.destroy();
});

test("clearReadbackPool destroys pooled buffers", async () => {
  clearReadbackPool(device);
  const src = uploadBuffer(device, new Float32Array([1, 2]), "src", true);
  const rb = stage(src);
  await extractResult(rb);
  clearReadbackPool(device);
  await assert.rejects(() => rb.mapAsync(GPUMapMode.READ));
  assert.notStrictEqual(
    stage(src),
    rb,
    "a cleared pool must not hand the buffer out again",
  );
  src.destroy();
});

test("destroys the readback buffer even when mapping fails", async () => {
  // The finally is the point: a buffer that never maps must not leak.
  const src = uploadBuffer(
    device,
    new Float32Array([1, 2]),
    "result-test-src",
    true,
  );
  const enc = device.createCommandEncoder();
  const readBuffer = stageReadback(device, enc, src);
  device.queue.submit([enc.finish()]);
  readBuffer.destroy(); // force mapAsync to fail

  await assert.rejects(
    () => extractResult(readBuffer),
    "expected the mapping failure to propagate",
  );
  // Still destroyed, and destroying twice must not throw.
  assert.doesNotThrow(() => readBuffer.destroy());
  // A buffer whose map failed must never be pooled and handed out again.
  const next = stage(src);
  assert.notStrictEqual(next, readBuffer, "a failed buffer must not be reused");
  await extractResult(next);
  src.destroy();
});

test("handles an empty readback", async () => {
  const out = await roundTrip(new Float32Array(0));
  assert.equal(out.length, 0);
});
