import { edge_cases_default, forwardFactor } from "./chunk-AUF5UQCO.mjs";
import { withGpuResources } from "./chunk-KSBTCQGM.mjs";
import { dscalReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { GpuVector, cleanup, dscal, init } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/dscal/src/gpustorage.dscal.js
var NUM_RUNS = 100;
var THRESHOLD = 5;
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
  alpha: loadParam("alpha64"),
  x: loadParam("x64"),
};
var fixtureSpecs = {
  ...validationSpecs,
  n: { ...validationSpecs.n, range: { min: 1, max: 50 } },
};
async function callGpuResident(dev, a) {
  return withGpuResources({ x: () => GpuVector.from(a.x) }, async ({ x }) => {
    await dscal(dev, a.n, a.alpha, x, a.incx);
    return { x: await x.read() };
  });
}
test("dscal fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,
    "dscal (GPU-resident)",
    device,
    NUM_RUNS,
    THRESHOLD,
    fixtureSpecs,
    callGpuResident,
    dscalReference,
    forwardFactor,
  );
});
test("dscal returns {} for n<=0 with a GPU-resident x", async () => {
  await withGpuResources(
    { x: () => GpuVector.from(new Float64Array([1, 2])) },
    async ({ x }) => {
      const result = await dscal(device, 0, 2, x, 1);
      assert_default.deepEqual(result, {});
    },
  );
});
test("dscal edge cases (GPU-resident)", async (t) => {
  for (const c of edge_cases_default) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,
        alpha: c.alpha,
        x: new Float64Array(c.x),
        incx: c.incx,
      };
      const got = await callGpuResident(device, a);
      const expected = dscalReference(a);
      const factor = forwardFactor(got, expected, a);
      assert_default.ok(
        factor <= THRESHOLD,
        `${c.label}: got ${got.x}, expected ${expected.x} (forward factor ${factor} > ${THRESHOLD})`,
      );
    });
  }
});
