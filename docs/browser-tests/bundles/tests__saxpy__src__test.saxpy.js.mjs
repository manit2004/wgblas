import { edge_cases_default, forwardFactor } from "./chunk-XAZWWYFZ.mjs";
import { assertIeeeMatch, withValues } from "./chunk-VGOUGUHQ.mjs";
import { saxpyReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures, runValidation } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, init, saxpy } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import { randomFloat32Array } from "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/saxpy/src/test.saxpy.js
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
  alpha: loadParam("alpha"),
  x: loadParam("x"),
  y: loadParam("y"),
};
test("saxpy validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => saxpy(a.device, a.n, a.alpha, a.x, a.incx, a.y, a.incy),
    { device },
  );
});
test("saxpy fixtures", async (t) => {
  await runFixtures(
    t,
    // node:test context
    "saxpy",
    // routine name — used in the diagnostic label
    device,
    // WebGPU device instance
    NUM_RUNS,
    // 100 random inputs
    1,
    // threshold 1 — forward error factor ≤ 1 means within one rounding of true result
    validationSpecs,
    // param specs used to generate random inputs
    async (dev, a) => saxpy(dev, a.n, a.alpha, a.x, a.incx, a.y, a.incy),
    // GPU call
    saxpyReference,
    // CPU reference
    forwardFactor,
    // |err| / (eps * |bound|) — see helpers.js
  );
});
test("saxpy edge cases", async (t) => {
  for (const c of edge_cases_default) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,
        // vector length
        alpha: c.alpha,
        // scale factor applied to x
        x: new Float32Array(c.x),
        // input vector
        incx: c.incx,
        // stride through x
        y: new Float32Array(c.y),
        // input/output vector — accumulates alpha*x
        incy: c.incy,
        // stride through y
      };
      const got = await saxpy(
        device,
        // GPU device
        a.n,
        // vector length
        a.alpha,
        // scale factor applied to x
        a.x,
        // input vector
        a.incx,
        // stride through x
        a.y,
        // input/output vector — accumulates alpha*x
        a.incy,
        // stride through y
      );
      const expected = saxpyReference(a);
      assert_default.deepEqual(got.y, expected.y);
    });
  }
});
test("saxpy zero-dimension (regression)", async () => {
  const x = randomFloat32Array(8, -1, 1, 300);
  const y = randomFloat32Array(8, -1, 1, 301);
  const before2 = y.slice();
  const got = await saxpy(device, 0, 2.5, x, 1, y, 1);
  assert_default.deepEqual(Array.from(got.y), Array.from(before2));
});
test("saxpy alpha = 0 leaves y as it is (regression)", async () => {
  const x = withValues(randomFloat32Array(6, -1, 1, 1), {
    1: Infinity,
    3: NaN,
  });
  const y = randomFloat32Array(6, -1, 1, 2);
  const a = { n: 6, alpha: 0, x, incx: 1, y, incy: 1 };
  const got = await saxpy(device, a.n, a.alpha, a.x, a.incx, y.slice(), a.incy);
  assertIeeeMatch(got.y, saxpyReference(a).y, "y", 0);
});
