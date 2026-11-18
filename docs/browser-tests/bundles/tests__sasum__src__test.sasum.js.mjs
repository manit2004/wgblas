import { edge_cases_default } from "./chunk-NYLGUTDG.mjs";
import { sasumReference } from "./chunk-3I5F4OKA.mjs";
import {
  loadParam,
  runFixtures,
  runValidation,
  ulpDiff,
} from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, init, sasum } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import { randomFloat32Array } from "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/sasum/src/test.sasum.js
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
  x: loadParam("x"),
};
test("sasum validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => sasum(a.device, a.n, a.x, a.incx),
    { device },
  );
});
test("sasum fixtures", async (t) => {
  await runFixtures(
    t,
    // node:test context
    "sasum",
    // routine name — used in the diagnostic label
    device,
    // WebGPU device instance
    NUM_RUNS,
    // 100 random inputs
    50,
    // threshold 50 ULP — GPU uses tree reduction, CPU is sequential; rounding order differs
    validationSpecs,
    // param specs used to generate random inputs
    async (dev, a) => sasum(dev, a.n, a.x, a.incx),
    // GPU call
    sasumReference,
    // CPU reference
    (gpu, ref) => ulpDiff(gpu.asum, ref),
    // raw ULP difference between results
  );
});
test("sasum edge cases", async (t) => {
  for (const c of edge_cases_default) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,
        // vector length
        x: new Float32Array(c.x),
        // input vector
        incx: c.incx,
        // stride through x
      };
      const { asum: got } = await sasum(
        device,
        // GPU device
        a.n,
        // vector length
        a.x,
        // input vector
        a.incx,
        // stride through x
      );
      const expected = sasumReference(a);
      assert_default.strictEqual(got, expected);
    });
  }
});
test("sasum zero-dimension (regression)", async () => {
  const x = randomFloat32Array(8, -1, 1, 300);
  const { asum: got } = await sasum(device, 0, x, 1);
  assert_default.strictEqual(got, 0);
});
