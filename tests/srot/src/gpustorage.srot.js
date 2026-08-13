// GPU-resident (GpuVector) coverage for srot — same inputs and stdlib oracle
// as test.srot.js, run through the overload where x/y stay on the GPU across
// the call.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, GpuVector } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { srot } from "wgblas/srot";
import { loadParam } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { withGpuResources } from "../../helpers/gpustorage.js";
import { forwardFactor } from "../helpers.js";
import { srotReference as stdlibReference } from "../../helpers/stdlib.js";
import edgeCases from "../edge-cases.json" with { type: "json" };

const NUM_RUNS = 100;

let device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => {
  cleanup();
});

const validationSpecs = {
  device: loadParam("device"),
  n:      loadParam("n"),
  incx:   loadParam("incx"),
  incy:   loadParam("incy"),
  x:      loadParam("x"),
  y:      loadParam("y"),
  c:      loadParam("cosine"),
  s:      loadParam("s"),
};

async function callGpuResident(dev, a) {
  return withGpuResources(
    { x: GpuVector.from(a.x), y: GpuVector.from(a.y) },
    async ({ x, y }) => {
      await srot(dev, a.n, x, a.incx, y, a.incy, a.c, a.s);
      const [xOut, yOut] = await Promise.all([x.read(), y.read()]);
      return { x: xOut, y: yOut };
    },
  );
}

test("srot fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,                     // node:test context
    "srot (GPU-resident)", // routine name — used in the diagnostic label
    device,                // WebGPU device instance
    NUM_RUNS,              // 100 random inputs
    1,                     // threshold 1 — forward error factor ≤ 1 means within one rounding of true result
    validationSpecs,       // param specs used to generate random inputs
    callGpuResident,       // GPU call — wraps x and y into GpuVectors
    stdlibReference,       // CPU reference
    forwardFactor,         // |err| / (eps * |bound|) — see helpers.js
  );
});

test("srot edge cases (GPU-resident)", async (t) => {
  for (const tc of edgeCases) {
    await t.test(tc.label, async () => {
      const a = {
        n: tc.n,                     // vector length
        x: new Float32Array(tc.x),   // input/output vector
        incx: tc.incx,               // stride through x
        y: new Float32Array(tc.y),   // input/output vector
        incy: tc.incy,               // stride through y
        c: tc.c,                     // rotation cosine
        s: tc.s,                     // rotation sine
      };
      const got = await callGpuResident(device, a);
      const expected = stdlibReference(a);
      assert.deepEqual(got.x, expected.x);
      assert.deepEqual(got.y, expected.y);
    });
  }
});
