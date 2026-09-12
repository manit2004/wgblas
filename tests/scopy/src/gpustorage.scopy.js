// GPU-resident (GpuVector) coverage for scopy — same inputs and stdlib oracle
// as test.scopy.js, run through the overload where x/y stay on the GPU across
// the call.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, GpuVector } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { scopy } from "wgblas/scopy";
import { loadParam } from "../../helpers/validation.js";
import { runFixtures, maxUlp } from "../../helpers/fixtures.js";
import { withGpuResources } from "../../helpers/gpustorage.js";
import { scopyReference as stdlibReference } from "../../helpers/stdlib.js";
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
      await scopy(dev, a.n, x, a.incx, y, a.incy);
      return { y: await y.read() };
    },
  );
}

test("scopy fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t, // node:test context
    "scopy (GPU-resident)", // routine name — used in the diagnostic label
    device, // WebGPU device instance
    NUM_RUNS, // 100 random inputs
    0, // threshold 0 — scopy is exact, output must match reference bit-for-bit
    validationSpecs, // param specs used to generate random inputs
    callGpuResident, // GPU call — wraps x and y into GpuVectors
    stdlibReference, // CPU reference
    (gpu, ref) => maxUlp(gpu.y, ref.y).max, // max ULP across all elements of y
  );
});

// callGpuResident always reads y back itself regardless of what scopy()
// returned, so it can't see scopy's own n<=0 return value — this calls scopy
// directly to check the GPU-resident early return actually is `{}` (never
// exercised by the fixtures/edge-case tests above, which never pass n<=0).
test("scopy returns {} for n<=0 with a GPU-resident y", async () => {
  await withGpuResources(
    {
      x: () => GpuVector.from(new Float32Array([1, 2])),
      y: () => GpuVector.from(new Float32Array([3, 4])),
    },
    async ({ x, y }) => {
      const result = await scopy(device, 0, x, 1, y, 1);
      assert.deepEqual(result, {});
    },
  );
});

test("scopy edge cases (GPU-resident)", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n, // vector length
        x: new Float32Array(c.x), // source vector
        incx: c.incx, // stride through x
        y: new Float32Array(c.y), // destination vector — overwritten with x
        incy: c.incy, // stride through y
      };
      const got = await callGpuResident(device, a);
      const expected = stdlibReference(a);
      assert.deepEqual(got.y, expected.y);
    });
  }
});
