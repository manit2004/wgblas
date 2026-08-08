import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { scopy } from "wgblas/scopy";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures, maxUlp } from "../../helpers/fixtures.js";
import { scopyReference as stdlibReference } from "../../helpers/stdlib.js";
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
};

test("scopy validation", async (t) => {
  await runValidation(t, validationSpecs,
    (a) => scopy(a.device, a.n, a.x, a.incx, a.y, a.incy),
    { device },
  );
});

test("scopy fixtures", async (t) => {
  await runFixtures(
    t,                 // node:test context
    "scopy",           // routine name — used in the diagnostic label
    device,            // WebGPU device instance
    NUM_RUNS,          // 100 random inputs
    0,                 // threshold 0 — scopy is exact, output must match reference bit-for-bit
    validationSpecs,   // param specs used to generate random inputs
    async (dev, a) => scopy(dev, a.n, a.x, a.incx, a.y, a.incy),  // GPU call
    stdlibReference,   // CPU reference
    (gpu, ref) => maxUlp(gpu.y, ref.y).max,                          // max ULP across all elements of y
  );
});

// Small hand-picked scenarios loaded from edge-cases.json. Expected output is
// computed live from stdlib, not hardcoded.
test("scopy edge cases", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,                    // vector length
        x: new Float32Array(c.x),  // source vector
        incx: c.incx,              // stride through x
        y: new Float32Array(c.y),  // destination vector — overwritten with x
        incy: c.incy,              // stride through y
      };
      const got = await scopy(
        device,   // GPU device
        a.n,      // vector length
        a.x,      // source vector
        a.incx,   // stride through x
        a.y,      // destination vector — overwritten with x
        a.incy,   // stride through y
      );
      const expected = stdlibReference(a);
      assert.deepEqual(got.y, expected.y);
    });
  }
});
