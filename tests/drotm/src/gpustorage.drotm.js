// GPU-resident (GpuVector) coverage for drotm — same inputs and stdlib
// oracle as test.drotm.js, run through the overload where x/y stay on the
// GPU across the call. param is always a plain Float64Array (drotm.mjs
// never accepts a GpuVector for it), so only x and y are wrapped here.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, GpuVector } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { drotm } from "wgblas/drotm";
import { loadParam } from "../../helpers/validation.js";
import { runFixtures, rotmParamArb } from "../../helpers/fixtures.js";
import { withGpuResources } from "../../helpers/gpustorage.js";
import { forwardFactor } from "../helpers.js";
import { drotmReference as stdlibReference } from "../../helpers/stdlib.js";
import edgeCases from "../edge-cases.json" with { type: "json" };

const NUM_RUNS = 100;
// Same cap as test.drotm.js — see the comment there.
const THRESHOLD = 5;

const paramSpec = loadParam("param64");
const paramArb = rotmParamArb(paramSpec);

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
  param: paramSpec,
};

async function callGpuResident(dev, a) {
  return withGpuResources(
    { x: () => GpuVector.from(a.x), y: () => GpuVector.from(a.y) },
    async ({ x, y }) => {
      await drotm(dev, a.n, x, a.incx, y, a.incy, a.param);
      const [xOut, yOut] = await Promise.all([x.read(), y.read()]);
      return { x: xOut, y: yOut };
    },
  );
}

test("drotm fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,
    "drotm (GPU-resident)",
    device,
    NUM_RUNS,
    THRESHOLD,
    validationSpecs,
    callGpuResident,
    stdlibReference,
    forwardFactor,
    { param: paramArb },
  );
});

test("drotm edge cases (GPU-resident)", async (t) => {
  for (const tc of edgeCases) {
    await t.test(tc.label, async () => {
      const a = {
        n: tc.n,
        x: new Float64Array(tc.x),
        incx: tc.incx,
        y: new Float64Array(tc.y),
        incy: tc.incy,
        param: new Float64Array(tc.param),
      };
      const got = await callGpuResident(device, a);
      const expected = stdlibReference(a);
      const factor = forwardFactor(got, expected, a);
      assert.ok(
        factor <= THRESHOLD,
        `${tc.label}: got x=${got.x}, y=${got.y}, expected x=${expected.x}, y=${expected.y} (forward factor ${factor} > ${THRESHOLD})`,
      );
    });
  }
});
