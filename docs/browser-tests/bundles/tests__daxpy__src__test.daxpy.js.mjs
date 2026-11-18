import { edge_cases_default, forwardFactor } from "./chunk-VYZ2SRWA.mjs";
import {
  all,
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
import { daxpyReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures, runValidation } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, daxpy, init } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import { randomFloat64Array } from "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/daxpy/src/test.daxpy.js
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
  incy: loadParam("incy"),
  alpha: loadParam("alpha64"),
  x: loadParam("x64"),
  y: loadParam("y64"),
};
var fixtureSpecs = {
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
    t,
    // node:test context
    "daxpy",
    // routine name — used in the diagnostic label
    device,
    // WebGPU device instance
    NUM_RUNS,
    // 100 random inputs
    THRESHOLD,
    // forward error factor cap — see above
    fixtureSpecs,
    // param specs used to generate random inputs
    async (dev, a) => daxpy(dev, a.n, a.alpha, a.x, a.incx, a.y, a.incy),
    // GPU call
    daxpyReference,
    // CPU reference
    forwardFactor,
    // |err| / (eps * (|alpha*x_i| + |y_i|)) — see helpers.js
  );
});
test("daxpy edge cases", async (t) => {
  for (const c of edge_cases_default) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,
        // vector length
        alpha: c.alpha,
        // scale factor applied to x
        x: new Float64Array(c.x),
        // input vector
        incx: c.incx,
        // stride through x
        y: new Float64Array(c.y),
        // input/output vector — accumulates alpha*x
        incy: c.incy,
        // stride through y
      };
      const got = await daxpy(
        device,
        // GPU device
        a.n,
        // vector length
        a.alpha,
        // scale factor applied to x
        a.x,
        // input vector
        a.incx,
        // stride through x
        a.y,
        // input/output vector — accumulates alpha*x
        a.incy,
        // stride through y
      );
      const expected = daxpyReference(a);
      const factor = forwardFactor(got, expected, a);
      assert_default.ok(
        factor <= THRESHOLD,
        `${c.label}: got ${got.y}, expected ${expected.y} (forward factor ${factor} > ${THRESHOLD})`,
      );
    });
  }
});
test("daxpy zero-dimension (regression)", async () => {
  const x = randomFloat64Array(8, -1, 1, 300);
  const y = randomFloat64Array(8, -1, 1, 301);
  const before2 = y.slice();
  const got = await daxpy(device, 0, 2.5, x, 1, y, 1);
  assert_default.deepEqual(Array.from(got.y), Array.from(before2));
});
test("daxpy exactness (regression)", async (t) => {
  const full = fullPrecisionFrom(900);
  await t.test("alpha=0 returns y untouched, even with NaN in x", async () => {
    const y = full(6);
    const want = Float64Array.from(y);
    const x = full(6).fill(NaN, 0, 2);
    const got = await daxpy(device, 6, 0, x, 1, y, 1);
    assert_default.equal(got.y, y);
    assertBitIdentical(got.y, want, all(6), "y");
  });
  await t.test("stride gaps in y", async () => {
    const y = full(13);
    const got = await daxpy(device, 5, 1.5, full(13), 3, y, 3);
    assertBitIdentical(got.y, y, gaps(5, 3), "y");
  });
});
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
    assertIeeeMatch(got.y, daxpyReference(a).y, `n=${n} y`);
  }
});
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
        saturate(daxpyReference(argsInF32Range(a)).y),
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
    assertIeeeMatch(got.y, saturate(daxpyReference(argsInF32Range(a)).y), "y");
  });
});
