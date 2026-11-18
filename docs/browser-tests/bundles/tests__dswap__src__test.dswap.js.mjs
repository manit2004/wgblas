import { edge_cases_default, forwardFactor } from "./chunk-IZWBLHPD.mjs";
import {
  assertBitIdentical,
  fullPrecisionFrom,
  gaps,
} from "./chunk-WTAHVNYX.mjs";
import {
  argsInF32Range,
  assertIeeeMatch,
  values,
  withValues,
} from "./chunk-VGOUGUHQ.mjs";
import { dswapReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures, runValidation } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, dswap, init } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import { randomFloat64Array } from "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/dswap/src/test.dswap.js
var NUM_RUNS = 100;
var THRESHOLD = 2;
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
    t,
    // node:test context
    "dswap",
    // routine name — used in the diagnostic label
    device,
    // WebGPU device instance
    NUM_RUNS,
    // 100 random inputs
    THRESHOLD,
    // forward error factor cap — see above
    validationSpecs,
    // param specs used to generate random inputs
    async (dev, a) => dswap(dev, a.n, a.x, a.incx, a.y, a.incy),
    // GPU call
    dswapReference,
    // CPU reference
    forwardFactor,
    // eps * |original value now there| — see helpers.js
  );
});
test("dswap edge cases", async (t) => {
  for (const c of edge_cases_default) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,
        // vector length
        x: new Float64Array(c.x),
        // vector to swap
        incx: c.incx,
        // stride through x
        y: new Float64Array(c.y),
        // vector to swap
        incy: c.incy,
        // stride through y
      };
      const got = await dswap(
        device,
        // GPU device
        a.n,
        // vector length
        a.x,
        // vector to swap
        a.incx,
        // stride through x
        a.y,
        // vector to swap
        a.incy,
        // stride through y
      );
      const expected = dswapReference(a);
      const factor = forwardFactor(got, expected, a);
      assert_default.ok(
        factor <= THRESHOLD,
        `${c.label}: got x=${got.x}, y=${got.y}, expected x=${expected.x}, y=${expected.y} (forward factor ${factor} > ${THRESHOLD})`,
      );
    });
  }
});
test("dswap zero-dimension (regression)", async () => {
  const x = randomFloat64Array(8, -1, 1, 300);
  const y = randomFloat64Array(8, -1, 1, 301);
  const beforeX = x.slice();
  const beforeY = y.slice();
  const got = await dswap(device, 0, x, 1, y, 1);
  assert_default.deepEqual(Array.from(got.x), Array.from(beforeX));
  assert_default.deepEqual(Array.from(got.y), Array.from(beforeY));
});
test("dswap exactness (regression)", async () => {
  const full = fullPrecisionFrom(930);
  const x = full(11);
  const y = full(16);
  const got = await dswap(device, 6, x, 2, y, 3);
  for (let i = 0; i < 6; i++) {
    assert_default.ok(Object.is(got.x[i * 2], y[i * 3]), `x[${i * 2}]`);
    assert_default.ok(Object.is(got.y[i * 3], x[i * 2]), `y[${i * 3}]`);
  }
  assertBitIdentical(got.x, x, gaps(6, 2), "x gaps");
  assertBitIdentical(got.y, y, gaps(6, 3), "y gaps");
});
test("dswap f32 exponent range (regression)", async () => {
  const a = {
    n: 5,
    x: withValues(values(5, 1), { 1: 1e300, 3: 1e-50 }),
    incx: 1,
    y: withValues(values(5, 2), { 2: -1e300 }),
    incy: 1,
  };
  const got = await dswap(device, a.n, a.x, a.incx, a.y, a.incy);
  const want = dswapReference(argsInF32Range(a));
  assertIeeeMatch(got.x, want.x, "x");
  assertIeeeMatch(got.y, want.y, "y");
});
