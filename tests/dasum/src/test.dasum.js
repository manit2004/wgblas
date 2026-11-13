import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, randomFloat64Array } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { dasum } from "wgblas/dasum";
import {
  argsInF32Range,
  assertIeeeMatch,
  saturate,
  values,
  withValues,
} from "../../helpers/specials.js";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { dasumReference as stdlibReference } from "../../helpers/stdlib.js";
import { ulpDiff64 } from "../../helpers/ulp.js";
import edgeCases from "../edge-cases.json" with { type: "json" };

const NUM_RUNS = 100;
const THRESHOLD = 64;

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
  x: loadParam("x64"),
};

// Cap n for fixtures — validationSpecs allows up to 1000, which makes property tests slow.
const fixtureSpecs = {
  ...validationSpecs,
  n: { ...validationSpecs.n, range: { min: 1, max: 50 } },
};

test("dasum validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => dasum(a.device, a.n, a.x, a.incx),
    { device },
  );
});

test("dasum fixtures", async (t) => {
  await runFixtures(
    t, // node:test context
    "dasum", // routine name — used in the diagnostic label
    device, // WebGPU device instance
    NUM_RUNS, // 100 random inputs
    THRESHOLD, // max allowed f64 ULP difference
    fixtureSpecs, // param specs used to generate random inputs
    async (dev, a) => dasum(dev, a.n, a.x, a.incx), // GPU call
    stdlibReference, // CPU reference
    (gpu, ref) => ulpDiff64(gpu.asum, ref), // raw f64 ULP difference between results
  );
});

// Small hand-picked scenarios loaded from edge-cases.json. Expected output is
// computed live from stdlib, not hardcoded.
test("dasum edge cases", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n, // vector length
        x: new Float64Array(c.x), // input vector
        incx: c.incx, // stride through x
      };
      const { asum: got } = await dasum(
        device, // GPU device
        a.n, // vector length
        a.x, // input vector
        a.incx, // stride through x
      );
      const expected = stdlibReference(a);
      assert.ok(
        ulpDiff64(got, expected) <= THRESHOLD,
        `${c.label}: got ${got}, expected ${expected} (ULP diff ${ulpDiff64(got, expected)} > ${THRESHOLD})`,
      );
    });
  }
});

// n=0 has zero logical elements to touch, so the only correct sum is
// exactly 0. The edge-cases block above only asserts "does not throw" for
// n<=0 entries, so an implementation that mishandles n=0 (e.g. dispatches a
// pass over stale buffer contents) could still pass everything above.
test("dasum zero-dimension (regression)", async () => {
  const x = randomFloat64Array(8, -1, 1, 300);

  const { asum: got } = await dasum(device, 0, x, 1);

  assert.strictEqual(got, 0);
});

// ±Infinity and NaN reach the outputs as in real f64 (stdlib): no Inf turned
// into NaN by a double-double error term (see tests/helpers/specials.js).
test("dasum IEEE special values (regression)", async () => {
  for (const [entries, n] of [
    [{ 2: Infinity }, 7],
    [{ 3: -Infinity }, 5000],
    [{ 2: NaN }, 7],
    [{ 4000: NaN }, 5000],
  ]) {
    const a = { n, x: withValues(values(n, 1), entries), incx: 1 };
    const got = await dasum(device, a.n, a.x, a.incx);
    assertIeeeMatch(got.asum, stdlibReference(a), `n=${n} asum`);
  }
});

// Double-double has f64's precision but f32's exponent range (its leading
// part is an f32): a double beyond ±3.4e38 reads as ±Infinity, one below
// f32's range as 0, and a result past it overflows to ±Infinity — where real
// f64 stays finite. Pinned against stdlib on the inputs as double-double sees
// them (tests/helpers/specials.js), so a change in that behaviour shows.
test("dasum f32 exponent range (regression)", async (t) => {
  for (const [label, x] of [
    ["an input past f32's range", withValues(values(7, 1), { 2: -1e300 })],
    ["an input below f32's range", withValues(values(7, 1), { 2: 1e-50 })],
    ["a sum past f32's range", new Float64Array([1e38, 1e38, 1e38, 1e38])],
  ])
    await t.test(label, async () => {
      const a = { n: x.length, x, incx: 1 };
      const got = await dasum(device, a.n, a.x, a.incx);
      assertIeeeMatch(
        got.asum,
        saturate(stdlibReference(argsInF32Range(a))),
        "asum",
      );
    });
});
