import { edge_cases_default, forwardFactor } from "./chunk-BNA5U2A2.mjs";
import { sdotReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures, runValidation } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, init, sdot } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import { randomFloat32Array } from "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/sdot/src/test.sdot.js
var NUM_RUNS = 100;
var device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => {
  cleanup();
});
var validationSpecs = {
  device: loadParam("device"),
  n: loadParam("n"),
  incx: loadParam("incx"),
  incy: loadParam("incy"),
  x: loadParam("x"),
  y: loadParam("y"),
};
test("sdot validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => sdot(a.device, a.n, a.x, a.incx, a.y, a.incy),
    { device },
  );
});
test("sdot fixtures", async (t) => {
  await runFixtures(
    t,
    // node:test context
    "sdot",
    // routine name — used in the diagnostic label
    device,
    // WebGPU device instance
    NUM_RUNS,
    // 100 random inputs
    1,
    // threshold 1 — forward error factor ≤ 1 means within one rounding of true result
    validationSpecs,
    // param specs used to generate random inputs
    async (dev, a) => sdot(dev, a.n, a.x, a.incx, a.y, a.incy),
    // GPU call
    sdotReference,
    // CPU reference
    forwardFactor,
    // |err| / (eps * |bound|) — see helpers.js
  );
});
test("sdot edge cases", async (t) => {
  for (const c of edge_cases_default) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,
        // vector length
        x: new Float32Array(c.x),
        // input vector
        incx: c.incx,
        // stride through x
        y: new Float32Array(c.y),
        // input vector
        incy: c.incy,
        // stride through y
      };
      const { dot: got } = await sdot(
        device,
        // GPU device
        a.n,
        // vector length
        a.x,
        // input vector
        a.incx,
        // stride through x
        a.y,
        // input vector
        a.incy,
        // stride through y
      );
      const expected = sdotReference(a);
      assert_default.strictEqual(got, expected);
    });
  }
});
test("sdot zero-dimension (regression)", async () => {
  const x = randomFloat32Array(8, -1, 1, 300);
  const y = randomFloat32Array(8, -1, 1, 301);
  const { dot: got } = await sdot(device, 0, x, 1, y, 1);
  assert_default.strictEqual(got, 0);
});
