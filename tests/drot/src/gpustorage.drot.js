// GPU-resident (GpuVector) coverage for drot — same inputs and stdlib
// oracle as test.drot.js, run through the overload where x/y stay on the
// GPU across the call.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, GpuVector } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { drot } from "wgblas/drot";
import { loadParam } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { withGpuResources } from "../../helpers/gpustorage.js";
import { forwardFactor } from "../helpers.js";
import { drotReference as stdlibReference } from "../../helpers/stdlib.js";
import edgeCases from "../edge-cases.json" with { type: "json" };

const NUM_RUNS = 100;
// Same cap as test.drot.js — see the comment there.
const THRESHOLD = 5;

let device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => {
  cleanup();
});

const validationSpecs = {
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
    stdlibReference,
    forwardFactor,
  );
});

// callGpuResident always reads x/y back itself regardless of what drot()
// returned, so it can't see drot's own n<=0 return value — this calls drot
// directly to check the GPU-resident early return actually is `{}` (never
// exercised by the fixtures/edge-case tests above, which never pass n<=0).
test("drot returns {} for n<=0 with a GPU-resident x/y", async () => {
  await withGpuResources(
    {
      x: () => GpuVector.from(new Float64Array([1, 2])),
      y: () => GpuVector.from(new Float64Array([3, 4])),
    },
    async ({ x, y }) => {
      const result = await drot(device, 0, x, 1, y, 1, 1, 0);
      assert.deepEqual(result, {});
    },
  );
});

test("drot edge cases (GPU-resident)", async (t) => {
  for (const tc of edgeCases) {
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
      const expected = stdlibReference(a);
      const factor = forwardFactor(got, expected, a);
      assert.ok(
        factor <= THRESHOLD,
        `${tc.label}: got x=${got.x}, y=${got.y}, expected x=${expected.x}, y=${expected.y} (forward factor ${factor} > ${THRESHOLD})`,
      );
    });
  }
});
