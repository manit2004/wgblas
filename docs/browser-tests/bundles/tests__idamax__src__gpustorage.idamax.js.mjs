import { edge_cases_default } from "./chunk-DKLOUELP.mjs";
import { withGpuResources } from "./chunk-KSBTCQGM.mjs";
import { idamaxReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { GpuVector, cleanup, idamax, init } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/idamax/src/gpustorage.idamax.js
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
  x: loadParam("x64"),
};
async function callGpuResident(dev, a) {
  return withGpuResources({ x: () => GpuVector.from(a.x) }, async ({ x }) => {
    return await idamax(dev, a.n, x, a.incx);
  });
}
test("idamax fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,
    // node:test context
    "idamax (GPU-resident)",
    // routine name — used in the diagnostic label
    device,
    // WebGPU device instance
    NUM_RUNS,
    // 100 random inputs
    0,
    // threshold 0 — index must match exactly.
    validationSpecs,
    // param specs used to generate random inputs
    callGpuResident,
    // GPU call — wraps x into a GpuVector
    idamaxReference,
    // CPU reference
    (gpu, ref) => (gpu.index === ref ? 0 : 1),
    // 0 if correct, 1 if wrong
  );
});
test("idamax edge cases (GPU-resident)", async (t) => {
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
      const { index: got } = await callGpuResident(device, a);
      const expected = idamaxReference(a);
      assert_default.strictEqual(got, expected);
    });
  }
});
