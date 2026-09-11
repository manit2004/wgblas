import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { dscal } from "wgblas/dscal";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
// Raw ULP64 against stdlib is the wrong oracle here — same reason as ddot's
// test file (see tests/ddot/src/test.ddot.js): double-double is ~48 bits, not
// f64's 53, so small magnitudes blow up the ULP count despite tiny relative
// error. Fixtures use the forward error factor instead — see helpers.js.
import { forwardFactor } from "../helpers.js";
import { dscalReference as stdlibReference } from "../../helpers/stdlib.js";
import edgeCases from "../edge-cases.json" with { type: "json" };

const NUM_RUNS = 100;
// Forward-error cap per adapter, same shape as ddot's (see test.ddot.js).
// Worst over 1200 runs: 2.97 on NVIDIA, 9009 on Intel, heavy tail either way —
// one shared cap would have to clear Intel's tail and stop testing NVIDIA.
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

// alpha64/x64 derive a genuine float64 scalar / Float64Array from
// alpha.json/x.json (see derive64 in validation.js) — alpha64 specifically
// so fixtures generate wide doubles (float64Arb), not floatArb's f32-exact
// values, which would always double-double-split to a zero lo component.
const validationSpecs = {
  device: loadParam("device"),
  n: loadParam("n"),
  incx: loadParam("incx"),
  alpha: loadParam("alpha64"),
  x: loadParam("x64"),
};

// Cap n for fixtures — validationSpecs allows up to 1000, which makes property tests slow.
const fixtureSpecs = {
  ...validationSpecs,
  n: { ...validationSpecs.n, range: { min: 1, max: 50 } },
};

test("dscal validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => dscal(a.device, a.n, a.alpha, a.x, a.incx),
    { device },
  );
});

test("dscal fixtures", async (t) => {
  await runFixtures(
    t, // node:test context
    "dscal", // routine name — used in the diagnostic label
    device, // WebGPU device instance
    NUM_RUNS, // 100 random inputs
    THRESHOLD, // forward error factor cap — see above
    fixtureSpecs, // param specs used to generate random inputs
    async (dev, a) => dscal(dev, a.n, a.alpha, a.x, a.incx), // GPU call
    stdlibReference, // CPU reference
    forwardFactor, // |err| / (eps * |alpha * x_i|) — see helpers.js
  );
});

// Small hand-picked scenarios loaded from edge-cases.json. Expected output is
// computed live from stdlib, not hardcoded. Unlike sscal's exact-equality
// assertion, these go through forwardFactor: double-double is ~48 bits, so a
// dscal result is not expected to be bit-identical to a true f64 reference.
test("dscal edge cases", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n, // vector length
        alpha: c.alpha, // scale factor
        x: new Float64Array(c.x), // vector to scale
        incx: c.incx, // stride through x
      };
      const got = await dscal(
        device, // GPU device
        a.n, // vector length
        a.alpha, // scale factor
        a.x, // vector to scale
        a.incx, // stride through x
      );
      const expected = stdlibReference(a);
      const factor = forwardFactor(got, expected, a);
      assert.ok(
        factor <= THRESHOLD,
        `${c.label}: got ${got.x}, expected ${expected.x} (forward factor ${factor} > ${THRESHOLD})`,
      );
    });
  }
});
