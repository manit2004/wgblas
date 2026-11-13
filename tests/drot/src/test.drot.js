import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, randomFloat64Array } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { drot } from "wgblas/drot";
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
// GPU may fuse multiply-add (FMA, one rounding) while CPU stdlib does two
// separate roundings — same reasoning as srot's own test file. Fixtures use
// the forward error factor instead — see helpers.js.
import { forwardFactor } from "../helpers.js";
import { drotReference as stdlibReference } from "../../helpers/stdlib.js";
import edgeCases from "../edge-cases.json" with { type: "json" };

const NUM_RUNS = 100;
// Forward-error cap, pinned to the high-performance/NVIDIA-calibrated bound
// (see tests/daxpy/src/test.daxpy.js) — drot does real double-double
// arithmetic (unlike dcopy/dswap's pure data movement), so like the other
// arithmetic f64 routines this is not expected to clear on the
// low-power/Intel backend (previously calibrated at 15000 there).
const THRESHOLD = 5;

let device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => {
  cleanup();
});

// cosine64/s64/x64/y64 derive genuine float64 values from cosine.json/s.json/
// x.json/y.json (see derive64 in validation.js) — the 64 variants
// specifically so fixtures generate wide doubles (float64Arb), not
// floatArb's f32-exact values, which would always double-double-split to a
// zero lo component.
const validationSpecs = {
  device: loadParam("device"),
  n: loadParam("n"),
  incx: loadParam("incx"),
  incy: loadParam("incy"),
  x: loadParam("x64"),
  y: loadParam("y64"),
  c: loadParam("cosine64"),
  s: loadParam("s64"),
};

test("drot validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => drot(a.device, a.n, a.x, a.incx, a.y, a.incy, a.c, a.s),
    { device },
  );
});

test("drot fixtures", async (t) => {
  await runFixtures(
    t, // node:test context
    "drot", // routine name — used in the diagnostic label
    device, // WebGPU device instance
    NUM_RUNS, // 100 random inputs
    THRESHOLD, // forward error factor cap — see above
    validationSpecs, // param specs used to generate random inputs
    async (dev, a) => drot(dev, a.n, a.x, a.incx, a.y, a.incy, a.c, a.s), // GPU call
    stdlibReference, // CPU reference
    forwardFactor, // eps * (|c*xi|+|s*yi| or |c*yi|+|s*xi|) — see helpers.js
  );
});

// Small hand-picked scenarios loaded from edge-cases.json. Expected output is
// computed live from stdlib, not hardcoded. Unlike srot's exact-equality
// assertion, these go through forwardFactor: double-double is ~48 bits, so a
// drot result is not expected to be bit-identical to a true f64 reference.
test("drot edge cases", async (t) => {
  for (const tc of edgeCases) {
    await t.test(tc.label, async () => {
      const a = {
        n: tc.n, // vector length
        x: new Float64Array(tc.x), // input/output vector
        incx: tc.incx, // stride through x
        y: new Float64Array(tc.y), // input/output vector
        incy: tc.incy, // stride through y
        c: tc.c, // rotation cosine
        s: tc.s, // rotation sine
      };
      const got = await drot(
        device, // GPU device
        a.n, // vector length
        a.x, // input/output vector
        a.incx, // stride through x
        a.y, // input/output vector
        a.incy, // stride through y
        a.c, // rotation cosine
        a.s, // rotation sine
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
// non-trivial rotation (c=0.6, s=0.8) makes a buggy no-guard rotation
// visibly differ from the untouched inputs.
test("drot zero-dimension (regression)", async () => {
  const x = randomFloat64Array(8, -1, 1, 300);
  const y = randomFloat64Array(8, -1, 1, 301);
  const beforeX = x.slice();
  const beforeY = y.slice();

  const got = await drot(device, 0, x, 1, y, 1, 0.6, 0.8);

  assert.deepEqual(Array.from(got.x), Array.from(beforeX));
  assert.deepEqual(Array.from(got.y), Array.from(beforeY));
});

// Values the routine leaves alone come back bit-identical (see
// tests/helpers/exactness.js): full-precision inputs, which the (hi, lo)
// split would round if they went through a GPU round trip.
test("drot exactness (regression)", async () => {
  const full = fullPrecisionFrom(940);
  const x = full(13);
  const y = full(13);
  const got = await drot(device, 5, x, 3, y, 3, 0.6, 0.8);
  assertBitIdentical(got.x, x, gaps(5, 3), "x stride gaps");
  assertBitIdentical(got.y, y, gaps(5, 3), "y stride gaps");
});

// ±Infinity and NaN reach the outputs as in real f64 (stdlib): no Inf turned
// into NaN by a double-double error term (see tests/helpers/specials.js).
test("drot IEEE special values (regression)", async () => {
  for (const n of [7, 300]) {
    const a = {
      n,
      x: withValues(values(n, 1), { 1: Infinity, 3: NaN }),
      incx: 1,
      y: withValues(values(n, 2), { 4: -Infinity }),
      incy: 1,
      c: 0.6,
      s: 0.8,
    };
    const got = await drot(device, a.n, a.x, a.incx, a.y, a.incy, a.c, a.s);
    const want = stdlibReference(a);
    assertIeeeMatch(got.x, want.x, `n=${n} x`);
    assertIeeeMatch(got.y, want.y, `n=${n} y`);
  }
});

// Double-double has f64's precision but f32's exponent range (its leading
// part is an f32): a double beyond ±3.4e38 reads as ±Infinity, one below
// f32's range as 0, and a result past it overflows to ±Infinity — where real
// f64 stays finite. Pinned against stdlib on the inputs as double-double sees
// them (tests/helpers/specials.js), so a change in that behaviour shows.
test("drot f32 exponent range (regression)", async () => {
  const a = {
    n: 6,
    x: withValues(values(6, 1), { 1: 1e300, 3: 1e-50, 4: 3e38 }),
    incx: 1,
    y: withValues(values(6, 2), { 2: -1e300, 4: 3e38 }),
    incy: 1,
    c: 0.6,
    s: 0.8,
  };
  const got = await drot(device, a.n, a.x, a.incx, a.y, a.incy, a.c, a.s);
  const want = stdlibReference(argsInF32Range(a));
  assertIeeeMatch(saturate(got.x), saturate(want.x), "x");
  assertIeeeMatch(saturate(got.y), saturate(want.y), "y");
});
