// GPU-resident (GpuVector) coverage for sdot — same inputs and stdlib oracle
// as test.sdot.js, run through the overload where x/y stay on the GPU across
// the call. sdot's result is always a scalar readback regardless of input
// type, so no extra .read() step is needed beyond the call itself.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, GpuVector } from "wgblas";
import { sdot } from "wgblas/sdot";
import { loadParam } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { withGpuResources } from "../../helpers/gpustorage.js";
import { forwardFactor } from "../helpers.js";
import { sdotReference as stdlibReference } from "../../helpers/stdlib.js";
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
  incy:   loadParam("incy"),
  x:      loadParam("x"),
  y:      loadParam("y"),
};

async function callGpuResident(dev, a) {
  return withGpuResources(
    { x: GpuVector.from(a.x), y: GpuVector.from(a.y) },
    async ({ x, y }) => await sdot(dev, a.n, x, a.incx, y, a.incy),
  );
}

test("sdot fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,                     // node:test context
    "sdot (GPU-resident)", // routine name — used in the diagnostic label
    device,                // WebGPU device instance
    NUM_RUNS,              // 100 random inputs
    1,                     // threshold 1 — forward error factor ≤ 1 means within one rounding of true result
    validationSpecs,       // param specs used to generate random inputs
    callGpuResident,       // GPU call — wraps x and y into GpuVectors
    stdlibReference,       // CPU reference
    forwardFactor,         // |err| / (eps * |bound|) — see helpers.js
  );
});

test("sdot edge cases (GPU-resident)", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,                    // vector length
        x: new Float32Array(c.x),  // input vector
        incx: c.incx,              // stride through x
        y: new Float32Array(c.y),  // input vector
        incy: c.incy,              // stride through y
      };
      const { dot: got } = await callGpuResident(device, a);
      const expected = stdlibReference(a);
      assert.strictEqual(got, expected);
    });
  }
});
