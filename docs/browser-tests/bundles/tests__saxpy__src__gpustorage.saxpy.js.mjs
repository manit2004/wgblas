import { edge_cases_default, forwardFactor } from "./chunk-XAZWWYFZ.mjs";
import { withGpuResources } from "./chunk-KSBTCQGM.mjs";
import { saxpyReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { GpuVector, cleanup, init, saxpy } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/saxpy/src/gpustorage.saxpy.js
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
  alpha: loadParam("alpha"),
  x: loadParam("x"),
  y: loadParam("y"),
};
async function callGpuResident(dev, a) {
  return withGpuResources(
    { x: () => GpuVector.from(a.x), y: () => GpuVector.from(a.y) },
    async ({ x, y }) => {
      await saxpy(dev, a.n, a.alpha, x, a.incx, y, a.incy);
      return { y: await y.read() };
    },
  );
}
test("saxpy fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,
    // node:test context
    "saxpy (GPU-resident)",
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
    saxpyReference,
    // CPU reference
    forwardFactor,
    // |err| / (eps * |bound|) — see helpers.js
  );
});
test("saxpy returns {} for n<=0 with a GPU-resident y", async () => {
  await withGpuResources(
    {
      x: () => GpuVector.from(new Float32Array([1, 2])),
      y: () => GpuVector.from(new Float32Array([3, 4])),
    },
    async ({ x, y }) => {
      const result = await saxpy(device, 0, 2, x, 1, y, 1);
      assert_default.deepEqual(result, {});
    },
  );
});
test("saxpy edge cases (GPU-resident)", async (t) => {
  for (const c of edge_cases_default) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,
        // vector length
        alpha: c.alpha,
        // scale factor applied to x
        x: new Float32Array(c.x),
        // input vector
        incx: c.incx,
        // stride through x
        y: new Float32Array(c.y),
        // input/output vector — accumulates alpha*x
        incy: c.incy,
        // stride through y
      };
      const got = await callGpuResident(device, a);
      const expected = saxpyReference(a);
      assert_default.deepEqual(got.y, expected.y);
    });
  }
});
