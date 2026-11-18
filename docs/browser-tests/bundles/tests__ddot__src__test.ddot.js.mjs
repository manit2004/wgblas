import { edge_cases_default, forwardFactor } from "./chunk-AAM6EDPZ.mjs";
import {
  argsInF32Range,
  assertIeeeMatch,
  saturate,
  values,
  withValues,
} from "./chunk-VGOUGUHQ.mjs";
import { ddotReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures, runValidation } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, ddot, init } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import { randomFloat64Array } from "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/ddot/src/test.ddot.js
var NUM_RUNS = 100;
var THRESHOLD = 1;
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
var fixtureSpecs = {
  ...validationSpecs,
  n: { ...validationSpecs.n, range: { min: 1, max: 50 } },
};
test("ddot validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => ddot(a.device, a.n, a.x, a.incx, a.y, a.incy),
    { device },
  );
});
test("ddot fixtures", async (t) => {
  await runFixtures(
    t,
    // node:test context
    "ddot",
    // routine name — used in the diagnostic label
    device,
    // WebGPU device instance
    NUM_RUNS,
    // 100 random inputs
    THRESHOLD,
    // forward error factor cap — see above
    fixtureSpecs,
    // param specs used to generate random inputs
    async (dev, a) => ddot(dev, a.n, a.x, a.incx, a.y, a.incy),
    // GPU call
    ddotReference,
    // CPU reference
    forwardFactor,
    // |err| / (n * eps * sum|x_i*y_i|) — see helpers.js
  );
});
test("ddot edge cases", async (t) => {
  for (const c of edge_cases_default) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,
        // vector length
        x: new Float64Array(c.x),
        // input vector
        incx: c.incx,
        // stride through x
        y: new Float64Array(c.y),
        // input vector
        incy: c.incy,
        // stride through y
      };
      const got = await ddot(
        device,
        // GPU device
        a.n,
        // vector length
        a.x,
        // input vector
        a.incx,
        // stride through x
        a.y,
        // input vector
        a.incy,
        // stride through y
      );
      const expected = ddotReference(a);
      const factor = forwardFactor(got, expected, a);
      assert_default.ok(
        factor <= THRESHOLD,
        `${c.label}: got ${got.dot}, expected ${expected} (forward factor ${factor} > ${THRESHOLD})`,
      );
    });
  }
});
test("ddot zero-dimension (regression)", async () => {
  const x = randomFloat64Array(8, -1, 1, 300);
  const y = randomFloat64Array(8, -1, 1, 301);
  const { dot: got } = await ddot(device, 0, x, 1, y, 1);
  assert_default.strictEqual(got, 0);
});
test("ddot IEEE special values (regression)", async (t) => {
  for (const [label, entries] of [
    ["Infinity", { 2: Infinity }],
    ["-Infinity", { 2: -Infinity }],
    ["NaN", { 2: NaN }],
    ["Infinity - Infinity", { 1: Infinity, 4: -Infinity }],
  ])
    await t.test(label, async () => {
      for (const n of [7, 5e3]) {
        const a = {
          n,
          x: withValues(values(n, 1), entries),
          incx: 1,
          y: values(n, 2).map(Math.abs),
          incy: 1,
        };
        const got = await ddot(device, a.n, a.x, a.incx, a.y, a.incy);
        assertIeeeMatch(got.dot, ddotReference(a), `n=${n} dot`);
      }
    });
});
test("ddot f32 exponent range (regression)", async (t) => {
  for (const [label, xs, ys] of [
    ["an input past f32's range", { 2: 1e300 }, {}],
    ["inputs below f32's range", { 2: 1e-50 }, { 4: -1e-50 }],
    ["a product past f32's range", { 2: 1e20 }, { 2: 1e20 }],
  ])
    await t.test(label, async () => {
      const a = {
        n: 7,
        x: withValues(values(7, 1), xs),
        incx: 1,
        y: withValues(values(7, 2), ys),
        incy: 1,
      };
      const got = await ddot(device, a.n, a.x, a.incx, a.y, a.incy);
      assertIeeeMatch(
        got.dot,
        saturate(ddotReference(argsInF32Range(a))),
        "dot",
      );
    });
});
