import { edge_cases_default, forwardFactor } from "./chunk-XJIONN34.mjs";
import { srotmReference } from "./chunk-3I5F4OKA.mjs";
import {
  loadParam,
  rotmParamArb,
  runFixtures,
  runValidation,
} from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, init, srotm } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import { randomFloat32Array } from "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/srotm/src/test.srotm.js
var NUM_RUNS = 100;
var paramSpec = loadParam("param");
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
  x: loadParam("x"),
  y: loadParam("y"),
  param: paramSpec,
};
test("srotm validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => srotm(a.device, a.n, a.x, a.incx, a.y, a.incy, a.param),
    { device },
  );
});
test("srotm fixtures", async (t) => {
  await runFixtures(
    t,
    // node:test context
    "srotm",
    // routine name — used in the diagnostic label
    device,
    // WebGPU device instance
    NUM_RUNS,
    // 100 random inputs
    1,
    // threshold 1 — forward error factor ≤ 1
    validationSpecs,
    // param specs used to generate random inputs
    async (dev, a) => srotm(dev, a.n, a.x, a.incx, a.y, a.incy, a.param),
    // GPU call
    srotmReference,
    // CPU reference
    forwardFactor,
    // |err| / (eps * |bound|) — see helpers.js
    { param: paramArb },
    // custom arbitrary for param — flag + matrix coefficients generated separately
  );
});
test("srotm edge cases", async (t) => {
  for (const tc of edge_cases_default) {
    await t.test(tc.label, async () => {
      const a = {
        n: tc.n,
        // vector length
        x: new Float32Array(tc.x),
        // input/output vector
        incx: tc.incx,
        // stride through x
        y: new Float32Array(tc.y),
        // input/output vector
        incy: tc.incy,
        // stride through y
        param: new Float32Array(tc.param),
        // [flag, h11, h21, h12, h22] modified Givens matrix
      };
      const got = await srotm(
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
      const expected = srotmReference(a);
      assert_default.deepEqual(got.x, expected.x);
      assert_default.deepEqual(got.y, expected.y);
    });
  }
});
test("srotm zero-dimension (regression)", async () => {
  const x = randomFloat32Array(8, -1, 1, 300);
  const y = randomFloat32Array(8, -1, 1, 301);
  const beforeX = x.slice();
  const beforeY = y.slice();
  const param = new Float32Array([-1, 2, 0, 0, 3]);
  const got = await srotm(device, 0, x, 1, y, 1, param);
  assert_default.deepEqual(Array.from(got.x), Array.from(beforeX));
  assert_default.deepEqual(Array.from(got.y), Array.from(beforeY));
});
