import { edge_cases_default } from "./chunk-NYLGUTDG.mjs";
import { withGpuResources } from "./chunk-KSBTCQGM.mjs";
import { sasumReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures, ulpDiff } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { GpuVector, cleanup, init, sasum } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/sasum/src/gpustorage.sasum.js
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
async function callGpuResident(dev, a) {
  return withGpuResources({ x: () => GpuVector.from(a.x) }, async ({ x }) => {
    return await sasum(dev, a.n, x, a.incx);
  });
}
test("sasum fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,
    // node:test context
    "sasum (GPU-resident)",
    // routine name — used in the diagnostic label
    device,
    // WebGPU device instance
    NUM_RUNS,
    // 100 random inputs
    50,
    // threshold 50 ULP — GPU uses tree reduction, CPU is sequential; rounding order differs
    validationSpecs,
    // param specs used to generate random inputs
    callGpuResident,
    // GPU call — wraps x into a GpuVector
    sasumReference,
    // CPU reference
    (gpu, ref) => ulpDiff(gpu.asum, ref),
    // raw ULP difference between results
  );
});
test("sasum edge cases (GPU-resident)", async (t) => {
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
      const { asum: got } = await callGpuResident(device, a);
      const expected = sasumReference(a);
      assert_default.strictEqual(got, expected);
    });
  }
});
