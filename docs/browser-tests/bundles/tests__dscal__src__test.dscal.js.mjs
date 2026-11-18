import { edge_cases_default, forwardFactor } from "./chunk-AUF5UQCO.mjs";
import {
  assertBitIdentical,
  fullPrecisionFrom,
  gaps,
} from "./chunk-WTAHVNYX.mjs";
import {
  argsInF32Range,
  assertIeeeMatch,
  saturate,
  values,
  withValues,
} from "./chunk-VGOUGUHQ.mjs";
import { dscalReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures, runValidation } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, dscal, init } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import { randomFloat64Array } from "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/dscal/src/test.dscal.js
var NUM_RUNS = 100;
var THRESHOLD = 5;
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
  alpha: loadParam("alpha64"),
  x: loadParam("x64"),
};
var fixtureSpecs = {
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
    t,
    // node:test context
    "dscal",
    // routine name — used in the diagnostic label
    device,
    // WebGPU device instance
    NUM_RUNS,
    // 100 random inputs
    THRESHOLD,
    // forward error factor cap — see above
    fixtureSpecs,
    // param specs used to generate random inputs
    async (dev, a) => dscal(dev, a.n, a.alpha, a.x, a.incx),
    // GPU call
    dscalReference,
    // CPU reference
    forwardFactor,
    // |err| / (eps * |alpha * x_i|) — see helpers.js
  );
});
test("dscal edge cases", async (t) => {
  for (const c of edge_cases_default) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,
        // vector length
        alpha: c.alpha,
        // scale factor
        x: new Float64Array(c.x),
        // vector to scale
        incx: c.incx,
        // stride through x
      };
      const got = await dscal(
        device,
        // GPU device
        a.n,
        // vector length
        a.alpha,
        // scale factor
        a.x,
        // vector to scale
        a.incx,
        // stride through x
      );
      const expected = dscalReference(a);
      const factor = forwardFactor(got, expected, a);
      assert_default.ok(
        factor <= THRESHOLD,
        `${c.label}: got ${got.x}, expected ${expected.x} (forward factor ${factor} > ${THRESHOLD})`,
      );
    });
  }
});
test("dscal zero-dimension (regression)", async () => {
  const x = randomFloat64Array(8, -1, 1, 300);
  const before2 = x.slice();
  const got = await dscal(device, 0, 2.5, x, 1);
  assert_default.deepEqual(Array.from(got.x), Array.from(before2));
});
test("dscal exactness (regression)", async () => {
  const full = fullPrecisionFrom(910);
  const x = full(13);
  const got = await dscal(device, 5, 1.5, x, 3);
  assertBitIdentical(got.x, x, gaps(5, 3), "x stride gaps");
});
test("dscal IEEE special values (regression)", async () => {
  for (const n of [7, 300]) {
    const a = {
      n,
      alpha: 2.5,
      x: withValues(values(n, 1), { 1: Infinity, 3: NaN, 4: -Infinity }),
      incx: 1,
    };
    const got = await dscal(device, a.n, a.alpha, a.x, a.incx);
    assertIeeeMatch(got.x, dscalReference(a).x, `n=${n} x`);
  }
});
test("dscal f32 exponent range (regression)", async () => {
  const a = {
    n: 6,
    alpha: 1e20,
    x: withValues(values(6, 1), { 1: 1e300, 2: -1e300, 3: 1e-50, 4: 1e20 }),
    incx: 1,
  };
  const got = await dscal(device, a.n, a.alpha, a.x, a.incx);
  assertIeeeMatch(got.x, saturate(dscalReference(argsInF32Range(a)).x), "x");
});
test("dscal alpha = 1 leaves x as it is (regression)", async () => {
  const x = withValues(randomFloat64Array(6, -1, 1, 1), {
    1: NaN,
    2: -0,
    3: 1e300,
  });
  const want = x.slice();
  const got = await dscal(device, 6, 1, x, 1);
  assert_default.equal(got.x, x);
  for (let i = 0; i < 6; i++)
    assert_default.ok(Object.is(got.x[i], want[i]), `x[${i}]`);
});
