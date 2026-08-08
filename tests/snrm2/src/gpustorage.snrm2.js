// GPU-resident (GpuVector) coverage for snrm2 — same inputs and stdlib oracle
// as test.snrm2.js, run through the overload where x stays on the GPU across
// the call. snrm2's result is always a scalar readback regardless of input
// type, so no extra .read() step is needed beyond the call itself.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, GpuVector } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { snrm2 } from "wgblas/snrm2";
import { loadParam } from "../../helpers/validation.js";
import { runFixtures, ulpDiff } from "../../helpers/fixtures.js";
import { withGpuResources } from "../../helpers/gpustorage.js";
import { snrm2Reference as stdlibReference } from "../../helpers/stdlib.js";
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
    return await snrm2(dev, a.n, x, a.incx);
  });
}

test("snrm2 fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,                      // node:test context
    "snrm2 (GPU-resident)", // routine name — used in the diagnostic label
    device,                 // WebGPU device instance
    NUM_RUNS,               // 100 random inputs
    50,                     // threshold 50 ULP — GPU uses tree reduction, CPU is sequential; rounding order differs
    validationSpecs,        // param specs used to generate random inputs
    callGpuResident,        // GPU call — wraps x into a GpuVector
    stdlibReference,        // CPU reference
    (gpu, ref) => ulpDiff(gpu.nrm2, ref), // raw ULP difference between scalar results
  );
});

test("snrm2 edge cases (GPU-resident)", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,                    // vector length
        x: new Float32Array(c.x),  // input vector
        incx: c.incx,              // stride through x
      };
      const { nrm2: got } = await callGpuResident(device, a);
      const expected = stdlibReference(a);
      assert.strictEqual(got, expected);
    });
  }
});
