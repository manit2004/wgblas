import { edge_cases_default, forwardFactor } from "./chunk-J5IGMP2R.mjs";
import { withGpuResources } from "./chunk-KSBTCQGM.mjs";
import { drotReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { GpuVector, cleanup, drot, init } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/drot/src/gpustorage.drot.js
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
async function callGpuResident(dev, a) {
  return withGpuResources(
    { x: () => GpuVector.from(a.x), y: () => GpuVector.from(a.y) },
    async ({ x, y }) => {
      await drot(dev, a.n, x, a.incx, y, a.incy, a.c, a.s);
      const [xOut, yOut] = await Promise.all([x.read(), y.read()]);
      return { x: xOut, y: yOut };
    },
  );
}
test("drot fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,
    "drot (GPU-resident)",
    device,
    NUM_RUNS,
    THRESHOLD,
    validationSpecs,
    callGpuResident,
    drotReference,
    forwardFactor,
  );
});
test("drot returns {} for n<=0 with a GPU-resident x/y", async () => {
  await withGpuResources(
    {
      x: () => GpuVector.from(new Float64Array([1, 2])),
      y: () => GpuVector.from(new Float64Array([3, 4])),
    },
    async ({ x, y }) => {
      const result = await drot(device, 0, x, 1, y, 1, 1, 0);
      assert_default.deepEqual(result, {});
    },
  );
});
test("drot edge cases (GPU-resident)", async (t) => {
  for (const tc of edge_cases_default) {
    await t.test(tc.label, async () => {
      const a = {
        n: tc.n,
        x: new Float64Array(tc.x),
        incx: tc.incx,
        y: new Float64Array(tc.y),
        incy: tc.incy,
        c: tc.c,
        s: tc.s,
      };
      const got = await callGpuResident(device, a);
      const expected = drotReference(a);
      const factor = forwardFactor(got, expected, a);
      assert_default.ok(
        factor <= THRESHOLD,
        `${tc.label}: got x=${got.x}, y=${got.y}, expected x=${expected.x}, y=${expected.y} (forward factor ${factor} > ${THRESHOLD})`,
      );
    });
  }
});
