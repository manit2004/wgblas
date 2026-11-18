import {
  calcWorkgroups,
  requireWorkgroupCount,
  requireWorkgroups,
} from "./chunk-UIYSXR5Q.mjs";
import { TILE_WG_2D, WGS } from "./chunk-2ZD6UYXN.mjs";
import { assert_default, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/utils/test.workgroup.js
var deviceWithLimit = (max) => ({
  limits: { maxComputeWorkgroupsPerDimension: max },
});
var roomy = deviceWithLimit(65535);
test("calcWorkgroups 1D divides by the 1D workgroup size, rounding up", () => {
  assert_default.equal(
    calcWorkgroups(roomy, WGS),
    1,
    "exactly one workgroup's worth",
  );
  assert_default.equal(
    calcWorkgroups(roomy, WGS + 1),
    2,
    "one element over needs a second",
  );
  assert_default.equal(calcWorkgroups(roomy, 1), 1);
  assert_default.equal(calcWorkgroups(roomy, 10 * WGS), 10);
});
test("calcWorkgroups 2D maps rows to y and cols to x", () => {
  const wg = calcWorkgroups(roomy, TILE_WG_2D * 3, TILE_WG_2D * 5);
  assert_default.deepEqual(wg, { x: 5, y: 3 }, "cols -> x, rows -> y");
});
test("calcWorkgroups clamps rather than throwing", () => {
  const tiny = deviceWithLimit(4);
  assert_default.equal(
    calcWorkgroups(tiny, WGS * 100),
    4,
    "1D count should clamp to the limit",
  );
  assert_default.deepEqual(
    calcWorkgroups(tiny, TILE_WG_2D * 100, TILE_WG_2D * 100),
    { x: 4, y: 4 },
    "both 2D dimensions should clamp",
  );
});
test("requireWorkgroupCount passes a count through when it fits", () => {
  assert_default.equal(
    requireWorkgroupCount(deviceWithLimit(10), 10, "sgemm", "x"),
    10,
    "a count exactly at the limit is legal",
  );
  assert_default.equal(
    requireWorkgroupCount(deviceWithLimit(10), 1, "sgemm"),
    1,
  );
});
test("requireWorkgroupCount throws past the limit, naming routine and dimension", () => {
  assert_default.throws(
    () => requireWorkgroupCount(deviceWithLimit(10), 11, "sgemm", "y"),
    (err) => {
      assert_default.match(err.message, /^sgemm:/, "should name the routine");
      assert_default.match(
        err.message,
        /11 workgroups in y/,
        "should name the count and dimension",
      );
      assert_default.match(
        err.message,
        /maxComputeWorkgroupsPerDimension/,
        "should name the limit",
      );
      assert_default.match(err.message, /10/, "should state the limit value");
      return true;
    },
  );
});
test("requireWorkgroups mirrors calcWorkgroups when everything fits", () => {
  const rows = TILE_WG_2D * 3,
    cols = TILE_WG_2D * 5;
  assert_default.deepEqual(
    requireWorkgroups(roomy, "strsm", rows, cols),
    calcWorkgroups(roomy, rows, cols),
  );
  assert_default.equal(
    requireWorkgroups(roomy, "sgemv", WGS * 7),
    calcWorkgroups(roomy, WGS * 7),
  );
});
test("requireWorkgroups throws where calcWorkgroups would have clamped", () => {
  const tiny = deviceWithLimit(4);
  assert_default.throws(
    () => requireWorkgroups(tiny, "sgemv", WGS * 100),
    /sgemv:.*maxComputeWorkgroupsPerDimension/,
  );
  assert_default.throws(
    () => requireWorkgroups(tiny, "strsm", TILE_WG_2D * 100, 8),
    /strsm:.*in y/,
  );
  assert_default.throws(
    () => requireWorkgroups(tiny, "strsm", 8, TILE_WG_2D * 100),
    /strsm:.*in x/,
  );
});
test("a real device reports a usable dispatch limit", async (t) => {
  const { init, cleanup } = await import("./chunk-V2F5TH3O.mjs");
  const { getPowerPreference } = await import("./chunk-NCQMJX2P.mjs");
  const device = await init({ powerPreference: getPowerPreference() });
  t.after(() => cleanup());
  const max = device.limits.maxComputeWorkgroupsPerDimension;
  assert_default.ok(
    Number.isInteger(max) && max > 0,
    `expected a positive integer limit, got ${max}`,
  );
  assert_default.equal(
    calcWorkgroups(device, WGS),
    1,
    "should size a small dispatch normally",
  );
  assert_default.throws(
    () => requireWorkgroupCount(device, max + 1, "sgemm"),
    new RegExp(`sgemm:.*${max + 1} workgroups.*the device allows ${max}`),
  );
});
