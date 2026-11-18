import { edge_cases_default } from "./chunk-2JTZMLKY.mjs";
import { withValues } from "./chunk-VGOUGUHQ.mjs";
import { sscalReference } from "./chunk-3I5F4OKA.mjs";
import {
  loadParam,
  maxUlp,
  runFixtures,
  runValidation,
} from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, init, sscal } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import { randomFloat32Array } from "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/sscal/src/test.sscal.js
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
  alpha: loadParam("alpha"),
  x: loadParam("x"),
};
test("sscal validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => sscal(a.device, a.n, a.alpha, a.x, a.incx),
    { device },
  );
});
test("sscal fixtures", async (t) => {
  await runFixtures(
    t,
    // node:test context
    "sscal",
    // routine name — used in the diagnostic label
    device,
    // WebGPU device instance
    NUM_RUNS,
    // 100 random inputs
    0,
    // threshold 0 — scalar multiply is exact at f32, output must match bit-for-bit
    validationSpecs,
    // param specs used to generate random inputs
    async (dev, a) => sscal(dev, a.n, a.alpha, a.x, a.incx),
    // GPU call
    sscalReference,
    // CPU reference
    (gpu, ref) => maxUlp(gpu.x, ref.x).max,
    // max ULP across all elements of x
  );
});
test("sscal edge cases", async (t) => {
  for (const c of edge_cases_default) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,
        // vector length
        alpha: c.alpha,
        // scale factor
        x: new Float32Array(c.x),
        // vector to scale
        incx: c.incx,
        // stride through x
      };
      const got = await sscal(
        device,
        // GPU device
        a.n,
        // vector length
        a.alpha,
        // scale factor
        a.x,
        // vector to scale
        a.incx,
        // stride through x
      );
      const expected = sscalReference(a);
      assert_default.deepEqual(got.x, expected.x);
    });
  }
});
test("sscal zero-dimension (regression)", async () => {
  const x = randomFloat32Array(8, -1, 1, 300);
  const before2 = x.slice();
  const got = await sscal(device, 0, 2.5, x, 1);
  assert_default.deepEqual(Array.from(got.x), Array.from(before2));
});
test("sscal alpha = 1 leaves x as it is (regression)", async () => {
  const x = withValues(randomFloat32Array(6, -1, 1, 1), { 1: NaN, 2: -0 });
  const want = x.slice();
  const got = await sscal(device, 6, 1, x, 1);
  assert_default.equal(got.x, x);
  for (let i = 0; i < 6; i++)
    assert_default.ok(Object.is(got.x[i], want[i]), `x[${i}]`);
});
