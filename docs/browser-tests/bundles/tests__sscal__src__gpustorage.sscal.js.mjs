import { edge_cases_default } from "./chunk-2JTZMLKY.mjs";
import { withGpuResources } from "./chunk-KSBTCQGM.mjs";
import { sscalReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, maxUlp, runFixtures } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { GpuVector, cleanup, init, sscal } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/sscal/src/gpustorage.sscal.js
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
async function callGpuResident(dev, a) {
  return withGpuResources({ x: () => GpuVector.from(a.x) }, async ({ x }) => {
    await sscal(dev, a.n, a.alpha, x, a.incx);
    return { x: await x.read() };
  });
}
test("sscal fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,
    // node:test context
    "sscal (GPU-resident)",
    // routine name — used in the diagnostic label
    device,
    // WebGPU device instance
    NUM_RUNS,
    // 100 random inputs
    0,
    // threshold 0 — scalar multiply is exact at f32, output must match bit-for-bit
    validationSpecs,
    // param specs used to generate random inputs
    callGpuResident,
    // GPU call — wraps x into a GpuVector
    sscalReference,
    // CPU reference
    (gpu, ref) => maxUlp(gpu.x, ref.x).max,
    // max ULP across all elements of x
  );
});
test("sscal returns {} for n<=0 with a GPU-resident x", async () => {
  await withGpuResources(
    { x: () => GpuVector.from(new Float32Array([1, 2])) },
    async ({ x }) => {
      const result = await sscal(device, 0, 2, x, 1);
      assert_default.deepEqual(result, {});
    },
  );
});
test("sscal edge cases (GPU-resident)", async (t) => {
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
      const got = await callGpuResident(device, a);
      const expected = sscalReference(a);
      assert_default.deepEqual(got.x, expected.x);
    });
  }
});
