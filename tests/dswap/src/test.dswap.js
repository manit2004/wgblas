import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, randomFloat64Array } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { dswap } from "wgblas/dswap";
import {
  argsInF32Range,
  assertIeeeMatch,
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
// Raw ULP64 against stdlib is the wrong oracle here — same reason as
// dscal's/daxpy's/dcopy's own test files: double-double is ~48 bits, not
// f64's 53, so small magnitudes blow up the ULP count despite tiny relative
// error. Fixtures use the forward error factor instead — see helpers.js.
// Like dcopy, dswap performs no arithmetic, so the entire gap is the
// double-double representable-precision loss from splitDoubleDouble/
// mergeDoubleDouble at the JS boundary, not anything the shader computes.
import { forwardFactor } from "../helpers.js";
import { dswapReference as stdlibReference } from "../../helpers/stdlib.js";
import edgeCases from "../edge-cases.json" with { type: "json" };

const NUM_RUNS = 100;
// Forward-error cap, same tight bound on both adapters (see
// tests/dcopy/src/test.dcopy.js) — a pure data-movement routine, so both
// backends land in the same tight range.
const THRESHOLD = 2;

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
// double-double-split to a zero lo component. dswap has no scalar param, so
// no alpha64 needed.
const validationSpecs = {
  device: loadParam("device"),
  n: loadParam("n"),
  incx: loadParam("incx"),
  incy: loadParam("incy"),
  x: loadParam("x64"),
  y: loadParam("y64"),
};

test("dswap validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => dswap(a.device, a.n, a.x, a.incx, a.y, a.incy),
    { device },
  );
});

test("dswap fixtures", async (t) => {
  await runFixtures(
    t, // node:test context
    "dswap", // routine name — used in the diagnostic label
    device, // WebGPU device instance
    NUM_RUNS, // 100 random inputs
    THRESHOLD, // forward error factor cap — see above
    validationSpecs, // param specs used to generate random inputs
    async (dev, a) => dswap(dev, a.n, a.x, a.incx, a.y, a.incy), // GPU call
    stdlibReference, // CPU reference
    forwardFactor, // eps * |original value now there| — see helpers.js
  );
});

// Small hand-picked scenarios loaded from edge-cases.json. Expected output is
// computed live from stdlib, not hardcoded. Unlike sswap's exact-equality
// assertion, these go through forwardFactor: double-double is ~48 bits, so a
// dswap result is not expected to be bit-identical to a true f64 reference.
test("dswap edge cases", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n, // vector length
        x: new Float64Array(c.x), // vector to swap
        incx: c.incx, // stride through x
        y: new Float64Array(c.y), // vector to swap
        incy: c.incy, // stride through y
      };
      const got = await dswap(
        device, // GPU device
        a.n, // vector length
        a.x, // vector to swap
        a.incx, // stride through x
        a.y, // vector to swap
        a.incy, // stride through y
      );
      const expected = stdlibReference(a);
      const factor = forwardFactor(got, expected, a);
      assert.ok(
        factor <= THRESHOLD,
        `${c.label}: got x=${got.x}, y=${got.y}, expected x=${expected.x}, y=${expected.y} (forward factor ${factor} > ${THRESHOLD})`,
      );
    });
  }
});

// n=0 has zero logical elements to touch, so the only correct behavior is a
// true no-op. The edge-cases block above only asserts "does not throw" for
// n<=0 entries, so an implementation that scribbles on x/y before an early
// return (or otherwise mishandles n=0) would still pass everything above.
// This checks both x and y come back byte-identical to what went in.
test("dswap zero-dimension (regression)", async () => {
  const x = randomFloat64Array(8, -1, 1, 300);
  const y = randomFloat64Array(8, -1, 1, 301);
  const beforeX = x.slice();
  const beforeY = y.slice();

  const got = await dswap(device, 0, x, 1, y, 1);

  assert.deepEqual(Array.from(got.x), Array.from(beforeX));
  assert.deepEqual(Array.from(got.y), Array.from(beforeY));
});

// Values the routine leaves alone come back bit-identical (see
// tests/helpers/exactness.js): full-precision inputs, which the (hi, lo)
// split would round if they went through a GPU round trip.
test("dswap exactness (regression)", async () => {
  // Swapped elements are the other vector's doubles bit for bit; gaps untouched.
  const full = fullPrecisionFrom(930);
  const x = full(11);
  const y = full(16);
  const got = await dswap(device, 6, x, 2, y, 3);
  for (let i = 0; i < 6; i++) {
    assert.ok(Object.is(got.x[i * 2], y[i * 3]), `x[${i * 2}]`);
    assert.ok(Object.is(got.y[i * 3], x[i * 2]), `y[${i * 3}]`);
  }
  assertBitIdentical(got.x, x, gaps(6, 2), "x gaps");
  assertBitIdentical(got.y, y, gaps(6, 3), "y gaps");
});

// Double-double has f64's precision but f32's exponent range (its leading
// part is an f32): a double beyond ±3.4e38 reads as ±Infinity, one below
// f32's range as 0, and a result past it overflows to ±Infinity — where real
// f64 stays finite. Pinned against stdlib on the inputs as double-double sees
// them (tests/helpers/specials.js), so a change in that behaviour shows.
test("dswap f32 exponent range (regression)", async () => {
  const a = {
    n: 5,
    x: withValues(values(5, 1), { 1: 1e300, 3: 1e-50 }),
    incx: 1,
    y: withValues(values(5, 2), { 2: -1e300 }),
    incy: 1,
  };
  const got = await dswap(device, a.n, a.x, a.incx, a.y, a.incy);
  const want = stdlibReference(argsInF32Range(a));
  assertIeeeMatch(got.x, want.x, "x");
  assertIeeeMatch(got.y, want.y, "y");
});
