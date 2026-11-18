import { edge_cases_default } from "./chunk-BXT3FGL2.mjs";
import { withGpuResources } from "./chunk-KSBTCQGM.mjs";
import { sswapReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, maxUlp, runFixtures } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { GpuVector, cleanup, init, sswap } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/sswap/src/gpustorage.sswap.js
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
    async ({ x, y }) => {
      await sswap(dev, a.n, x, a.incx, y, a.incy);
      const [xOut, yOut] = await Promise.all([x.read(), y.read()]);
      return { x: xOut, y: yOut };
    },
  );
}
test("sswap fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,
    // node:test context
    "sswap (GPU-resident)",
    // routine name — used in the diagnostic label
    device,
    // WebGPU device instance
    NUM_RUNS,
    // 100 random inputs
    0,
    // threshold 0 — swap is exact, output must match reference bit-for-bit
    validationSpecs,
    // param specs used to generate random inputs
    callGpuResident,
    // GPU call — wraps x and y into GpuVectors
    sswapReference,
    // CPU reference
    (gpu, ref) => Math.max(maxUlp(gpu.x, ref.x).max, maxUlp(gpu.y, ref.y).max),
    // max ULP across both vectors
  );
});
test("sswap returns {} for n<=0 with a GPU-resident x/y", async () => {
  await withGpuResources(
    {
      x: () => GpuVector.from(new Float32Array([1, 2])),
      y: () => GpuVector.from(new Float32Array([3, 4])),
    },
    async ({ x, y }) => {
      const result = await sswap(device, 0, x, 1, y, 1);
      assert_default.deepEqual(result, {});
    },
  );
});
test("sswap edge cases (GPU-resident)", async (t) => {
  for (const c of edge_cases_default) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,
        // vector length
        x: new Float32Array(c.x),
        // vector to swap
        incx: c.incx,
        // stride through x
        y: new Float32Array(c.y),
        // vector to swap
        incy: c.incy,
        // stride through y
      };
      const got = await callGpuResident(device, a);
      const expected = sswapReference(a);
      assert_default.deepEqual(got.x, expected.x);
      assert_default.deepEqual(got.y, expected.y);
    });
  }
});
