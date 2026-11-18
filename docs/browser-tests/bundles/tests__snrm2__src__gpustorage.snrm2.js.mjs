import { edge_cases_default } from "./chunk-2E5YOZ4J.mjs";
import { withGpuResources } from "./chunk-KSBTCQGM.mjs";
import { snrm2Reference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures, ulpDiff } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { GpuVector, cleanup, init, snrm2 } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/snrm2/src/gpustorage.snrm2.js
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
    return await snrm2(dev, a.n, x, a.incx);
  });
}
test("snrm2 fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,
    // node:test context
    "snrm2 (GPU-resident)",
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
    snrm2Reference,
    // CPU reference
    (gpu, ref) => ulpDiff(gpu.nrm2, ref),
    // raw ULP difference between scalar results
  );
});
test("snrm2 edge cases (GPU-resident)", async (t) => {
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
      const { nrm2: got } = await callGpuResident(device, a);
      const expected = snrm2Reference(a);
      assert_default.strictEqual(got, expected);
    });
  }
});
