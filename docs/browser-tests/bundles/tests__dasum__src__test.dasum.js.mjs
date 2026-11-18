import { edge_cases_default } from "./chunk-JQ6QN5BY.mjs";
import {
  argsInF32Range,
  assertIeeeMatch,
  saturate,
  values,
  withValues,
} from "./chunk-VGOUGUHQ.mjs";
import { dasumReference } from "./chunk-3I5F4OKA.mjs";
import {
  loadParam,
  runFixtures,
  runValidation,
  ulpDiff64,
} from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, dasum, init } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import { randomFloat64Array } from "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/dasum/src/test.dasum.js
var NUM_RUNS = 100;
var THRESHOLD = 64;
var device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => {
  cleanup();
});
var validationSpecs = {
  device: loadParam("device"),
  n: loadParam("n"),
  incx: loadParam("incx"),
  x: loadParam("x64"),
};
var fixtureSpecs = {
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
    t,
    // node:test context
    "dasum",
    // routine name — used in the diagnostic label
    device,
    // WebGPU device instance
    NUM_RUNS,
    // 100 random inputs
    THRESHOLD,
    // max allowed f64 ULP difference
    fixtureSpecs,
    // param specs used to generate random inputs
    async (dev, a) => dasum(dev, a.n, a.x, a.incx),
    // GPU call
    dasumReference,
    // CPU reference
    (gpu, ref) => ulpDiff64(gpu.asum, ref),
    // raw f64 ULP difference between results
  );
});
test("dasum edge cases", async (t) => {
  for (const c of edge_cases_default) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,
        // vector length
        x: new Float64Array(c.x),
        // input vector
        incx: c.incx,
        // stride through x
      };
      const { asum: got } = await dasum(
        device,
        // GPU device
        a.n,
        // vector length
        a.x,
        // input vector
        a.incx,
        // stride through x
      );
      const expected = dasumReference(a);
      assert_default.ok(
        ulpDiff64(got, expected) <= THRESHOLD,
        `${c.label}: got ${got}, expected ${expected} (ULP diff ${ulpDiff64(got, expected)} > ${THRESHOLD})`,
      );
    });
  }
});
test("dasum zero-dimension (regression)", async () => {
  const x = randomFloat64Array(8, -1, 1, 300);
  const { asum: got } = await dasum(device, 0, x, 1);
  assert_default.strictEqual(got, 0);
});
test("dasum IEEE special values (regression)", async () => {
  for (const [entries, n] of [
    [{ 2: Infinity }, 7],
    [{ 3: -Infinity }, 5e3],
    [{ 2: NaN }, 7],
    [{ 4e3: NaN }, 5e3],
  ]) {
    const a = { n, x: withValues(values(n, 1), entries), incx: 1 };
    const got = await dasum(device, a.n, a.x, a.incx);
    assertIeeeMatch(got.asum, dasumReference(a), `n=${n} asum`);
  }
});
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
        saturate(dasumReference(argsInF32Range(a))),
        "asum",
      );
    });
});
