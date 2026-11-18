import { edge_cases_default } from "./chunk-BXT3FGL2.mjs";
import { sswapReference } from "./chunk-3I5F4OKA.mjs";
import {
  loadParam,
  maxUlp,
  runFixtures,
  runValidation,
} from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, init, sswap } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import { randomFloat32Array } from "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/sswap/src/test.sswap.js
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
test("sswap validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => sswap(a.device, a.n, a.x, a.incx, a.y, a.incy),
    { device },
  );
});
test("sswap fixtures", async (t) => {
  await runFixtures(
    t,
    // node:test context
    "sswap",
    // routine name — used in the diagnostic label
    device,
    // WebGPU device instance
    NUM_RUNS,
    // 100 random inputs
    0,
    // threshold 0 — swap is exact, output must match reference bit-for-bit
    validationSpecs,
    // param specs used to generate random inputs
    async (dev, a) => sswap(dev, a.n, a.x, a.incx, a.y, a.incy),
    // GPU call
    sswapReference,
    // CPU reference
    (gpu, ref) => Math.max(maxUlp(gpu.x, ref.x).max, maxUlp(gpu.y, ref.y).max),
    // max ULP across both vectors
  );
});
test("sswap edge cases", async (t) => {
  for (const c of edge_cases_default) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,
        // vector length
        x: new Float32Array(c.x),
        // vector to swap
        incx: c.incx,
        // stride through x
        y: new Float32Array(c.y),
        // vector to swap
        incy: c.incy,
        // stride through y
      };
      const got = await sswap(
        device,
        // GPU device
        a.n,
        // vector length
        a.x,
        // vector to swap
        a.incx,
        // stride through x
        a.y,
        // vector to swap
        a.incy,
        // stride through y
      );
      const expected = sswapReference(a);
      assert_default.deepEqual(got.x, expected.x);
      assert_default.deepEqual(got.y, expected.y);
    });
  }
});
test("sswap zero-dimension (regression)", async () => {
  const x = randomFloat32Array(8, -1, 1, 300);
  const y = randomFloat32Array(8, -1, 1, 301);
  const beforeX = x.slice();
  const beforeY = y.slice();
  const got = await sswap(device, 0, x, 1, y, 1);
  assert_default.deepEqual(Array.from(got.x), Array.from(beforeX));
  assert_default.deepEqual(Array.from(got.y), Array.from(beforeY));
});
