// GPU-resident (GpuVector) coverage for saxpy — same inputs and stdlib oracle
// as test.saxpy.js, run through the overload where x/y stay on the GPU across
// the call.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, GpuVector } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { saxpy } from "wgblas/saxpy";
import { loadParam } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { withGpuResources } from "../../helpers/gpustorage.js";
import { forwardFactor } from "../helpers.js";
import { saxpyReference as stdlibReference } from "../../helpers/stdlib.js";
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
  alpha:  loadParam("alpha"),
  x:      loadParam("x"),
  y:      loadParam("y"),
};

async function callGpuResident(dev, a) {
  return withGpuResources(
    { x: GpuVector.from(a.x), y: GpuVector.from(a.y) },
    async ({ x, y }) => {
      await saxpy(dev, a.n, a.alpha, x, a.incx, y, a.incy);
      return { y: await y.read() };
    },
  );
}

test("saxpy fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,                      // node:test context
    "saxpy (GPU-resident)", // routine name — used in the diagnostic label
    device,                 // WebGPU device instance
    NUM_RUNS,               // 100 random inputs
    1,                      // threshold 1 — forward error factor ≤ 1 means within one rounding of true result
    validationSpecs,        // param specs used to generate random inputs
    callGpuResident,        // GPU call — wraps x and y into GpuVectors
    stdlibReference,        // CPU reference
    forwardFactor,          // |err| / (eps * |bound|) — see helpers.js
  );
});

test("saxpy edge cases (GPU-resident)", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,                    // vector length
        alpha: c.alpha,            // scale factor applied to x
        x: new Float32Array(c.x),  // input vector
        incx: c.incx,              // stride through x
        y: new Float32Array(c.y),  // input/output vector — accumulates alpha*x
        incy: c.incy,              // stride through y
      };
      const got = await callGpuResident(device, a);
      const expected = stdlibReference(a);
      assert.deepEqual(got.y, expected.y);
    });
  }
});
