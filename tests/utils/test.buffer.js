// Storage-buffer size limits.
//
// WebGPU accepts an oversized createBuffer() and only rejects it later, when it
// is bound — as a GPUValidationError naming a bind group index, with nothing to
// say which allocation was at fault. uploadBuffer has always checked the limit
// up front; createStorageBuffer and createResultBuffer did not, so an oversized
// intermediate surfaced as that cryptic bind-group error instead. All three now
// check at creation and name the offending buffer.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import {
  uploadBuffer, createStorageBuffer, createResultBuffer, destroyBuffers,
} from "../../src/util/buffer.mjs";
import { getPowerPreference } from "../helpers/device.js";

let device;
let overLimit;

before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
  overLimit = device.limits.maxStorageBufferBindingSize + 4;
});
after(() => cleanup());

test("createStorageBuffer rejects an oversized intermediate", () => {
  assert.throws(
    () => createStorageBuffer(device, overLimit, "my-intermediate"),
    (err) => {
      assert.match(err.message, /Buffer "my-intermediate" needs \d+ bytes/, "should name the buffer");
      assert.match(err.message, /maxStorageBufferBindingSize/, "should name the limit");
      return true;
    },
  );
});

test("createResultBuffer rejects an oversized result", () => {
  assert.throws(
    () => createResultBuffer(device, overLimit, "my-result"),
    /Buffer "my-result" needs \d+ bytes.*maxStorageBufferBindingSize/s,
  );
});

test("uploadBuffer still rejects oversized input, now naming the buffer", () => {
  // Allocating a host array that large would be wasteful, so present a stub
  // with only the fields uploadBuffer inspects before the check.
  const oversized = { byteLength: overLimit, constructor: Float32Array };
  assert.throws(
    () => uploadBuffer(device, oversized, "my-input"),
    /Buffer "my-input" needs \d+ bytes.*maxStorageBufferBindingSize/s,
  );
});

test("buffers at or under the limit are created normally", () => {
  // The check must be `>` and not `>=`: a buffer exactly at the limit is legal.
  const storage = createStorageBuffer(device, 1024, "ok-storage");
  const result = createResultBuffer(device, 1024, "ok-result");
  const uploaded = uploadBuffer(device, new Float32Array(256), "ok-input");
  assert.equal(storage.size, 1024);
  assert.equal(result.size, 1024);
  assert.equal(uploaded.size, 1024);
  destroyBuffers(storage, result, uploaded);
});

test("the limit itself is allowed, one byte past it is not", (t) => {
  const max = device.limits.maxStorageBufferBindingSize;
  // The check must be `>`, not `>=` — a buffer exactly at the limit is legal.
  // Testing that means really allocating one, so skip where it would be
  // unreasonable (this machine reports 128 MiB; some devices report far more).
  const CAP = 512 * 1024 * 1024;
  if (max > CAP) {
    t.skip(`maxStorageBufferBindingSize is ${max} bytes — too large to allocate here`);
    return;
  }
  const atLimit = createStorageBuffer(device, max, "at-limit");
  assert.equal(atLimit.size, max, "a buffer exactly at the limit must be allowed");
  destroyBuffers(atLimit);

  assert.throws(() => createStorageBuffer(device, max + 1, "one-past"), /exceeding this device/);
});
