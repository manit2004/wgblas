// GPU-resident (GpuVector) coverage for isamax — same inputs and stdlib
// oracle as test.isamax.js, run through the overload where x stays on the GPU
// across the call. isamax's result is always a scalar readback regardless of
// input type, so no extra .read() step is needed beyond the call itself.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, GpuVector } from "wgblas";
import { isamax } from "wgblas/isamax";
import { loadParam } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { withGpuResources } from "../../helpers/gpustorage.js";
import { isamaxReference as stdlibReference } from "../../helpers/stdlib.js";
import edgeCases from "../edge-cases.json" with { type: "json" };

const NUM_RUNS = 100;

let device;
before(async () => {
  device = await init();
});
after(() => {
  cleanup();
});

const validationSpecs = {
  device: loadParam("device"),
  n:      loadParam("n"),
  incx:   loadParam("incx"),
  x:      loadParam("x"),
};

async function callGpuResident(dev, a) {
  return withGpuResources({ x: GpuVector.from(a.x) }, async ({ x }) => {
    return await isamax(dev, a.n, x, a.incx);
  });
}

test("isamax fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,                       // node:test context
    "isamax (GPU-resident)", // routine name — used in the diagnostic label
    device,                  // WebGPU device instance
    NUM_RUNS,                // 100 random inputs
    0,                       // threshold 0 — index must match exactly.
    validationSpecs,         // param specs used to generate random inputs
    callGpuResident,         // GPU call — wraps x into a GpuVector
    stdlibReference,         // CPU reference
    (gpu, ref) => (gpu.index === ref ? 0 : 1), // 0 if correct, 1 if wrong
  );
});

test("isamax edge cases (GPU-resident)", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,                    // vector length
        x: new Float32Array(c.x),  // input vector
        incx: c.incx,              // stride through x
      };
      const { index: got } = await callGpuResident(device, a);
      const expected = stdlibReference(a);
      assert.strictEqual(got, expected);
    });
  }
});
