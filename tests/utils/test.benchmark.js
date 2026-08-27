// GPU timestamp queries.
//
// benchmarkMode decides what requiredFeatures init() asks for. beginTimestamp
// builds the two-slot query set and the timestampWrites descriptor;
// resolveTimestamp encodes the resolve+copy; extractTimestamp maps the result,
// subtracts the two nanosecond stamps and destroys all three handles.
//
// Every step is a no-op unless the *device* was created with benchmark: true —
// benchmark state is per-device, not global, and it reflects what the adapter
// actually granted rather than what was requested. A device that reported
// benchmark: true without the timestamp-query feature would build a query set
// it is not allowed to have.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, sscal } from "wgblas";
// getAdapter is a library internal, not a package export.
import { getAdapter } from "../../src/init.mjs";
import { benchmarkMode, beginTimestamp, resolveTimestamp, extractTimestamp } from "../../src/util/benchmark.mjs";
import { getPowerPreference } from "../helpers/device.js";

const powerPreference = getPowerPreference();

let plain;      // benchmark: false
let timed;      // benchmark: true
let timestampsSupported = false;

before(async () => {
  plain = await init({ powerPreference });
  timed = await init({ powerPreference, benchmark: true });
  timestampsSupported = getAdapter(timed).features.has("timestamp-query");
});
after(() => cleanup());

test("benchmarkMode returns an empty descriptor when disabled", () => {
  assert.deepEqual(benchmarkMode(getAdapter(plain), false), {},
    "disabled must not request any feature");
});

test("benchmarkMode requests timestamp-query only when the adapter has it", () => {
  const config = benchmarkMode(getAdapter(timed), true);
  if (timestampsSupported) {
    assert.deepEqual(config, { requiredFeatures: ["timestamp-query"] });
  } else {
    // Unsupported adapters degrade to a plain device rather than failing.
    assert.deepEqual(config, {}, "should fall back silently when unsupported");
  }
});

test("beginTimestamp is inert on a non-benchmark device", () => {
  const { querySet, passDescriptor } = beginTimestamp(plain);
  assert.equal(querySet, null, "no query set without benchmark mode");
  assert.equal(passDescriptor, undefined, "no timestampWrites descriptor either");
});

test("resolveTimestamp and extractTimestamp pass null straight through", async () => {
  assert.equal(resolveTimestamp(plain, plain.createCommandEncoder(), null), null,
    "a null query set resolves to null");
  assert.equal(await extractTimestamp(null), undefined,
    "a null handle extracts to undefined, not NaN");
});

test("beginTimestamp builds a two-slot query set on a benchmark device", (t) => {
  if (!timestampsSupported) {
    t.skip("adapter does not support timestamp-query");
    return;
  }
  const { querySet, passDescriptor } = beginTimestamp(timed);
  assert.ok(querySet, "expected a query set");
  assert.equal(querySet.count, 2, "one slot for pass start, one for pass end");
  assert.equal(passDescriptor.timestampWrites.beginningOfPassWriteIndex, 0);
  assert.equal(passDescriptor.timestampWrites.endOfPassWriteIndex, 1);
  assert.equal(passDescriptor.timestampWrites.querySet, querySet);
  querySet.destroy();
});

test("a full timestamp round trip yields a non-negative elapsed time", async (t) => {
  if (!timestampsSupported) {
    t.skip("adapter does not support timestamp-query");
    return;
  }
  // Exercised through a real routine so the query set actually spans work.
  const { gpuTimeMs } = await sscal(timed, 5, 2, new Float32Array([1, 2, 3, 4, 5]), 1);
  assert.equal(typeof gpuTimeMs, "number", "benchmark device should report gpuTimeMs");
  assert.ok(gpuTimeMs >= 0, `elapsed time must not be negative, got ${gpuTimeMs}`);
  assert.ok(Number.isFinite(gpuTimeMs), "elapsed time must be finite");
});

test("a non-benchmark device reports no timing at all", async () => {
  // The bug this guards: benchmark state read globally instead of per-device
  // made every device look like the last one initialized.
  const { gpuTimeMs } = await sscal(plain, 5, 2, new Float32Array([1, 2, 3, 4, 5]), 1);
  assert.equal(gpuTimeMs, undefined, "a plain device must not report gpuTimeMs");
});

test("benchmark state is per-device, not global", async (t) => {
  if (!timestampsSupported) {
    t.skip("adapter does not support timestamp-query");
    return;
  }
  // Both devices are live at once; each must answer for itself regardless of
  // which was initialized most recently.
  const timedRun = await sscal(timed, 3, 2, new Float32Array([1, 2, 3]), 1);
  const plainRun = await sscal(plain, 3, 2, new Float32Array([1, 2, 3]), 1);
  assert.equal(typeof timedRun.gpuTimeMs, "number", "benchmark device still times");
  assert.equal(plainRun.gpuTimeMs, undefined, "plain device still does not");
});
