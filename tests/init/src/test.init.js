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
import {
  getDevice,
  getAdapter,
  isBenchmarkEnabled,
} from "../../../src/init.mjs";
import { getPowerPreference } from "../../helpers/device.js";

const powerPreference = getPowerPreference();

after(() => cleanup());

// Must run before any init() call in this file/process — getDevice/getAdapter
// only throw while `_primary` is still null, i.e. before the first init().
test("getDevice() and getAdapter() throw before any init() call", () => {
  assert.throws(
    () => getDevice(),
    /call init\(\) first/,
    "getDevice should refuse to answer with no device initialized",
  );
  assert.throws(
    () => getAdapter(),
    /call init\(\) first/,
    "getAdapter should refuse to answer with no device initialized",
  );
});

// Order-independent — isBenchmarkEnabled() doesn't touch init() state at all,
// it just looks up whatever device it's handed. A device that never went
// through init() (or none at all, if called before any init()) has no entry
// in the internal metadata map, so this exercises the `?? false` fallback
// rather than every other call site's registered-device path.
test("isBenchmarkEnabled() defaults to false for an unregistered device", () => {
  assert.equal(isBenchmarkEnabled({ label: "never-from-init" }), false);
});

// dumpShaders's toggles-array ternary in init.mjs only takes its "true"
// branch on the process's very first init() call (the `if (!_gpu)` guard
// means every later call skips straight past it) — so this has to run
// before any other init() in the file, right after the throws-before-init
// check above.
test("first init() call with dumpShaders:true builds a working device", async () => {
  const device = await init({ powerPreference, dumpShaders: true });
  assert.ok(device, "expected init() to succeed with dumpShaders:true");
  // No prior instance exists yet, so there's nothing to mismatch against —
  // unlike the "changed after first init()" case below, this must be silent.
  assert.ok(gpuName(device).description, "expected a working adapter");
});

test("repeat init() with identical options returns the same device", async () => {
  const first = await init({ powerPreference });
  const second = await init({ powerPreference });
  assert.equal(second, first, "expected the cached device to be returned");
});

test("differing options yield a distinct device, not an error", async () => {
  const plain = await init({ powerPreference });
  const benchmarking = await init({ powerPreference, benchmark: true });
  assert.notEqual(
    benchmarking,
    plain,
    "benchmark:true must get its own device",
  );
  // ...and each remains individually cached.
  assert.equal(await init({ powerPreference }), plain);
  assert.equal(await init({ powerPreference, benchmark: true }), benchmarking);
});

test("getDevice() returns the primary device once one exists", async () => {
  const first = await init({ powerPreference });
  assert.equal(
    getDevice(),
    first,
    "expected getDevice() to answer with the primary device",
  );
});

test("gpuName() reports per-device, defaulting to the first init", async () => {
  const first = await init({ powerPreference });
  const byDefault = gpuName();
  const explicit = gpuName(first);
  assert.deepEqual(
    explicit,
    byDefault,
    "explicit primary should match the default",
  );
  assert.ok(byDefault.description, "expected an adapter description");
});

test('gpuName() falls back to "unknown" for missing adapter info fields', async () => {
  // Real adapters always report a description, so this fallback needs a
  // deliberately blanked-out info object — adapter.info is a plain
  // writable/configurable own property, so no environment faking needed.
  const device = await init({ powerPreference });
  const adapter = getAdapter(device);
  const originalInfo = adapter.info;
  adapter.info = { device: "", description: "" };
  try {
    assert.deepEqual(gpuName(device), {
      description: "unknown",
      device: "unknown",
    });
  } finally {
    adapter.info = originalInfo;
  }
});

test("cleanup() releases every cached device", async () => {
  await init({ powerPreference });
  await init({ powerPreference, benchmark: true });
  cleanup();
  assert.throws(
    () => gpuName(),
    /call init\(\) first/,
    "cleanup should clear device state",
  );
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
  assert.equal(
    await init({ powerPreference }),
    plain,
    "surviving device should still be cached",
  );
  assert.ok(
    gpuName(plain).description,
    "surviving device should still report its adapter",
  );
  // The released one is gone from the cache, so asking again builds a new device.
  const rebuilt = await init({ powerPreference, benchmark: true });
  assert.notEqual(
    rebuilt,
    benchmarking,
    "released device should not come back from the cache",
  );
  cleanup();
});

test("cleanup(device) promotes a survivor to be the default device", async () => {
  const plain = await init({ powerPreference });
  const benchmarking = await init({ powerPreference, benchmark: true });
  assert.deepEqual(
    gpuName(),
    gpuName(plain),
    "first init should start as the default",
  );

  cleanup(plain); // release the current default

  // gpuName() with no argument must still answer, now via the survivor.
  assert.deepEqual(
    gpuName(),
    gpuName(benchmarking),
    "survivor should become the default",
  );
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

test("dumpShaders can only be set by the process's first init() call", async () => {
  // dumpShaders is a toggle on the shared WebGPU instance, fixed once by
  // whichever init() call creates it first — not per-device like
  // powerPreference/benchmark. This file's first init() call (above) already
  // created the instance with dumpShaders: true, so a later call on a
  // genuinely new (powerPreference, benchmark) key that asks for
  // dumpShaders: false must warn and be ignored, not silently succeed.
  const otherPref =
    powerPreference === "low-power" ? "high-performance" : "low-power";

  const warnings = [];
  const originalWarn = console.warn;
  console.warn = (...args) => warnings.push(args.join(" "));
  let device;
  try {
    device = await init({ powerPreference: otherPref, dumpShaders: false });
  } finally {
    console.warn = originalWarn;
  }

  assert.ok(device, "expected init() to still succeed");
  assert.ok(
    warnings.some((w) => w.includes("dumpShaders")),
    `expected a dumpShaders warning, got: ${JSON.stringify(warnings)}`,
  );
  cleanup(device);
});
