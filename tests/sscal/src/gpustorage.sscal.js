// GPU-resident (GpuVector) coverage for sscal — same inputs and stdlib oracle
// as test.sscal.js, run through the overload where x stays on the GPU across
// the call.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, GpuVector } from "wgblas";
import { sscal } from "wgblas/sscal";
import { loadParam } from "../../helpers/validation.js";
import { runFixtures, maxUlp } from "../../helpers/fixtures.js";
import { withGpuResources } from "../../helpers/gpustorage.js";
import { sscalReference as stdlibReference } from "../../helpers/stdlib.js";
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
  alpha:  loadParam("alpha"),
  x:      loadParam("x"),
};

async function callGpuResident(dev, a) {
  return withGpuResources({ x: GpuVector.from(a.x) }, async ({ x }) => {
    await sscal(dev, a.n, a.alpha, x, a.incx);
    return await x.read();
  });
}

test("sscal fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,                      // node:test context
    "sscal (GPU-resident)", // routine name — used in the diagnostic label
    device,                 // WebGPU device instance
    NUM_RUNS,               // 100 random inputs
    0,                      // threshold 0 — scalar multiply is exact at f32, output must match bit-for-bit
    validationSpecs,        // param specs used to generate random inputs
    callGpuResident,        // GPU call — wraps x into a GpuVector
    stdlibReference,        // CPU reference
    (gpu, ref) => maxUlp(gpu, ref).max, // max ULP across all elements of x
  );
});

test("sscal edge cases (GPU-resident)", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,                    // vector length
        alpha: c.alpha,            // scale factor
        x: new Float32Array(c.x),  // vector to scale
        incx: c.incx,              // stride through x
      };
      const got = await callGpuResident(device, a);
      const expected = stdlibReference(a);
      assert.deepEqual(got, expected);
    });
  }
});
