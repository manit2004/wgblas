// Dispatch sizing.
//
// calcWorkgroups CLAMPS to maxComputeWorkgroupsPerDimension and is only safe
// for grid-stride shaders, which re-walk the whole domain however many
// workgroups launch. requireWorkgroups/requireWorkgroupCount THROW instead, for
// shaders that index straight off workgroup_id — clamping those silently
// computes part of the result and reports success.
//
// These functions read nothing but `device.limits`, so most tests pass a stub
// with a small limit. That pins the clamp/throw boundary exactly, which a real
// device (limit 65535) could only reach with an absurd allocation.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  calcWorkgroups, requireWorkgroups, requireWorkgroupCount,
} from "../../src/util/workgroup.mjs";
import { WGS, TILE_WG_2D } from "../../src/util/constants.mjs";

/** Minimal stand-in — these helpers only ever read this one limit. */
const deviceWithLimit = (max) => ({ limits: { maxComputeWorkgroupsPerDimension: max } });
const roomy = deviceWithLimit(65535);

test("calcWorkgroups 1D divides by the 1D workgroup size, rounding up", () => {
  assert.equal(calcWorkgroups(roomy, WGS), 1, "exactly one workgroup's worth");
  assert.equal(calcWorkgroups(roomy, WGS + 1), 2, "one element over needs a second");
  assert.equal(calcWorkgroups(roomy, 1), 1);
  assert.equal(calcWorkgroups(roomy, 10 * WGS), 10);
});

test("calcWorkgroups 2D maps rows to y and cols to x", () => {
  // The mapping is easy to get backwards, so use distinguishable extents.
  const wg = calcWorkgroups(roomy, TILE_WG_2D * 3, TILE_WG_2D * 5);
  assert.deepEqual(wg, { x: 5, y: 3 }, "cols -> x, rows -> y");
});

test("calcWorkgroups clamps rather than throwing", () => {
  const tiny = deviceWithLimit(4);
  assert.equal(calcWorkgroups(tiny, WGS * 100), 4, "1D count should clamp to the limit");
  assert.deepEqual(
    calcWorkgroups(tiny, TILE_WG_2D * 100, TILE_WG_2D * 100), { x: 4, y: 4 },
    "both 2D dimensions should clamp",
  );
});

test("requireWorkgroupCount passes a count through when it fits", () => {
  assert.equal(requireWorkgroupCount(deviceWithLimit(10), 10, "sgemm", "x"), 10,
    "a count exactly at the limit is legal");
  assert.equal(requireWorkgroupCount(deviceWithLimit(10), 1, "sgemm"), 1);
});

test("requireWorkgroupCount throws past the limit, naming routine and dimension", () => {
  assert.throws(
    () => requireWorkgroupCount(deviceWithLimit(10), 11, "sgemm", "y"),
    (err) => {
      assert.match(err.message, /^sgemm:/, "should name the routine");
      assert.match(err.message, /11 workgroups in y/, "should name the count and dimension");
      assert.match(err.message, /maxComputeWorkgroupsPerDimension/, "should name the limit");
      assert.match(err.message, /10/, "should state the limit value");
      return true;
    },
  );
});

test("requireWorkgroups mirrors calcWorkgroups when everything fits", () => {
  const rows = TILE_WG_2D * 3, cols = TILE_WG_2D * 5;
  assert.deepEqual(requireWorkgroups(roomy, "strsm", rows, cols), calcWorkgroups(roomy, rows, cols));
  assert.equal(requireWorkgroups(roomy, "sgemv", WGS * 7), calcWorkgroups(roomy, WGS * 7));
});

test("requireWorkgroups throws where calcWorkgroups would have clamped", () => {
  const tiny = deviceWithLimit(4);
  // Same inputs that clamp silently above must now be refused.
  assert.throws(() => requireWorkgroups(tiny, "sgemv", WGS * 100), /sgemv:.*maxComputeWorkgroupsPerDimension/);
  assert.throws(() => requireWorkgroups(tiny, "strsm", TILE_WG_2D * 100, 8), /strsm:.*in y/);
  assert.throws(() => requireWorkgroups(tiny, "strsm", 8, TILE_WG_2D * 100), /strsm:.*in x/);
});

test("a real device reports a usable dispatch limit", async (t) => {
  // The stubs above pin the arithmetic; this checks the field actually exists
  // on a real device, so the helpers can't be silently reading undefined.
  const { init, cleanup } = await import("wgblas");
  const { getPowerPreference } = await import("../helpers/device.js");
  const device = await init({ powerPreference: getPowerPreference() });
  t.after(() => cleanup());
  const max = device.limits.maxComputeWorkgroupsPerDimension;
  assert.ok(Number.isInteger(max) && max > 0, `expected a positive integer limit, got ${max}`);
  assert.equal(calcWorkgroups(device, WGS), 1, "should size a small dispatch normally");
  assert.throws(
    () => requireWorkgroupCount(device, max + 1, "sgemm"),
    new RegExp(`sgemm:.*${max + 1} workgroups.*the device allows ${max}`),
  );
});
