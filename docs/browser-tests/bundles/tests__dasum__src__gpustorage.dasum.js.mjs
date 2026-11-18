import { edge_cases_default } from "./chunk-JQ6QN5BY.mjs";
import { withGpuResources } from "./chunk-KSBTCQGM.mjs";
import { dasumReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures, ulpDiff64 } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { GpuVector, cleanup, dasum, init } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/dasum/src/gpustorage.dasum.js
var NUM_RUNS = 100;
var THRESHOLD = 64;
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
    return await dasum(dev, a.n, x, a.incx);
  });
}
test("dasum fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,
    // node:test context
    "dasum (GPU-resident)",
    // routine name — used in the diagnostic label
    device,
    // WebGPU device instance
    NUM_RUNS,
    // 100 random inputs
    THRESHOLD,
    // max allowed f64 ULP difference
    fixtureSpecs,
    // param specs used to generate random inputs
    callGpuResident,
    // GPU call — wraps x into a GpuVector
    dasumReference,
    // CPU reference
    (gpu, ref) => ulpDiff64(gpu.asum, ref),
    // raw f64 ULP difference between results
  );
});
test("dasum edge cases (GPU-resident)", async (t) => {
  for (const c of edge_cases_default) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,
        // vector length
        x: new Float64Array(c.x),
        // input vector
        incx: c.incx,
        // stride through x
      };
      const { asum: got } = await callGpuResident(device, a);
      const expected = dasumReference(a);
      assert_default.ok(
        ulpDiff64(got, expected) <= THRESHOLD,
        `${c.label}: got ${got}, expected ${expected} (ULP diff ${ulpDiff64(got, expected)} > ${THRESHOLD})`,
      );
    });
  }
});
