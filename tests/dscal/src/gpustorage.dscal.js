// GPU-resident coverage for dscal — same inputs/oracle as test.dscal.js,
// through the overload where x stays on the GPU.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, GpuVector } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { dscal } from "wgblas/dscal";
import { loadParam } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { withGpuResources } from "../../helpers/gpustorage.js";
import { dscalReference as stdlibReference } from "../../helpers/stdlib.js";
// See test.dscal.js for why this uses forwardFactor instead of raw ULP64.
import { forwardFactor } from "../helpers.js";
import edgeCases from "../edge-cases.json" with { type: "json" };

const NUM_RUNS = 100;
// Same per-adapter cap as test.dscal.js — see the comment there.
const THRESHOLDS = {
  "high-performance": 5,
  "low-power": 10000,
};
const THRESHOLD = THRESHOLDS[getPowerPreference()];

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
  alpha:  loadParam("alpha64"),
  x:      loadParam("x64"),
};

const fixtureSpecs = { ...validationSpecs, n: { ...validationSpecs.n, range: { min: 1, max: 50 } } };

async function callGpuResident(dev, a) {
  return withGpuResources({ x: GpuVector.from(a.x) }, async ({ x }) => {
    await dscal(dev, a.n, a.alpha, x, a.incx);
    return { x: await x.read() };
  });
}

test("dscal fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,
    "dscal (GPU-resident)",
    device,
    NUM_RUNS,
    THRESHOLD,
    fixtureSpecs,
    callGpuResident,
    stdlibReference,
    forwardFactor,
  );
});

test("dscal edge cases (GPU-resident)", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,
        alpha: c.alpha,
        x: new Float64Array(c.x),
        incx: c.incx,
      };
      const got = await callGpuResident(device, a);
      const expected = stdlibReference(a);
      const factor = forwardFactor(got, expected, a);
      assert.ok(
        factor <= THRESHOLD,
        `${c.label}: got ${got.x}, expected ${expected.x} (forward factor ${factor} > ${THRESHOLD})`,
      );
    });
  }
});
