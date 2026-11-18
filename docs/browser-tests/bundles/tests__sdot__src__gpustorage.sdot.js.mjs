import { edge_cases_default, forwardFactor } from "./chunk-BNA5U2A2.mjs";
import { withGpuResources } from "./chunk-KSBTCQGM.mjs";
import { sdotReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { GpuVector, cleanup, init, sdot } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/sdot/src/gpustorage.sdot.js
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
  incy: loadParam("incy"),
  x: loadParam("x"),
  y: loadParam("y"),
};
async function callGpuResident(dev, a) {
  return withGpuResources(
    { x: () => GpuVector.from(a.x), y: () => GpuVector.from(a.y) },
    async ({ x, y }) => await sdot(dev, a.n, x, a.incx, y, a.incy),
  );
}
test("sdot fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,
    // node:test context
    "sdot (GPU-resident)",
    // routine name — used in the diagnostic label
    device,
    // WebGPU device instance
    NUM_RUNS,
    // 100 random inputs
    1,
    // threshold 1 — forward error factor ≤ 1 means within one rounding of true result
    validationSpecs,
    // param specs used to generate random inputs
    callGpuResident,
    // GPU call — wraps x and y into GpuVectors
    sdotReference,
    // CPU reference
    forwardFactor,
    // |err| / (eps * |bound|) — see helpers.js
  );
});
test("sdot edge cases (GPU-resident)", async (t) => {
  for (const c of edge_cases_default) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,
        // vector length
        x: new Float32Array(c.x),
        // input vector
        incx: c.incx,
        // stride through x
        y: new Float32Array(c.y),
        // input vector
        incy: c.incy,
        // stride through y
      };
      const { dot: got } = await callGpuResident(device, a);
      const expected = sdotReference(a);
      assert_default.strictEqual(got, expected);
    });
  }
});
