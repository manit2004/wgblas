import { edge_cases_default, forwardFactor } from "./chunk-XJIONN34.mjs";
import { withGpuResources } from "./chunk-KSBTCQGM.mjs";
import { srotmReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, rotmParamArb, runFixtures } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { GpuVector, cleanup, init, srotm } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/srotm/src/gpustorage.srotm.js
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
async function callGpuResident(dev, a) {
  return withGpuResources(
    { x: () => GpuVector.from(a.x), y: () => GpuVector.from(a.y) },
    async ({ x, y }) => {
      await srotm(dev, a.n, x, a.incx, y, a.incy, a.param);
      const [xOut, yOut] = await Promise.all([x.read(), y.read()]);
      return { x: xOut, y: yOut };
    },
  );
}
test("srotm fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,
    // node:test context
    "srotm (GPU-resident)",
    // routine name — used in the diagnostic label
    device,
    // WebGPU device instance
    NUM_RUNS,
    // 100 random inputs
    1,
    // threshold 1 — forward error factor ≤ 1
    validationSpecs,
    // param specs used to generate random inputs
    callGpuResident,
    // GPU call — wraps x and y into GpuVectors
    srotmReference,
    // CPU reference
    forwardFactor,
    // |err| / (eps * |bound|) — see helpers.js
    { param: paramArb },
    // custom arbitrary for param — flag + matrix coefficients generated separately
  );
});
test("srotm edge cases (GPU-resident)", async (t) => {
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
      const got = await callGpuResident(device, a);
      const expected = srotmReference(a);
      assert_default.deepEqual(got.x, expected.x);
      assert_default.deepEqual(got.y, expected.y);
    });
  }
});
