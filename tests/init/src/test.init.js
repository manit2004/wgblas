// init() caches one device for the whole process. Re-calling with the same
// options must stay idempotent (every routine's `before()` hook relies on
// that); re-calling with *different* options must throw, because a device's
// requiredFeatures are fixed at creation and the new options cannot take
// effect. Silently returning the cached device is what made
// init({ benchmark: true }) after a plain init() appear to work while
// gpuTimeMs stayed undefined forever.
import { test, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";

const powerPreference = getPowerPreference();

after(() => cleanup());

test("repeat init() with identical options returns the same device", async () => {
  const first = await init({ powerPreference });
  const second = await init({ powerPreference });
  assert.equal(second, first, "expected the cached device to be returned");
});

test("init() with no args after an explicit-default init() is idempotent", async () => {
  // Defaults must be resolved before comparing, or an omitted option would
  // read as "changed" against the stored default and throw spuriously.
  await init({ powerPreference });
  if (powerPreference === "high-performance") {
    const again = await init();
    assert.ok(again, "expected omitted options to resolve to their defaults");
  }
});

test("init() with a different option throws rather than ignoring it", async () => {
  await init({ powerPreference });
  await assert.rejects(
    () => init({ powerPreference, benchmark: true }),
    (err) => {
      assert.match(err.message, /already called with different options/);
      assert.match(err.message, /benchmark: false -> true/, "error should name the changed option");
      assert.match(err.message, /cleanup\(\)/, "error should say how to recover");
      return true;
    },
  );
});

test("cleanup() clears the recorded options so re-init succeeds", async () => {
  await init({ powerPreference });
  cleanup();
  const device = await init({ powerPreference, benchmark: true });
  assert.ok(device, "expected re-init with new options to succeed after cleanup()");
  cleanup();
  // Back to the baseline the other tests expect.
  await init({ powerPreference });
});
