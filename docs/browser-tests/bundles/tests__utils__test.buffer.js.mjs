import {
  cleanup,
  createResultBuffer,
  createStorageBuffer,
  destroyBuffers,
  init,
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

// tests/utils/test.buffer.js
var device;
var overLimit;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
  overLimit = device.limits.maxStorageBufferBindingSize + 4;
});
after(() => cleanup());
test("createStorageBuffer rejects an oversized intermediate", () => {
  assert_default.throws(
    () => createStorageBuffer(device, overLimit, "my-intermediate"),
    (err) => {
      assert_default.match(
        err.message,
        /Buffer "my-intermediate" needs \d+ bytes/,
        "should name the buffer",
      );
      assert_default.match(
        err.message,
        /maxStorageBufferBindingSize/,
        "should name the limit",
      );
      return true;
    },
  );
});
test("createResultBuffer rejects an oversized result", () => {
  assert_default.throws(
    () => createResultBuffer(device, overLimit, "my-result"),
    /Buffer "my-result" needs \d+ bytes.*maxStorageBufferBindingSize/s,
  );
});
test("uploadBuffer still rejects oversized input, now naming the buffer", () => {
  const oversized = { byteLength: overLimit, constructor: Float32Array };
  assert_default.throws(
    () => uploadBuffer(device, oversized, "my-input"),
    /Buffer "my-input" needs \d+ bytes.*maxStorageBufferBindingSize/s,
  );
});
test("buffers at or under the limit are created normally", () => {
  const storage = createStorageBuffer(device, 1024, "ok-storage");
  const result = createResultBuffer(device, 1024, "ok-result");
  const uploaded = uploadBuffer(device, new Float32Array(256), "ok-input");
  assert_default.equal(storage.size, 1024);
  assert_default.equal(result.size, 1024);
  assert_default.equal(uploaded.size, 1024);
  destroyBuffers(storage, result, uploaded);
});
test("the limit itself is allowed, one byte past it is not", (t) => {
  const max = device.limits.maxStorageBufferBindingSize;
  const CAP = 512 * 1024 * 1024;
  if (max > CAP) {
    t.skip(
      `maxStorageBufferBindingSize is ${max} bytes \u2014 too large to allocate here`,
    );
    return;
  }
  const atLimit = createStorageBuffer(device, max, "at-limit");
  assert_default.equal(
    atLimit.size,
    max,
    "a buffer exactly at the limit must be allowed",
  );
  destroyBuffers(atLimit);
  assert_default.throws(
    () => createStorageBuffer(device, max + 1, "one-past"),
    /exceeding this device/,
  );
});
