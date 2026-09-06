// GPU-resident coverage for cscal — same inputs/oracle as test.cscal.js,
// through the overload where x stays on the GPU.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, GpuVector } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { cscal } from "wgblas/cscal";
import { loadParam } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { withGpuResources } from "../../helpers/gpustorage.js";
import { cscalReference as stdlibReference } from "../../helpers/stdlib.js";
import { cscalForwardFactor } from "../helpers.js";
import { Complex32, Complex32Array } from "../../../src/classes/Complex32.mjs";
import edgeCases from "../edge-cases.json" with { type: "json" };

const NUM_RUNS = 100;
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
  n:      loadParam("n"),
  incx:   loadParam("incx"),
  alpha:  loadParam("alphaComplex"),
  x:      loadParam("xComplex"),
};

async function callGpuResident(dev, a) {
  return withGpuResources({ x: GpuVector.from(a.x) }, async ({ x }) => {
    await cscal(dev, a.n, a.alpha, x, a.incx);
    return { x: await x.read() };
  });
}

test("cscal fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,
    "cscal (GPU-resident)",
    device,
    NUM_RUNS,
    THRESHOLD, // same forward-error-factor bound as test.cscal.js — see its comment
    validationSpecs, // buildArb generates alpha/x directly from their complex32/complex32array specs
    callGpuResident,
    stdlibReference,
    cscalForwardFactor,
  );
});

test("cscal edge cases (GPU-resident)", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,
        alpha: new Complex32(c.alpha.re, c.alpha.im),
        x: new Complex32Array(c.x),
        incx: c.incx,
      };
      const got = await callGpuResident(device, a);
      const expected = stdlibReference(a);
      assert.deepEqual(got.x, expected.x);
    });
  }
});
