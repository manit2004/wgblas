import {
  cleanup,
  getAdapter,
  getDevice,
  gpuName,
  init,
  isBenchmarkEnabled,
} from "./chunk-DRWHW5N5.mjs";
import {
  dawnOnly,
  getPowerPreference,
  multiDevice,
} from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/init/src/test.init.js
var powerPreference = getPowerPreference();
after(() => cleanup());
test("getDevice() and getAdapter() throw before any init() call", () => {
  assert_default.throws(
    () => getDevice(),
    /call init\(\) first/,
    "getDevice should refuse to answer with no device initialized",
  );
  assert_default.throws(
    () => getAdapter(),
    /call init\(\) first/,
    "getAdapter should refuse to answer with no device initialized",
  );
});
test("isBenchmarkEnabled() defaults to false for an unregistered device", () => {
  assert_default.equal(isBenchmarkEnabled({ label: "never-from-init" }), false);
});
test("first init() call with dumpShaders:true builds a working device", async () => {
  const device = await init({ powerPreference, dumpShaders: true });
  assert_default.ok(device, "expected init() to succeed with dumpShaders:true");
  assert_default.ok(gpuName(device).description, "expected a working adapter");
});
test("repeat init() with identical options returns the same device", async () => {
  const first = await init({ powerPreference });
  const second = await init({ powerPreference });
  assert_default.equal(
    second,
    first,
    "expected the cached device to be returned",
  );
});
test(
  "differing options yield a distinct device, not an error",
  { skip: multiDevice },
  async () => {
    const plain = await init({ powerPreference });
    const benchmarking = await init({ powerPreference, benchmark: true });
    assert_default.notEqual(
      benchmarking,
      plain,
      "benchmark:true must get its own device",
    );
    assert_default.equal(await init({ powerPreference }), plain);
    assert_default.equal(
      await init({ powerPreference, benchmark: true }),
      benchmarking,
    );
  },
);
test("getDevice() returns the primary device once one exists", async () => {
  const first = await init({ powerPreference });
  assert_default.equal(
    getDevice(),
    first,
    "expected getDevice() to answer with the primary device",
  );
});
test("gpuName() reports per-device, defaulting to the first init", async () => {
  const first = await init({ powerPreference });
  const byDefault = gpuName();
  const explicit = gpuName(first);
  assert_default.deepEqual(
    explicit,
    byDefault,
    "explicit primary should match the default",
  );
  assert_default.ok(byDefault.description, "expected an adapter description");
});
test(
  'gpuName() falls back to "unknown" for missing adapter info fields',
  { skip: dawnOnly },
  async () => {
    const device = await init({ powerPreference });
    const adapter = getAdapter(device);
    const originalInfo = adapter.info;
    adapter.info = { device: "", description: "" };
    try {
      assert_default.deepEqual(gpuName(device), {
        description: "unknown",
        device: "unknown",
      });
    } finally {
      adapter.info = originalInfo;
    }
  },
);
test(
  "cleanup() releases every cached device",
  { skip: multiDevice },
  async () => {
    await init({ powerPreference });
    await init({ powerPreference, benchmark: true });
    cleanup();
    assert_default.throws(
      () => gpuName(),
      /call init\(\) first/,
      "cleanup should clear device state",
    );
    const fresh = await init({ powerPreference });
    assert_default.ok(fresh, "expected re-init after cleanup to succeed");
    cleanup();
  },
);
test(
  "cleanup(device) releases only that device",
  { skip: multiDevice },
  async () => {
    const plain = await init({ powerPreference });
    const benchmarking = await init({ powerPreference, benchmark: true });
    cleanup(benchmarking);
    assert_default.equal(
      await init({ powerPreference }),
      plain,
      "surviving device should still be cached",
    );
    assert_default.ok(
      gpuName(plain).description,
      "surviving device should still report its adapter",
    );
    const rebuilt = await init({ powerPreference, benchmark: true });
    assert_default.notEqual(
      rebuilt,
      benchmarking,
      "released device should not come back from the cache",
    );
    cleanup();
  },
);
test(
  "cleanup(device) promotes a survivor to be the default device",
  { skip: multiDevice },
  async () => {
    const plain = await init({ powerPreference });
    const benchmarking = await init({ powerPreference, benchmark: true });
    assert_default.deepEqual(
      gpuName(),
      gpuName(plain),
      "first init should start as the default",
    );
    cleanup(plain);
    assert_default.deepEqual(
      gpuName(),
      gpuName(benchmarking),
      "survivor should become the default",
    );
    cleanup();
  },
);
test("cleanup(device) is idempotent and ignores unknown devices", async () => {
  const device = await init({ powerPreference });
  cleanup(device);
  assert_default.doesNotThrow(() => cleanup(device));
  assert_default.doesNotThrow(() => cleanup({ label: "never-from-init" }));
  cleanup();
});
test(
  "dumpShaders can only be set by the process's first init() call",
  { skip: dawnOnly },
  async () => {
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
    assert_default.ok(device, "expected init() to still succeed");
    assert_default.ok(
      warnings.some((w) => w.includes("dumpShaders")),
      `expected a dumpShaders warning, got: ${JSON.stringify(warnings)}`,
    );
    cleanup(device);
  },
);
