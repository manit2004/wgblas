import { cscalForwardFactor, edge_cases_default } from "./chunk-IZNC2XUJ.mjs";
import { cscalReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures, runValidation } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, cscal, init } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference, multiDevice } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import { randomFloat32Array } from "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import { Complex32, Complex32Array } from "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/cscal/src/test.cscal.js
var NUM_RUNS = 100;
var THRESHOLD = 1;
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
  alpha: loadParam("alphaComplex"),
  x: loadParam("xComplex"),
};
test("cscal validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => cscal(a.device, a.n, a.alpha, a.x, a.incx),
    { device },
  );
});
test(
  "cscal reports gpuTimeMs in benchmark mode",
  { skip: multiDevice },
  async () => {
    const bDevice = await init({
      powerPreference: getPowerPreference(),
      benchmark: true,
    });
    const result = await cscal(
      bDevice,
      2,
      new Complex32(2, 0),
      new Complex32Array([1, 1, 2, 2]),
      1,
    );
    if (bDevice.features.has("timestamp-query")) {
      assert_default.equal(typeof result.gpuTimeMs, "number");
      assert_default.ok(result.gpuTimeMs >= 0);
    } else {
      assert_default.equal(result.gpuTimeMs, void 0);
    }
  },
);
test("cscal fixtures", async (t) => {
  await runFixtures(
    t,
    "cscal",
    device,
    NUM_RUNS,
    THRESHOLD,
    validationSpecs,
    // buildArb generates alpha/x directly from their complex32/complex32array specs
    async (dev, a) => cscal(dev, a.n, a.alpha, a.x, a.incx),
    cscalReference,
    cscalForwardFactor,
  );
});
test("cscal edge cases", async (t) => {
  for (const c of edge_cases_default) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,
        alpha: new Complex32(c.alpha.re, c.alpha.im),
        x: new Complex32Array(c.x),
        incx: c.incx,
      };
      const got = await cscal(device, a.n, a.alpha, a.x, a.incx);
      const expected = cscalReference(a);
      assert_default.deepEqual(got.x, expected.x);
    });
  }
});
test("cscal zero-dimension (regression)", async () => {
  const re = randomFloat32Array(8, -1, 1, 300);
  const im = randomFloat32Array(8, -1, 1, 301);
  const interleaved = [];
  for (let i = 0; i < re.length; i++) interleaved.push(re[i], im[i]);
  const x = new Complex32Array(interleaved);
  const before2 = Array.from(x, (z) => new Complex32(z.re, z.im));
  const got = await cscal(device, 0, new Complex32(2, -3), x, 1);
  assert_default.deepEqual(Array.from(got.x), before2);
});
