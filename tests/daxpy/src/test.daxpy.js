import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { daxpy } from "wgblas/daxpy";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
// Raw ULP64 against stdlib is the wrong oracle here — same reason as
// ddot's/dscal's own test files: double-double is ~48 bits, not f64's 53, so
// small magnitudes blow up the ULP count despite tiny relative error.
// Fixtures use the forward error factor instead — see helpers.js.
import { forwardFactor } from "../helpers.js";
import { daxpyReference as stdlibReference } from "../../helpers/stdlib.js";
import edgeCases from "../edge-cases.json" with { type: "json" };

const NUM_RUNS = 100;
// Forward-error cap per adapter, same shape as ddot's/dscal's (see
// tests/ddot/src/test.ddot.js, tests/dscal/src/test.dscal.js).
const THRESHOLDS = {
  "high-performance": 5,
  "low-power": 15000,
};
const THRESHOLD = THRESHOLDS[getPowerPreference()];

let device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => {
  cleanup();
});

// alpha64/x64/y64 derive genuine float64 values from alpha.json/x.json/y.json
// (see derive64 in validation.js) — the 64 variants specifically so fixtures
// generate wide doubles (float64Arb), not floatArb's f32-exact values, which
// would always double-double-split to a zero lo component.
const validationSpecs = {
  device: loadParam("device"),
  n: loadParam("n"),
  incx: loadParam("incx"),
  incy: loadParam("incy"),
  alpha: loadParam("alpha64"),
  x: loadParam("x64"),
  y: loadParam("y64"),
};

// Cap n for fixtures — validationSpecs allows up to 1000, which makes property tests slow.
const fixtureSpecs = {
  ...validationSpecs,
  n: { ...validationSpecs.n, range: { min: 1, max: 50 } },
};

test("daxpy validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => daxpy(a.device, a.n, a.alpha, a.x, a.incx, a.y, a.incy),
    { device },
  );
});

test("daxpy fixtures", async (t) => {
  await runFixtures(
    t, // node:test context
    "daxpy", // routine name — used in the diagnostic label
    device, // WebGPU device instance
    NUM_RUNS, // 100 random inputs
    THRESHOLD, // forward error factor cap — see above
    fixtureSpecs, // param specs used to generate random inputs
    async (dev, a) => daxpy(dev, a.n, a.alpha, a.x, a.incx, a.y, a.incy), // GPU call
    stdlibReference, // CPU reference
    forwardFactor, // |err| / (eps * (|alpha*x_i| + |y_i|)) — see helpers.js
  );
});

// Small hand-picked scenarios loaded from edge-cases.json. Expected output is
// computed live from stdlib, not hardcoded. Unlike saxpy's exact-equality
// assertion, these go through forwardFactor: double-double is ~48 bits, so a
// daxpy result is not expected to be bit-identical to a true f64 reference.
test("daxpy edge cases", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n, // vector length
        alpha: c.alpha, // scale factor applied to x
        x: new Float64Array(c.x), // input vector
        incx: c.incx, // stride through x
        y: new Float64Array(c.y), // input/output vector — accumulates alpha*x
        incy: c.incy, // stride through y
      };
      const got = await daxpy(
        device, // GPU device
        a.n, // vector length
        a.alpha, // scale factor applied to x
        a.x, // input vector
        a.incx, // stride through x
        a.y, // input/output vector — accumulates alpha*x
        a.incy, // stride through y
      );
      const expected = stdlibReference(a);
      const factor = forwardFactor(got, expected, a);
      assert.ok(
        factor <= THRESHOLD,
        `${c.label}: got ${got.y}, expected ${expected.y} (forward factor ${factor} > ${THRESHOLD})`,
      );
    });
  }
});
