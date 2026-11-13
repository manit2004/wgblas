import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, randomFloat64Array } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { daxpy } from "wgblas/daxpy";
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
  all,
  gaps,
} from "../../helpers/exactness.js";
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
// Forward-error cap, pinned to the high-performance/NVIDIA-calibrated bound
// (see tests/ddot/src/test.ddot.js, tests/dscal/src/test.dscal.js) rather
// than a per-adapter value — low-power/Intel Mesa's real observed error on
// this routine runs far above this bound (previously calibrated at 15000),
// so this threshold is not expected to clear on that backend.
const THRESHOLD = 5;

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

// n=0 has zero logical elements to touch, so the only correct behavior is a
// true no-op. The edge-cases block above only asserts "does not throw" for
// n<=0 entries, so an implementation that scribbles on y before an early
// return (or otherwise mishandles n=0) would still pass everything above.
// This checks y comes back byte-identical to what went in.
test("daxpy zero-dimension (regression)", async () => {
  const x = randomFloat64Array(8, -1, 1, 300);
  const y = randomFloat64Array(8, -1, 1, 301);
  const before = y.slice();

  const got = await daxpy(device, 0, 2.5, x, 1, y, 1);

  assert.deepEqual(Array.from(got.y), Array.from(before));
});

// Values the routine leaves alone come back bit-identical (see
// tests/helpers/exactness.js): full-precision inputs, which the (hi, lo)
// split would round if they went through a GPU round trip.
test("daxpy exactness (regression)", async (t) => {
  const full = fullPrecisionFrom(900);
  await t.test("alpha=0 returns y untouched, even with NaN in x", async () => {
    const y = full(6);
    const want = Float64Array.from(y);
    const x = full(6).fill(NaN, 0, 2);
    const got = await daxpy(device, 6, 0, x, 1, y, 1);
    assert.equal(got.y, y);
    assertBitIdentical(got.y, want, all(6), "y");
  });
  await t.test("stride gaps in y", async () => {
    const y = full(13);
    const got = await daxpy(device, 5, 1.5, full(13), 3, y, 3);
    assertBitIdentical(got.y, y, gaps(5, 3), "y");
  });
});

// ±Infinity and NaN reach the outputs as in real f64 (stdlib): no Inf turned
// into NaN by a double-double error term (see tests/helpers/specials.js).
test("daxpy IEEE special values (regression)", async () => {
  for (const n of [7, 300]) {
    const a = {
      n,
      alpha: 1.5,
      x: withValues(values(n, 1), { 1: Infinity, 3: NaN, 4: -Infinity }),
      incx: 1,
      y: withValues(values(n, 2), { 5: Infinity }),
      incy: 1,
    };
    const got = await daxpy(device, a.n, a.alpha, a.x, a.incx, a.y, a.incy);
    assertIeeeMatch(got.y, stdlibReference(a).y, `n=${n} y`);
  }
});

// Double-double has f64's precision but f32's exponent range (its leading
// part is an f32): a double beyond ±3.4e38 reads as ±Infinity, one below
// f32's range as 0, and a result past it overflows to ±Infinity — where real
// f64 stays finite. Pinned against stdlib on the inputs as double-double sees
// them (tests/helpers/specials.js), so a change in that behaviour shows.
test("daxpy f32 exponent range (regression)", async (t) => {
  await t.test(
    "out-of-range inputs, and an untouched one in a stride gap",
    async () => {
      const a = {
        n: 6,
        alpha: 1.5,
        x: withValues(values(6, 1), { 1: 1e300, 3: 1e-50 }),
        incx: 1,
        y: withValues(values(11, 2), { 1: -1e300, 4: 1e-50 }),
        incy: 2,
      };
      const got = await daxpy(device, a.n, a.alpha, a.x, a.incx, a.y, a.incy);
      assertIeeeMatch(
        got.y,
        saturate(stdlibReference(argsInF32Range(a)).y),
        "y",
      );
    },
  );
  await t.test("a result past f32's range", async () => {
    const a = {
      n: 4,
      alpha: 1e20,
      x: withValues(values(4, 3), { 2: 1e20 }),
      incx: 1,
      y: values(4, 4),
      incy: 1,
    };
    const got = await daxpy(device, a.n, a.alpha, a.x, a.incx, a.y, a.incy);
    assertIeeeMatch(got.y, saturate(stdlibReference(argsInF32Range(a)).y), "y");
  });
});
