import { edge_cases_default, forwardFactor } from "./chunk-36ZXVBW3.mjs";
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
import { drotmReference } from "./chunk-3I5F4OKA.mjs";
import {
  loadParam,
  rotmParamArb,
  runFixtures,
  runValidation,
} from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, drotm, init } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import { randomFloat64Array } from "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/drotm/src/test.drotm.js
var NUM_RUNS = 100;
var THRESHOLD = 5;
var paramSpec = loadParam("param64");
var paramArb = rotmParamArb(paramSpec);
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
    t,
    // node:test context
    "drotm",
    // routine name — used in the diagnostic label
    device,
    // WebGPU device instance
    NUM_RUNS,
    // 100 random inputs
    THRESHOLD,
    // forward error factor cap — see above
    validationSpecs,
    // param specs used to generate random inputs
    async (dev, a) => drotm(dev, a.n, a.x, a.incx, a.y, a.incy, a.param),
    // GPU call
    drotmReference,
    // CPU reference
    forwardFactor,
    // eps * (|h11*xi|+|h12*yi| or |h21*xi|+|h22*yi|) — see helpers.js
    { param: paramArb },
    // custom arbitrary for param — flag + matrix coefficients generated separately
  );
});
test("drotm edge cases", async (t) => {
  for (const tc of edge_cases_default) {
    await t.test(tc.label, async () => {
      const a = {
        n: tc.n,
        // vector length
        x: new Float64Array(tc.x),
        // input/output vector
        incx: tc.incx,
        // stride through x
        y: new Float64Array(tc.y),
        // input/output vector
        incy: tc.incy,
        // stride through y
        param: new Float64Array(tc.param),
        // [flag, h11, h21, h12, h22] modified Givens matrix
      };
      const got = await drotm(
        device,
        // GPU device
        a.n,
        // vector length
        a.x,
        // input/output vector
        a.incx,
        // stride through x
        a.y,
        // input/output vector
        a.incy,
        // stride through y
        a.param,
        // [flag, h11, h21, h12, h22] modified Givens matrix
      );
      const expected = drotmReference(a);
      const factor = forwardFactor(got, expected, a);
      assert_default.ok(
        factor <= THRESHOLD,
        `${tc.label}: got x=${got.x}, y=${got.y}, expected x=${expected.x}, y=${expected.y} (forward factor ${factor} > ${THRESHOLD})`,
      );
    });
  }
});
test("drotm zero-dimension (regression)", async () => {
  const x = randomFloat64Array(8, -1, 1, 300);
  const y = randomFloat64Array(8, -1, 1, 301);
  const beforeX = x.slice();
  const beforeY = y.slice();
  const param = new Float64Array([-1, 2, 0, 0, 3]);
  const got = await drotm(device, 0, x, 1, y, 1, param);
  assert_default.deepEqual(Array.from(got.x), Array.from(beforeX));
  assert_default.deepEqual(Array.from(got.y), Array.from(beforeY));
});
test("drotm exactness (regression)", async () => {
  const full = fullPrecisionFrom(950);
  const x = full(13);
  const y = full(13);
  const param = new Float64Array([-1, 0.5, 0.25, -0.75, 2]);
  const got = await drotm(device, 5, x, 3, y, 3, param);
  assertBitIdentical(got.x, x, gaps(5, 3), "x stride gaps");
  assertBitIdentical(got.y, y, gaps(5, 3), "y stride gaps");
});
test("drotm IEEE special values (regression)", async () => {
  for (const n of [7, 300]) {
    const a = {
      n,
      x: withValues(values(n, 1), { 1: Infinity, 3: NaN }),
      incx: 1,
      y: withValues(values(n, 2), { 4: -Infinity }),
      incy: 1,
      param: new Float64Array([-1, 0.5, 0.25, -0.75, 2]),
    };
    const got = await drotm(device, a.n, a.x, a.incx, a.y, a.incy, a.param);
    const want = drotmReference(a);
    assertIeeeMatch(got.x, want.x, `n=${n} x`);
    assertIeeeMatch(got.y, want.y, `n=${n} y`);
  }
});
test("drotm f32 exponent range (regression)", async () => {
  const a = {
    n: 6,
    x: withValues(values(6, 1), { 1: 1e300, 3: 1e-50, 4: 3e38 }),
    incx: 1,
    y: withValues(values(6, 2), { 2: -1e300, 4: 3e38 }),
    incy: 1,
    param: new Float64Array([-1, 0.5, 0.25, -0.75, 2]),
  };
  const got = await drotm(device, a.n, a.x, a.incx, a.y, a.incy, a.param);
  const want = drotmReference(argsInF32Range(a));
  assertIeeeMatch(saturate(got.x), saturate(want.x), "x");
  assertIeeeMatch(saturate(got.y), saturate(want.y), "y");
});
