import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { sasum } from "wgblas/sasum";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures, ulpDiff } from "../../helpers/fixtures.js";
import { sasumReference as stdlibReference } from "../../helpers/stdlib.js";
import edgeCases from "../edge-cases.json" with { type: "json" };

const NUM_RUNS = 100;

let device;
before(async () => {
  device = await init();
});
after(() => {
  cleanup();
});

const validationSpecs = {
  device: loadParam("device"),
  n:      loadParam("n"),
  incx:   loadParam("incx"),
  x:      loadParam("x"),
};

test("sasum validation", async (t) => {
  await runValidation(t, validationSpecs,
    (a) => sasum(a.device, a.n, a.x, a.incx),
    { device },
  );
});

test("sasum fixtures", async (t) => {
  await runFixtures(
    t,                 // node:test context
    "sasum",           // routine name — used in the diagnostic label
    device,            // WebGPU device instance
    NUM_RUNS,          // 100 random inputs
    50,                // threshold 50 ULP — GPU uses tree reduction, CPU is sequential; rounding order differs
    validationSpecs,   // param specs used to generate random inputs
    async (dev, a) => sasum(dev, a.n, a.x, a.incx),        // GPU call
    stdlibReference,   // CPU reference
    (gpu, ref) => ulpDiff(gpu.asum, ref),                    // raw ULP difference between results
  );
});

// Small hand-picked scenarios loaded from edge-cases.json. Expected output is
// computed live from stdlib, not hardcoded.
test("sasum edge cases", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,                    // vector length
        x: new Float32Array(c.x),  // input vector
        incx: c.incx,              // stride through x
      };
      const { asum: got } = await sasum(
        device,   // GPU device
        a.n,      // vector length
        a.x,      // input vector
        a.incx,   // stride through x
      );
      const expected = stdlibReference(a);
      assert.strictEqual(got, expected);
    });
  }
});
