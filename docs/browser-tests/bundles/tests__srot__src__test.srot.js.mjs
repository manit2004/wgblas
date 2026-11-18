import { edge_cases_default, forwardFactor } from "./chunk-RCIQXVQP.mjs";
import { srotReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures, runValidation } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, init, srot } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import { randomFloat32Array } from "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/srot/src/test.srot.js
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
  c: loadParam("cosine"),
  s: loadParam("s"),
};
test("srot validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => srot(a.device, a.n, a.x, a.incx, a.y, a.incy, a.c, a.s),
    { device },
  );
});
test("srot fixtures", async (t) => {
  await runFixtures(
    t,
    // node:test context
    "srot",
    // routine name — used in the diagnostic label
    device,
    // WebGPU device instance
    NUM_RUNS,
    // 100 random inputs
    1,
    // threshold 1 — forward error factor ≤ 1 means within one rounding of true result
    validationSpecs,
    // param specs used to generate random inputs
    async (dev, a) => srot(dev, a.n, a.x, a.incx, a.y, a.incy, a.c, a.s),
    // GPU call
    srotReference,
    // CPU reference
    forwardFactor,
    // |err| / (eps * |bound|) — see helpers.js
  );
});
test("srot edge cases", async (t) => {
  for (const tc of edge_cases_default) {
    await t.test(tc.label, async () => {
      const a = {
        n: tc.n,
        // vector length
        x: new Float32Array(tc.x),
        // input/output vector
        incx: tc.incx,
        // stride through x
        y: new Float32Array(tc.y),
        // input/output vector
        incy: tc.incy,
        // stride through y
        c: tc.c,
        // rotation cosine
        s: tc.s,
        // rotation sine
      };
      const got = await srot(
        device,
        // GPU device
        a.n,
        // vector length
        a.x,
        // input/output vector
        a.incx,
        // stride through x
        a.y,
        // input/output vector
        a.incy,
        // stride through y
        a.c,
        // rotation cosine
        a.s,
        // rotation sine
      );
      const expected = srotReference(a);
      assert_default.deepEqual(got.x, expected.x);
      assert_default.deepEqual(got.y, expected.y);
    });
  }
});
test("srot zero-dimension (regression)", async () => {
  const x = randomFloat32Array(8, -1, 1, 300);
  const y = randomFloat32Array(8, -1, 1, 301);
  const beforeX = x.slice();
  const beforeY = y.slice();
  const got = await srot(device, 0, x, 1, y, 1, 0.6, 0.8);
  assert_default.deepEqual(Array.from(got.x), Array.from(beforeX));
  assert_default.deepEqual(Array.from(got.y), Array.from(beforeY));
});
