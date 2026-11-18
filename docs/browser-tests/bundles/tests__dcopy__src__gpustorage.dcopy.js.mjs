import { withGpuResources } from "./chunk-KSBTCQGM.mjs";
import { edge_cases_default, forwardFactor } from "./chunk-OLVQTT3Y.mjs";
import { dcopyReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { GpuVector, cleanup, dcopy, init } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/dcopy/src/gpustorage.dcopy.js
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
async function callGpuResident(dev, a) {
  return withGpuResources(
    { x: () => GpuVector.from(a.x), y: () => GpuVector.from(a.y) },
    async ({ x, y }) => {
      await dcopy(dev, a.n, x, a.incx, y, a.incy);
      return { y: await y.read() };
    },
  );
}
test("dcopy fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,
    "dcopy (GPU-resident)",
    device,
    NUM_RUNS,
    THRESHOLD,
    validationSpecs,
    callGpuResident,
    dcopyReference,
    forwardFactor,
  );
});
test("dcopy returns {} for n<=0 with a GPU-resident y", async () => {
  await withGpuResources(
    {
      x: () => GpuVector.from(new Float64Array([1, 2])),
      y: () => GpuVector.from(new Float64Array([3, 4])),
    },
    async ({ x, y }) => {
      const result = await dcopy(device, 0, x, 1, y, 1);
      assert_default.deepEqual(result, {});
    },
  );
});
test("dcopy edge cases (GPU-resident)", async (t) => {
  for (const c of edge_cases_default) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,
        x: new Float64Array(c.x),
        incx: c.incx,
        y: new Float64Array(c.y),
        incy: c.incy,
      };
      const got = await callGpuResident(device, a);
      const expected = dcopyReference(a);
      const factor = forwardFactor(got, expected, a);
      assert_default.ok(
        factor <= THRESHOLD,
        `${c.label}: got ${got.y}, expected ${expected.y} (forward factor ${factor} > ${THRESHOLD})`,
      );
    });
  }
});
