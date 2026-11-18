import { cscalForwardFactor, edge_cases_default } from "./chunk-IZNC2XUJ.mjs";
import { withGpuResources } from "./chunk-KSBTCQGM.mjs";
import { cscalReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { GpuVector, cleanup, cscal, init } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference, multiDevice } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import { Complex32, Complex32Array } from "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/cscal/src/gpustorage.cscal.js
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
async function callGpuResident(dev, a) {
  return withGpuResources({ x: () => GpuVector.from(a.x) }, async ({ x }) => {
    await cscal(dev, a.n, a.alpha, x, a.incx);
    return { x: await x.read() };
  });
}
test("cscal fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,
    "cscal (GPU-resident)",
    device,
    NUM_RUNS,
    THRESHOLD,
    // same forward-error-factor bound as test.cscal.js — see its comment
    validationSpecs,
    // buildArb generates alpha/x directly from their complex32/complex32array specs
    callGpuResident,
    cscalReference,
    cscalForwardFactor,
  );
});
test(
  "cscal reports gpuTimeMs in benchmark mode (GPU-resident)",
  { skip: multiDevice },
  async () => {
    const bDevice = await init({
      powerPreference: getPowerPreference(),
      benchmark: true,
    });
    await withGpuResources(
      { x: () => GpuVector.from(bDevice, new Complex32Array([1, 1, 2, 2])) },
      async ({ x }) => {
        const result = await cscal(bDevice, 2, new Complex32(2, 0), x, 1);
        if (bDevice.features.has("timestamp-query")) {
          assert_default.equal(typeof result.gpuTimeMs, "number");
          assert_default.ok(result.gpuTimeMs >= 0);
        } else {
          assert_default.equal(result.gpuTimeMs, void 0);
        }
      },
    );
  },
);
test("cscal returns {} for n<=0 with a GPU-resident x", async () => {
  await withGpuResources(
    { x: () => GpuVector.from(new Complex32Array([1, 2])) },
    async ({ x }) => {
      const result = await cscal(device, 0, new Complex32(2, 0), x, 1);
      assert_default.deepEqual(result, {});
    },
  );
});
test("cscal edge cases (GPU-resident)", async (t) => {
  for (const c of edge_cases_default) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,
        alpha: new Complex32(c.alpha.re, c.alpha.im),
        x: new Complex32Array(c.x),
        incx: c.incx,
      };
      const got = await callGpuResident(device, a);
      const expected = cscalReference(a);
      assert_default.deepEqual(got.x, expected.x);
    });
  }
});
