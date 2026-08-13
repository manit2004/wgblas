// GPU-resident (GpuVector) coverage for sswap — same inputs and stdlib oracle
// as test.sswap.js, run through the overload where x/y stay on the GPU across
// the call.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, GpuVector } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { sswap } from "wgblas/sswap";
import { loadParam } from "../../helpers/validation.js";
import { runFixtures, maxUlp } from "../../helpers/fixtures.js";
import { withGpuResources } from "../../helpers/gpustorage.js";
import { sswapReference as stdlibReference } from "../../helpers/stdlib.js";
import edgeCases from "../edge-cases.json" with { type: "json" };

const NUM_RUNS = 100;

let device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => {
  cleanup();
});

const validationSpecs = {
  device: loadParam("device"),
  n:      loadParam("n"),
  incx:   loadParam("incx"),
  incy:   loadParam("incy"),
  x:      loadParam("x"),
  y:      loadParam("y"),
};

async function callGpuResident(dev, a) {
  return withGpuResources(
    { x: GpuVector.from(a.x), y: GpuVector.from(a.y) },
    async ({ x, y }) => {
      await sswap(dev, a.n, x, a.incx, y, a.incy);
      const [xOut, yOut] = await Promise.all([x.read(), y.read()]);
      return { x: xOut, y: yOut };
    },
  );
}

test("sswap fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,                      // node:test context
    "sswap (GPU-resident)", // routine name — used in the diagnostic label
    device,                 // WebGPU device instance
    NUM_RUNS,               // 100 random inputs
    0,                      // threshold 0 — swap is exact, output must match reference bit-for-bit
    validationSpecs,        // param specs used to generate random inputs
    callGpuResident,        // GPU call — wraps x and y into GpuVectors
    stdlibReference,        // CPU reference
    (gpu, ref) => Math.max(maxUlp(gpu.x, ref.x).max, maxUlp(gpu.y, ref.y).max), // max ULP across both vectors
  );
});

test("sswap edge cases (GPU-resident)", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,                    // vector length
        x: new Float32Array(c.x),  // vector to swap
        incx: c.incx,              // stride through x
        y: new Float32Array(c.y),  // vector to swap
        incy: c.incy,              // stride through y
      };
      const got = await callGpuResident(device, a);
      const expected = stdlibReference(a);
      assert.deepEqual(got.x, expected.x);
      assert.deepEqual(got.y, expected.y);
    });
  }
});
