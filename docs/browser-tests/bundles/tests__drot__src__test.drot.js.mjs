import { edge_cases_default, forwardFactor } from "./chunk-J5IGMP2R.mjs";
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
import { drotReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures, runValidation } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, drot, init } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import { randomFloat64Array } from "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/drot/src/test.drot.js
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
    t,
    // node:test context
    "drot",
    // routine name — used in the diagnostic label
    device,
    // WebGPU device instance
    NUM_RUNS,
    // 100 random inputs
    THRESHOLD,
    // forward error factor cap — see above
    validationSpecs,
    // param specs used to generate random inputs
    async (dev, a) => drot(dev, a.n, a.x, a.incx, a.y, a.incy, a.c, a.s),
    // GPU call
    drotReference,
    // CPU reference
    forwardFactor,
    // eps * (|c*xi|+|s*yi| or |c*yi|+|s*xi|) — see helpers.js
  );
});
test("drot edge cases", async (t) => {
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
        c: tc.c,
        // rotation cosine
        s: tc.s,
        // rotation sine
      };
      const got = await drot(
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
        a.c,
        // rotation cosine
        a.s,
        // rotation sine
      );
      const expected = drotReference(a);
      const factor = forwardFactor(got, expected, a);
      assert_default.ok(
        factor <= THRESHOLD,
        `${tc.label}: got x=${got.x}, y=${got.y}, expected x=${expected.x}, y=${expected.y} (forward factor ${factor} > ${THRESHOLD})`,
      );
    });
  }
});
test("drot zero-dimension (regression)", async () => {
  const x = randomFloat64Array(8, -1, 1, 300);
  const y = randomFloat64Array(8, -1, 1, 301);
  const beforeX = x.slice();
  const beforeY = y.slice();
  const got = await drot(device, 0, x, 1, y, 1, 0.6, 0.8);
  assert_default.deepEqual(Array.from(got.x), Array.from(beforeX));
  assert_default.deepEqual(Array.from(got.y), Array.from(beforeY));
});
test("drot exactness (regression)", async () => {
  const full = fullPrecisionFrom(940);
  const x = full(13);
  const y = full(13);
  const got = await drot(device, 5, x, 3, y, 3, 0.6, 0.8);
  assertBitIdentical(got.x, x, gaps(5, 3), "x stride gaps");
  assertBitIdentical(got.y, y, gaps(5, 3), "y stride gaps");
});
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
    const want = drotReference(a);
    assertIeeeMatch(got.x, want.x, `n=${n} x`);
    assertIeeeMatch(got.y, want.y, `n=${n} y`);
  }
});
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
  const want = drotReference(argsInF32Range(a));
  assertIeeeMatch(saturate(got.x), saturate(want.x), "x");
  assertIeeeMatch(saturate(got.y), saturate(want.y), "y");
});
