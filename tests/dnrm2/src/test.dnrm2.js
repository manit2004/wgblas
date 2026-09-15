import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { dnrm2 } from "wgblas/dnrm2";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
// Raw ULP64 (dasum's own convention) is the wrong tool here — dnrm2's
// scaled accumulation needs ddDivProtected per element, which amplifies
// double-double's own representable-precision loss more than a plain sum
// does. Fixtures use a relative-error forward factor instead — see helpers.js.
import { forwardFactor } from "../helpers.js";
import { dnrm2Reference as stdlibReference } from "../../helpers/stdlib.js";
import edgeCases from "../edge-cases.json" with { type: "json" };

const NUM_RUNS = 100;
// Forward-error cap per adapter, same shape as drot's/drotm's (see
// tests/drot/src/test.drot.js) — calibrated against real hardware: observed
// worst case across thousands of random trials (spanning normal magnitudes,
// all-zero vectors, and magnitudes that would overflow/underflow naive f32
// squaring) stayed under ~2 on high-performance and ~1700 on low-power.
const THRESHOLDS = {
  "high-performance": 10,
  "low-power": 8000,
};
const THRESHOLD = THRESHOLDS[getPowerPreference()];

let device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => {
  cleanup();
});

// x64 derives genuine float64 values from x.json (see derive64 in
// validation.js) — the 64 variant specifically so fixtures generate wide
// doubles (float64Arb), not floatArb's f32-exact values, which would always
// double-double-split to a zero lo component.
const validationSpecs = {
  device: loadParam("device"),
  n: loadParam("n"),
  incx: loadParam("incx"),
  x: loadParam("x64"),
};

// Cap n for fixtures — validationSpecs allows up to 1000, which makes property tests slow.
const fixtureSpecs = {
  ...validationSpecs,
  n: { ...validationSpecs.n, range: { min: 1, max: 50 } },
};

test("dnrm2 validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => dnrm2(a.device, a.n, a.x, a.incx),
    { device },
  );
});

test("dnrm2 fixtures", async (t) => {
  await runFixtures(
    t, // node:test context
    "dnrm2", // routine name — used in the diagnostic label
    device, // WebGPU device instance
    NUM_RUNS, // 100 random inputs
    THRESHOLD, // forward error factor cap — see above
    fixtureSpecs, // param specs used to generate random inputs
    async (dev, a) => dnrm2(dev, a.n, a.x, a.incx), // GPU call
    stdlibReference, // CPU reference
    (gpu, ref) => forwardFactor(gpu, ref), // eps * |ref| — see helpers.js
  );
});

// Small hand-picked scenarios loaded from edge-cases.json. Expected output is
// computed live from stdlib, not hardcoded. Unlike snrm2's raw-ULP
// assertion, these go through forwardFactor: double-double is ~48 bits, so
// a dnrm2 result is not expected to be bit-identical to a true f64 reference.
test("dnrm2 edge cases", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n, // vector length
        x: new Float64Array(c.x), // input vector
        incx: c.incx, // stride through x
      };
      const got = await dnrm2(
        device, // GPU device
        a.n, // vector length
        a.x, // input vector
        a.incx, // stride through x
      );
      const expected = stdlibReference(a);
      const factor = forwardFactor(got, expected);
      assert.ok(
        factor <= THRESHOLD,
        `${c.label}: got ${got.nrm2}, expected ${expected} (forward factor ${factor} > ${THRESHOLD})`,
      );
    });
  }
});

// n=0 must return exactly 0 (the L2 norm of an empty vector), matching
// snrm2's own contract — no GPU dispatch happens in that case.
test("dnrm2 zero-dimension (regression)", async () => {
  const got = await dnrm2(device, 0, new Float64Array([1, 2, 3]), 1);
  assert.equal(got.nrm2, 0);
});
