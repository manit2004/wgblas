// GPU-resident (GpuVector) coverage for dnrm2 — same inputs and stdlib
// oracle as test.dnrm2.js, run through the overload where x stays on the
// GPU across the call. dnrm2's result is always a scalar readback
// regardless of input type, so no extra .read() step is needed beyond the
// call itself.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, GpuVector } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { dnrm2 } from "wgblas/dnrm2";
import { loadParam } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { withGpuResources } from "../../helpers/gpustorage.js";
import { forwardFactor } from "../helpers.js";
import { dnrm2Reference as stdlibReference } from "../../helpers/stdlib.js";
import edgeCases from "../edge-cases.json" with { type: "json" };

const NUM_RUNS = 100;
// Same cap as test.dnrm2.js — see the comment there.
const THRESHOLD = 10;

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
  x: loadParam("x64"),
};

const fixtureSpecs = {
  ...validationSpecs,
  n: { ...validationSpecs.n, range: { min: 1, max: 50 } },
};

async function callGpuResident(dev, a) {
  return withGpuResources({ x: () => GpuVector.from(a.x) }, async ({ x }) => {
    return await dnrm2(dev, a.n, x, a.incx);
  });
}

test("dnrm2 fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,
    "dnrm2 (GPU-resident)",
    device,
    NUM_RUNS,
    THRESHOLD,
    fixtureSpecs,
    callGpuResident,
    stdlibReference,
    (gpu, ref) => forwardFactor(gpu, ref),
  );
});

test("dnrm2 edge cases (GPU-resident)", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,
        x: new Float64Array(c.x),
        incx: c.incx,
      };
      const got = await callGpuResident(device, a);
      const expected = stdlibReference(a);
      const factor = forwardFactor(got, expected);
      assert.ok(
        factor <= THRESHOLD,
        `${c.label}: got ${got.nrm2}, expected ${expected} (forward factor ${factor} > ${THRESHOLD})`,
      );
    });
  }
});
