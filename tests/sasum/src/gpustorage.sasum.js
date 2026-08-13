// GPU-resident (GpuVector) coverage for sasum — same inputs and stdlib oracle
// as test.sasum.js, run through the overload where x stays on the GPU across
// the call. sasum's result is always a scalar readback regardless of input
// type, so no extra .read() step is needed beyond the call itself.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, GpuVector } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { sasum } from "wgblas/sasum";
import { loadParam } from "../../helpers/validation.js";
import { runFixtures, ulpDiff } from "../../helpers/fixtures.js";
import { withGpuResources } from "../../helpers/gpustorage.js";
import { sasumReference as stdlibReference } from "../../helpers/stdlib.js";
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
  x:      loadParam("x"),
};

async function callGpuResident(dev, a) {
  return withGpuResources({ x: GpuVector.from(a.x) }, async ({ x }) => {
    return await sasum(dev, a.n, x, a.incx);
  });
}

test("sasum fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,                      // node:test context
    "sasum (GPU-resident)", // routine name — used in the diagnostic label
    device,                 // WebGPU device instance
    NUM_RUNS,               // 100 random inputs
    50,                     // threshold 50 ULP — GPU uses tree reduction, CPU is sequential; rounding order differs
    validationSpecs,        // param specs used to generate random inputs
    callGpuResident,        // GPU call — wraps x into a GpuVector
    stdlibReference,        // CPU reference
    (gpu, ref) => ulpDiff(gpu.asum, ref), // raw ULP difference between results
  );
});

test("sasum edge cases (GPU-resident)", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,                    // vector length
        x: new Float32Array(c.x),  // input vector
        incx: c.incx,              // stride through x
      };
      const { asum: got } = await callGpuResident(device, a);
      const expected = stdlibReference(a);
      assert.strictEqual(got, expected);
    });
  }
});
