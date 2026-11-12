import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, randomFloat64Array } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { dscal } from "wgblas/dscal";
import {
  argsInF32Range,
  assertIeeeMatch,
  saturate,
  values,
  withValues,
} from "../../helpers/specials.js";
import {
  fullPrecisionFrom,
  assertBitIdentical,
  gaps,
} from "../../helpers/exactness.js";
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
// Forward-error cap, pinned to the NVIDIA-calibrated bound (see
// test.ddot.js). Worst over 1200 runs: 2.97 on NVIDIA, 9009 on Intel, heavy
// tail either way — this threshold is not expected to clear on the
// low-power/Intel backend.
const THRESHOLD = 5;

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

// n=0 has zero logical elements to touch, so the only correct behavior is a
// true no-op. The edge-cases block above only asserts "does not throw" for
// n<=0 entries, so an implementation that scribbles on x before an early
// return (or otherwise mishandles n=0) would still pass everything above.
// This checks x comes back byte-identical to what went in.
test("dscal zero-dimension (regression)", async () => {
  const x = randomFloat64Array(8, -1, 1, 300);
  const before = x.slice();

  const got = await dscal(device, 0, 2.5, x, 1);

  assert.deepEqual(Array.from(got.x), Array.from(before));
});

// Values the routine leaves alone come back bit-identical (see
// tests/helpers/exactness.js): full-precision inputs, which the (hi, lo)
// split would round if they went through a GPU round trip.
test("dscal exactness (regression)", async () => {
  const full = fullPrecisionFrom(910);
  const x = full(13);
  const got = await dscal(device, 5, 1.5, x, 3);
  assertBitIdentical(got.x, x, gaps(5, 3), "x stride gaps");
});

// ±Infinity and NaN reach the outputs as in real f64 (stdlib): no Inf turned
// into NaN by a double-double error term (see tests/helpers/specials.js).
test("dscal IEEE special values (regression)", async () => {
  for (const n of [7, 300]) {
    const a = {
      n,
      alpha: 2.5,
      x: withValues(values(n, 1), { 1: Infinity, 3: NaN, 4: -Infinity }),
      incx: 1,
    };
    const got = await dscal(device, a.n, a.alpha, a.x, a.incx);
    assertIeeeMatch(got.x, stdlibReference(a).x, `n=${n} x`);
  }
});

// Double-double has f64's precision but f32's exponent range (its leading
// part is an f32): a double beyond ±3.4e38 reads as ±Infinity, one below
// f32's range as 0, and a result past it overflows to ±Infinity — where real
// f64 stays finite. Pinned against stdlib on the inputs as double-double sees
// them (tests/helpers/specials.js), so a change in that behaviour shows.
test("dscal f32 exponent range (regression)", async () => {
  const a = {
    n: 6,
    alpha: 1e20,
    x: withValues(values(6, 1), { 1: 1e300, 2: -1e300, 3: 1e-50, 4: 1e20 }),
    incx: 1,
  };
  const got = await dscal(device, a.n, a.alpha, a.x, a.incx);
  assertIeeeMatch(got.x, saturate(stdlibReference(argsInF32Range(a)).x), "x");
});
