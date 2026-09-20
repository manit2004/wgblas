// GPU-resident (GpuVector) coverage for ddot — same inputs and stdlib oracle
// as test.ddot.js, run through the overload where x and y stay on the GPU
// across the call. ddot's result is always a scalar readback regardless of
// input type, so no extra .read() step is needed beyond the call itself.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, GpuVector } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { ddot } from "wgblas/ddot";
import { loadParam } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { withGpuResources } from "../../helpers/gpustorage.js";
import { forwardFactor } from "../helpers.js";
import { ddotReference as stdlibReference } from "../../helpers/stdlib.js";
import edgeCases from "../edge-cases.json" with { type: "json" };

const NUM_RUNS = 100;
// Same cap as test.ddot.js — see the comment there.
const THRESHOLD = 1;

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
  x: loadParam("x64"),
  y: loadParam("y64"),
};

// Cap n for fixtures — validationSpecs allows up to 1000, which makes property tests slow.
const fixtureSpecs = {
  ...validationSpecs,
  n: { ...validationSpecs.n, range: { min: 1, max: 50 } },
};

async function callGpuResident(dev, a) {
  return withGpuResources(
    { x: () => GpuVector.from(a.x), y: () => GpuVector.from(a.y) },
    async ({ x, y }) => {
      return await ddot(dev, a.n, x, a.incx, y, a.incy);
    },
  );
}

test("ddot fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t, // node:test context
    "ddot (GPU-resident)", // routine name — used in the diagnostic label
    device, // WebGPU device instance
    NUM_RUNS, // 100 random inputs
    THRESHOLD, // threshold — forward error factor
    fixtureSpecs, // param specs used to generate random inputs
    callGpuResident, // GPU call — wraps x and y into GpuVectors
    stdlibReference, // CPU reference
    forwardFactor, // |err| / (n * eps * sum|x_i*y_i|) — see helpers.js
  );
});

test("ddot edge cases (GPU-resident)", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n, // vector length
        x: new Float64Array(c.x), // input vector
        incx: c.incx, // stride through x
        y: new Float64Array(c.y), // input vector
        incy: c.incy, // stride through y
      };
      const got = await callGpuResident(device, a);
      const expected = stdlibReference(a);
      const factor = forwardFactor(got, expected, a);
      assert.ok(
        factor <= THRESHOLD,
        `${c.label}: got ${got.dot}, expected ${expected} (forward factor ${factor} > ${THRESHOLD})`,
      );
    });
  }
});
