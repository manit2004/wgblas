// init() caches one device per distinct option set. Repeating a call with the
// same options is idempotent (every routine's `before()` hook relies on that);
// calling with *different* options now yields a *separate* device rather than
// throwing, so one process can drive several GPUs at once.
//
// A device's requiredFeatures are fixed at requestDevice(), which is why the
// cache is keyed by options instead of reconfiguring a single device — that
// was the bug where init({ benchmark: true }) after a plain init() silently
// returned the non-benchmark device and left gpuTimeMs undefined forever.
import { test, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, gpuName } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";

const powerPreference = getPowerPreference();

after(() => cleanup());

test("repeat init() with identical options returns the same device", async () => {
  const first = await init({ powerPreference });
  const second = await init({ powerPreference });
  assert.equal(second, first, "expected the cached device to be returned");
});

test("differing options yield a distinct device, not an error", async () => {
  const plain = await init({ powerPreference });
  const benchmarking = await init({ powerPreference, benchmark: true });
  assert.notEqual(benchmarking, plain, "benchmark:true must get its own device");
  // ...and each remains individually cached.
  assert.equal(await init({ powerPreference }), plain);
  assert.equal(await init({ powerPreference, benchmark: true }), benchmarking);
});

test("gpuName() reports per-device, defaulting to the first init", async () => {
  const first = await init({ powerPreference });
  const byDefault = gpuName();
  const explicit = gpuName(first);
  assert.deepEqual(explicit, byDefault, "explicit primary should match the default");
  assert.ok(byDefault.description, "expected an adapter description");
});

test("cleanup() releases every cached device", async () => {
  await init({ powerPreference });
  await init({ powerPreference, benchmark: true });
  cleanup();
  assert.throws(() => gpuName(), /call init\(\) first/, "cleanup should clear device state");
  // Re-initializing after cleanup works and starts a fresh cache.
  const fresh = await init({ powerPreference });
  assert.ok(fresh, "expected re-init after cleanup to succeed");
  cleanup();
});

test("cleanup(device) releases only that device", async () => {
  const plain = await init({ powerPreference });
  const benchmarking = await init({ powerPreference, benchmark: true });

  cleanup(benchmarking);

  // The survivor stays usable, and its cache entry stays intact.
  assert.equal(await init({ powerPreference }), plain, "surviving device should still be cached");
  assert.ok(gpuName(plain).description, "surviving device should still report its adapter");
  // The released one is gone from the cache, so asking again builds a new device.
  const rebuilt = await init({ powerPreference, benchmark: true });
  assert.notEqual(rebuilt, benchmarking, "released device should not come back from the cache");
  cleanup();
});

test("cleanup(device) promotes a survivor to be the default device", async () => {
  const plain = await init({ powerPreference });
  const benchmarking = await init({ powerPreference, benchmark: true });
  assert.deepEqual(gpuName(), gpuName(plain), "first init should start as the default");

  cleanup(plain); // release the current default

  // gpuName() with no argument must still answer, now via the survivor.
  assert.deepEqual(gpuName(), gpuName(benchmarking), "survivor should become the default");
  cleanup();
});

test("cleanup(device) is idempotent and ignores unknown devices", async () => {
  const device = await init({ powerPreference });
  cleanup(device);
  // Releasing twice, and releasing something never handed out, must not throw.
  assert.doesNotThrow(() => cleanup(device));
  assert.doesNotThrow(() => cleanup({ label: "never-from-init" }));
  cleanup();
});
