import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { sscal } from "wgblas/sscal";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures, maxUlp } from "../../helpers/fixtures.js";
import { sscalReference as stdlibReference } from "../../helpers/stdlib.js";
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
  alpha:  loadParam("alpha"),
  x:      loadParam("x"),
};

test("sscal validation", async (t) => {
  await runValidation(t, validationSpecs,
    (a) => sscal(a.device, a.n, a.alpha, a.x, a.incx),
    { device },
  );
});

test("sscal fixtures", async (t) => {
  await runFixtures(
    t,                 // node:test context
    "sscal",           // routine name — used in the diagnostic label
    device,            // WebGPU device instance
    NUM_RUNS,          // 100 random inputs
    0,                 // threshold 0 — scalar multiply is exact at f32, output must match bit-for-bit
    validationSpecs,   // param specs used to generate random inputs
    async (dev, a) => sscal(dev, a.n, a.alpha, a.x, a.incx),  // GPU call
    stdlibReference,   // CPU reference
    (gpu, ref) => maxUlp(gpu.x, ref.x).max,                     // max ULP across all elements of x
  );
});

// Small hand-picked scenarios loaded from edge-cases.json. Expected output is
// computed live from stdlib, not hardcoded.
test("sscal edge cases", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,                    // vector length
        alpha: c.alpha,            // scale factor
        x: new Float32Array(c.x),  // vector to scale
        incx: c.incx,              // stride through x
      };
      const got = await sscal(
        device,   // GPU device
        a.n,      // vector length
        a.alpha,  // scale factor
        a.x,      // vector to scale
        a.incx,   // stride through x
      );
      const expected = stdlibReference(a);
      assert.deepEqual(got.x, expected.x);
    });
  }
});
