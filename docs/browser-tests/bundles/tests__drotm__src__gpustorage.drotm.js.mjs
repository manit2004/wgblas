import { edge_cases_default, forwardFactor } from "./chunk-36ZXVBW3.mjs";
import { withGpuResources } from "./chunk-KSBTCQGM.mjs";
import { drotmReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, rotmParamArb, runFixtures } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { GpuVector, cleanup, drotm, init } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/drotm/src/gpustorage.drotm.js
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
async function callGpuResident(dev, a) {
  return withGpuResources(
    { x: () => GpuVector.from(a.x), y: () => GpuVector.from(a.y) },
    async ({ x, y }) => {
      await drotm(dev, a.n, x, a.incx, y, a.incy, a.param);
      const [xOut, yOut] = await Promise.all([x.read(), y.read()]);
      return { x: xOut, y: yOut };
    },
  );
}
test("drotm fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,
    "drotm (GPU-resident)",
    device,
    NUM_RUNS,
    THRESHOLD,
    validationSpecs,
    callGpuResident,
    drotmReference,
    forwardFactor,
    { param: paramArb },
  );
});
test("drotm edge cases (GPU-resident)", async (t) => {
  for (const tc of edge_cases_default) {
    await t.test(tc.label, async () => {
      const a = {
        n: tc.n,
        x: new Float64Array(tc.x),
        incx: tc.incx,
        y: new Float64Array(tc.y),
        incy: tc.incy,
        param: new Float64Array(tc.param),
      };
      const got = await callGpuResident(device, a);
      const expected = drotmReference(a);
      const factor = forwardFactor(got, expected, a);
      assert_default.ok(
        factor <= THRESHOLD,
        `${tc.label}: got x=${got.x}, y=${got.y}, expected x=${expected.x}, y=${expected.y} (forward factor ${factor} > ${THRESHOLD})`,
      );
    });
  }
});
