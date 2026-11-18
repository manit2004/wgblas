import {
  all,
  assertBitIdentical,
  fullPrecisionFrom,
} from "./chunk-WTAHVNYX.mjs";
import {
  argsInF32Range,
  assertIeeeMatch,
  values,
  withValues,
} from "./chunk-VGOUGUHQ.mjs";
import { edge_cases_default, forwardFactor } from "./chunk-OLVQTT3Y.mjs";
import { dcopyReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures, runValidation } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, dcopy, init } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import { randomFloat64Array } from "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/dcopy/src/test.dcopy.js
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
test("dcopy validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => dcopy(a.device, a.n, a.x, a.incx, a.y, a.incy),
    { device },
  );
});
test("dcopy fixtures", async (t) => {
  await runFixtures(
    t,
    // node:test context
    "dcopy",
    // routine name — used in the diagnostic label
    device,
    // WebGPU device instance
    NUM_RUNS,
    // 100 random inputs
    THRESHOLD,
    // forward error factor cap — see above
    validationSpecs,
    // param specs used to generate random inputs
    async (dev, a) => dcopy(dev, a.n, a.x, a.incx, a.y, a.incy),
    // GPU call
    dcopyReference,
    // CPU reference
    forwardFactor,
    // eps * |x_i| — see helpers.js
  );
});
test("dcopy edge cases", async (t) => {
  for (const c of edge_cases_default) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,
        // vector length
        x: new Float64Array(c.x),
        // source vector
        incx: c.incx,
        // stride through x
        y: new Float64Array(c.y),
        // destination vector — overwritten with x
        incy: c.incy,
        // stride through y
      };
      const got = await dcopy(
        device,
        // GPU device
        a.n,
        // vector length
        a.x,
        // source vector
        a.incx,
        // stride through x
        a.y,
        // destination vector — overwritten with x
        a.incy,
        // stride through y
      );
      const expected = dcopyReference(a);
      const factor = forwardFactor(got, expected, a);
      assert_default.ok(
        factor <= THRESHOLD,
        `${c.label}: got ${got.y}, expected ${expected.y} (forward factor ${factor} > ${THRESHOLD})`,
      );
    });
  }
});
test("dcopy zero-dimension (regression)", async () => {
  const x = randomFloat64Array(8, -1, 1, 300);
  const y = randomFloat64Array(8, -1, 1, 301);
  const before2 = y.slice();
  const got = await dcopy(device, 0, x, 1, y, 1);
  assert_default.deepEqual(Array.from(got.y), Array.from(before2));
});
test("dcopy exactness (regression)", async () => {
  const full = fullPrecisionFrom(920);
  const x = full(12);
  const y = full(18);
  const got = await dcopy(device, 6, x, 2, y, 3);
  const want = Float64Array.from(y, (v, i) =>
    i % 3 === 0 ? x[(i / 3) * 2] : v,
  );
  assertBitIdentical(got.y, want, all(y.length), "y");
});
test("dcopy f32 exponent range (regression)", async () => {
  const a = {
    n: 5,
    x: withValues(values(5, 1), { 1: 1e300, 2: -1e300, 3: 1e-50 }),
    incx: 1,
    y: withValues(values(5, 2), { 4: 1e300 }),
    incy: 1,
  };
  const got = await dcopy(device, a.n, a.x, a.incx, a.y, a.incy);
  assertIeeeMatch(got.y, dcopyReference(argsInF32Range(a)).y, "y");
});
