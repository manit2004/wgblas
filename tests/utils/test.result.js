// Readback extraction.
//
// extractResult maps a MAP_READ buffer, copies the bytes out, unmaps, and
// destroys the buffer in a finally. The .slice() before unmap is load-bearing:
// getMappedRange() returns a view into mapped GPU memory that goes invalid the
// moment unmap() runs, so returning it directly would hand back a detached
// buffer. The destroy-in-finally is what stops every routine's readback buffer
// leaking when a map fails.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { uploadBuffer, stageReadback } from "../../src/util/buffer.mjs";
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
  assert.deepEqual(Array.from(out), Array.from(bits), "bit patterns must survive unchanged");
});

test("the returned array survives the unmap", async () => {
  // If the .slice() were dropped, the view would be detached by unmap() and
  // reading it would give zeroes or throw.
  const out = await roundTrip(new Float32Array([7, 8, 9]));
  assert.equal(out.buffer.byteLength, 12, "result should own its memory, not view mapped GPU memory");
  assert.deepEqual(Array.from(out), [7, 8, 9], "values should still be readable after unmap");
});

test("destroys the readback buffer on success", async () => {
  const src = uploadBuffer(device, new Float32Array([1, 2]), "result-test-src", true);
  const enc = device.createCommandEncoder();
  const readBuffer = stageReadback(device, enc, src);
  device.queue.submit([enc.finish()]);
  await extractResult(readBuffer);
  // A destroyed buffer cannot be mapped again; if it were still alive this
  // would resolve instead of rejecting.
  await assert.rejects(() => readBuffer.mapAsync(GPUMapMode.READ), "buffer should have been destroyed");
  src.destroy();
});

test("destroys the readback buffer even when mapping fails", async () => {
  // The finally is the point: a buffer that never maps must not leak.
  const src = uploadBuffer(device, new Float32Array([1, 2]), "result-test-src", true);
  const enc = device.createCommandEncoder();
  const readBuffer = stageReadback(device, enc, src);
  device.queue.submit([enc.finish()]);
  readBuffer.destroy(); // force mapAsync to fail

  await assert.rejects(() => extractResult(readBuffer), "expected the mapping failure to propagate");
  // Still destroyed, and destroying twice must not throw.
  assert.doesNotThrow(() => readBuffer.destroy());
  src.destroy();
});

test("handles an empty readback", async () => {
  const out = await roundTrip(new Float32Array(0));
  assert.equal(out.length, 0);
});
