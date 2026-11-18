import { edge_cases_default, forwardFactor } from "./chunk-WF3S3BSE.mjs";
import { withGpuResources } from "./chunk-KSBTCQGM.mjs";
import { dnrm2Reference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { GpuVector, cleanup, dnrm2, init } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/dnrm2/src/gpustorage.dnrm2.js
var NUM_RUNS = 100;
var THRESHOLD = 10;
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
  x: loadParam("x64"),
};
var fixtureSpecs = {
  ...validationSpecs,
  n: { ...validationSpecs.n, range: { min: 1, max: 50 } },
};
async function callGpuResident(dev, a) {
  return withGpuResources({ x: () => GpuVector.from(a.x) }, async ({ x }) => {
    return await dnrm2(dev, a.n, x, a.incx);
  });
}
test("dnrm2 fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,
    "dnrm2 (GPU-resident)",
    device,
    NUM_RUNS,
    THRESHOLD,
    fixtureSpecs,
    callGpuResident,
    dnrm2Reference,
    (gpu, ref) => forwardFactor(gpu, ref),
  );
});
test("dnrm2 edge cases (GPU-resident)", async (t) => {
  for (const c of edge_cases_default) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,
        x: new Float64Array(c.x),
        incx: c.incx,
      };
      const got = await callGpuResident(device, a);
      const expected = dnrm2Reference(a);
      const factor = forwardFactor(got, expected);
      assert_default.ok(
        factor <= THRESHOLD,
        `${c.label}: got ${got.nrm2}, expected ${expected} (forward factor ${factor} > ${THRESHOLD})`,
      );
    });
  }
});
