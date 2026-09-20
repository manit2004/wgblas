// GPU-resident coverage for dcopy — same inputs/oracle as test.dcopy.js,
// through the overload where x and y stay on the GPU.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, GpuVector } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { dcopy } from "wgblas/dcopy";
import { loadParam } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { withGpuResources } from "../../helpers/gpustorage.js";
import { dcopyReference as stdlibReference } from "../../helpers/stdlib.js";
// See test.dcopy.js for why this uses forwardFactor instead of raw ULP64.
import { forwardFactor } from "../helpers.js";
import edgeCases from "../edge-cases.json" with { type: "json" };

const NUM_RUNS = 100;
// Same cap as test.dcopy.js — see the comment there.
const THRESHOLD = 2;

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
    stdlibReference,
    forwardFactor,
  );
});

// callGpuResident always reads y back itself regardless of what dcopy()
// returned, so it can't see dcopy's own n<=0 return value — this calls dcopy
// directly to check the GPU-resident early return actually is `{}` (never
// exercised by the fixtures/edge-case tests above, which never pass n<=0).
test("dcopy returns {} for n<=0 with a GPU-resident y", async () => {
  await withGpuResources(
    {
      x: () => GpuVector.from(new Float64Array([1, 2])),
      y: () => GpuVector.from(new Float64Array([3, 4])),
    },
    async ({ x, y }) => {
      const result = await dcopy(device, 0, x, 1, y, 1);
      assert.deepEqual(result, {});
    },
  );
});

test("dcopy edge cases (GPU-resident)", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,
        x: new Float64Array(c.x),
        incx: c.incx,
        y: new Float64Array(c.y),
        incy: c.incy,
      };
      const got = await callGpuResident(device, a);
      const expected = stdlibReference(a);
      const factor = forwardFactor(got, expected, a);
      assert.ok(
        factor <= THRESHOLD,
        `${c.label}: got ${got.y}, expected ${expected.y} (forward factor ${factor} > ${THRESHOLD})`,
      );
    });
  }
});
