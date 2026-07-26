// GPU-resident (GpuVector) coverage for dasum — same inputs and stdlib oracle
// as test.dasum.js, run through the overload where x stays on the GPU across
// the call. dasum's result is always a scalar readback regardless of input
// type, so no extra .read() step is needed beyond the call itself.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, GpuVector } from "wgblas";
import { dasum } from "wgblas/dasum";
import { loadParam } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { withGpuResources } from "../../helpers/gpustorage.js";
import { dasumReference as stdlibReference } from "../../helpers/stdlib.js";
import { ulpDiff64 } from "../../helpers/ulp.js";
import edgeCases from "../edge-cases.json" with { type: "json" };

const NUM_RUNS = 100;
const THRESHOLD = 10;

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
  x:      loadParam("x64"),
};

// Cap n for fixtures — validationSpecs allows up to 1000, which makes property tests slow.
const fixtureSpecs = { ...validationSpecs, n: { ...validationSpecs.n, range: { min: 1, max: 50 } } };

async function callGpuResident(dev, a) {
  return withGpuResources({ x: GpuVector.from(a.x) }, async ({ x }) => {
    return await dasum(dev, a.n, x, a.incx);
  });
}

test("dasum fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,                      // node:test context
    "dasum (GPU-resident)", // routine name — used in the diagnostic label
    device,                 // WebGPU device instance
    NUM_RUNS,               // 100 random inputs
    THRESHOLD,              // max allowed f64 ULP difference
    fixtureSpecs,           // param specs used to generate random inputs
    callGpuResident,        // GPU call — wraps x into a GpuVector
    stdlibReference,        // CPU reference
    (gpu, ref) => ulpDiff64(gpu.asum, ref),       // raw f64 ULP difference between results
  );
});

test("dasum edge cases (GPU-resident)", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,                    // vector length
        x: new Float64Array(c.x),  // input vector
        incx: c.incx,              // stride through x
      };
      const { asum: got } = await callGpuResident(device, a);
      const expected = stdlibReference(a);
      assert.strictEqual(got, expected);
    });
  }
});
