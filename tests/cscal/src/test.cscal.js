import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { cscal } from "wgblas/cscal";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
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

// alpha/x: hand-written complex siblings of alpha.json/x.json (see
// validation.js's complex32/complex32array handling).
const validationSpecs = {
  device: loadParam("device"),
  n:      loadParam("n"),
  incx:   loadParam("incx"),
  alpha:  loadParam("alphaComplex"),
  x:      loadParam("xComplex"),
};

test("cscal validation", async (t) => {
  await runValidation(t, validationSpecs,
    (a) => cscal(a.device, a.n, a.alpha, a.x, a.incx),
    { device },
  );
});

test("cscal fixtures", async (t) => {
  await runFixtures(
    t,
    "cscal",
    device,
    NUM_RUNS,
    THRESHOLD,
    validationSpecs, // buildArb generates alpha/x directly from their complex32/complex32array specs
    async (dev, a) => cscal(dev, a.n, a.alpha, a.x, a.incx),
    stdlibReference,
    cscalForwardFactor,
  );
});

// Small hand-picked scenarios loaded from edge-cases.json. Expected output is
// computed live from stdlib, not hardcoded.
test("cscal edge cases", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,
        alpha: new Complex32(c.alpha.re, c.alpha.im),
        x: new Complex32Array(c.x),
        incx: c.incx,
      };
      const got = await cscal(device, a.n, a.alpha, a.x, a.incx);
      const expected = stdlibReference(a);
      assert.deepEqual(got.x, expected.x);
    });
  }
});
