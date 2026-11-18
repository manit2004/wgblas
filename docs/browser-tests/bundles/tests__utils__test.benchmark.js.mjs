import {
  beginTimestamp,
  benchmarkMode,
  cleanup,
  extractTimestamp,
  getAdapter,
  init,
  resolveTimestamp,
  sscal,
} from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference, multiDevice } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/utils/test.benchmark.js
var powerPreference = getPowerPreference();
var plain;
var timed;
var timestampsSupported = false;
var skip = multiDevice;
before(async () => {
  if (skip) return;
  plain = await init({ powerPreference });
  timed = await init({ powerPreference, benchmark: true });
  timestampsSupported = getAdapter(timed).features.has("timestamp-query");
});
after(() => cleanup());
test(
  "benchmarkMode returns an empty descriptor when disabled",
  { skip },
  () => {
    assert_default.deepEqual(
      benchmarkMode(getAdapter(plain), false),
      {},
      "disabled must not request any feature",
    );
  },
);
test(
  "benchmarkMode requests timestamp-query only when the adapter has it",
  { skip },
  () => {
    const config = benchmarkMode(getAdapter(timed), true);
    if (timestampsSupported) {
      assert_default.deepEqual(config, {
        requiredFeatures: ["timestamp-query"],
      });
    } else {
      assert_default.deepEqual(
        config,
        {},
        "should fall back silently when unsupported",
      );
    }
  },
);
test("beginTimestamp is inert on a non-benchmark device", { skip }, () => {
  const { querySet, passDescriptor } = beginTimestamp(plain);
  assert_default.equal(querySet, null, "no query set without benchmark mode");
  assert_default.equal(
    passDescriptor,
    void 0,
    "no timestampWrites descriptor either",
  );
});
test(
  "resolveTimestamp and extractTimestamp pass null straight through",
  { skip },
  async () => {
    assert_default.equal(
      resolveTimestamp(plain, plain.createCommandEncoder(), null),
      null,
      "a null query set resolves to null",
    );
    assert_default.equal(
      await extractTimestamp(null),
      void 0,
      "a null handle extracts to undefined, not NaN",
    );
  },
);
test(
  "beginTimestamp builds a two-slot query set on a benchmark device",
  { skip },
  (t) => {
    if (!timestampsSupported) {
      t.skip("adapter does not support timestamp-query");
      return;
    }
    const { querySet, passDescriptor } = beginTimestamp(timed);
    assert_default.ok(querySet, "expected a query set");
    assert_default.equal(
      querySet.count,
      2,
      "one slot for pass start, one for pass end",
    );
    assert_default.equal(
      passDescriptor.timestampWrites.beginningOfPassWriteIndex,
      0,
    );
    assert_default.equal(passDescriptor.timestampWrites.endOfPassWriteIndex, 1);
    assert_default.equal(passDescriptor.timestampWrites.querySet, querySet);
    querySet.destroy();
  },
);
test(
  "a full timestamp round trip yields a non-negative elapsed time",
  { skip },
  async (t) => {
    if (!timestampsSupported) {
      t.skip("adapter does not support timestamp-query");
      return;
    }
    const { gpuTimeMs } = await sscal(
      timed,
      5,
      2,
      new Float32Array([1, 2, 3, 4, 5]),
      1,
    );
    assert_default.equal(
      typeof gpuTimeMs,
      "number",
      "benchmark device should report gpuTimeMs",
    );
    assert_default.ok(
      gpuTimeMs >= 0,
      `elapsed time must not be negative, got ${gpuTimeMs}`,
    );
    assert_default.ok(
      Number.isFinite(gpuTimeMs),
      "elapsed time must be finite",
    );
  },
);
test("a non-benchmark device reports no timing at all", { skip }, async () => {
  const { gpuTimeMs } = await sscal(
    plain,
    5,
    2,
    new Float32Array([1, 2, 3, 4, 5]),
    1,
  );
  assert_default.equal(
    gpuTimeMs,
    void 0,
    "a plain device must not report gpuTimeMs",
  );
});
test("benchmark state is per-device, not global", { skip }, async (t) => {
  if (!timestampsSupported) {
    t.skip("adapter does not support timestamp-query");
    return;
  }
  const timedRun = await sscal(timed, 3, 2, new Float32Array([1, 2, 3]), 1);
  const plainRun = await sscal(plain, 3, 2, new Float32Array([1, 2, 3]), 1);
  assert_default.equal(
    typeof timedRun.gpuTimeMs,
    "number",
    "benchmark device still times",
  );
  assert_default.equal(
    plainRun.gpuTimeMs,
    void 0,
    "plain device still does not",
  );
});
