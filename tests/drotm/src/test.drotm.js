import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, randomFloat64Array } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { drotm } from "wgblas/drotm";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures, rotmParamArb } from "../../helpers/fixtures.js";
// Raw ULP64 against stdlib is the wrong oracle here — same reason as
// drot's/daxpy's own test files: double-double is ~48 bits, not f64's 53, so
// small magnitudes blow up the ULP count despite tiny relative error.
// Fixtures use the forward error factor instead — see helpers.js.
import { forwardFactor } from "../helpers.js";
import { drotmReference as stdlibReference } from "../../helpers/stdlib.js";
import edgeCases from "../edge-cases.json" with { type: "json" };

const NUM_RUNS = 100;
// Forward-error cap, pinned to the high-performance/NVIDIA-calibrated bound
// (see tests/drot/src/test.drot.js) — drotm does real double-double
// arithmetic (unlike dcopy/dswap's pure data movement), so like the other
// arithmetic f64 routines this is not expected to clear on the
// low-power/Intel backend (previously calibrated at 15000 there).
const THRESHOLD = 5;

// param64 derives a genuine float64 param spec from param.json (see
// derive64 in validation.js).
const paramSpec = loadParam("param64");
const paramArb = rotmParamArb(paramSpec);

let device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => {
  cleanup();
});

// x64/y64 derive genuine float64 values from x.json/y.json (see derive64 in
// validation.js) — the 64 variants specifically so fixtures generate wide
// doubles (float64Arb), not floatArb's f32-exact values, which would always
// double-double-split to a zero lo component.
const validationSpecs = {
  device: loadParam("device"),
  n: loadParam("n"),
  incx: loadParam("incx"),
  incy: loadParam("incy"),
  x: loadParam("x64"),
  y: loadParam("y64"),
  param: paramSpec,
};

test("drotm validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => drotm(a.device, a.n, a.x, a.incx, a.y, a.incy, a.param),
    { device },
  );
});

test("drotm fixtures", async (t) => {
  await runFixtures(
    t, // node:test context
    "drotm", // routine name — used in the diagnostic label
    device, // WebGPU device instance
    NUM_RUNS, // 100 random inputs
    THRESHOLD, // forward error factor cap — see above
    validationSpecs, // param specs used to generate random inputs
    async (dev, a) => drotm(dev, a.n, a.x, a.incx, a.y, a.incy, a.param), // GPU call
    stdlibReference, // CPU reference
    forwardFactor, // eps * (|h11*xi|+|h12*yi| or |h21*xi|+|h22*yi|) — see helpers.js
    { param: paramArb }, // custom arbitrary for param — flag + matrix coefficients generated separately
  );
});

// Small hand-picked scenarios loaded from edge-cases.json. Expected output is
// computed live from stdlib, not hardcoded. Unlike srotm's exact-equality
// assertion, these go through forwardFactor: double-double is ~48 bits, so a
// drotm result is not expected to be bit-identical to a true f64 reference.
test("drotm edge cases", async (t) => {
  for (const tc of edgeCases) {
    await t.test(tc.label, async () => {
      const a = {
        n: tc.n, // vector length
        x: new Float64Array(tc.x), // input/output vector
        incx: tc.incx, // stride through x
        y: new Float64Array(tc.y), // input/output vector
        incy: tc.incy, // stride through y
        param: new Float64Array(tc.param), // [flag, h11, h21, h12, h22] modified Givens matrix
      };
      const got = await drotm(
        device, // GPU device
        a.n, // vector length
        a.x, // input/output vector
        a.incx, // stride through x
        a.y, // input/output vector
        a.incy, // stride through y
        a.param, // [flag, h11, h21, h12, h22] modified Givens matrix
      );
      const expected = stdlibReference(a);
      const factor = forwardFactor(got, expected, a);
      assert.ok(
        factor <= THRESHOLD,
        `${tc.label}: got x=${got.x}, y=${got.y}, expected x=${expected.x}, y=${expected.y} (forward factor ${factor} > ${THRESHOLD})`,
      );
    });
  }
});

// n=0 has zero logical elements to touch, so the only correct behavior is a
// true no-op. The edge-cases block above only asserts "does not throw" for
// n<=0 entries, so an implementation that scribbles on x/y before an early
// return (or otherwise mishandles n=0) would still pass everything above. A
// non-identity param (flag=-1, diagonal scaling by 2/3 — reused from
// edge-cases.json) makes a buggy no-guard transform visibly differ from the
// untouched inputs.
test("drotm zero-dimension (regression)", async () => {
  const x = randomFloat64Array(8, -1, 1, 300);
  const y = randomFloat64Array(8, -1, 1, 301);
  const beforeX = x.slice();
  const beforeY = y.slice();
  const param = new Float64Array([-1, 2, 0, 0, 3]);

  const got = await drotm(device, 0, x, 1, y, 1, param);

  assert.deepEqual(Array.from(got.x), Array.from(beforeX));
  assert.deepEqual(Array.from(got.y), Array.from(beforeY));
});
