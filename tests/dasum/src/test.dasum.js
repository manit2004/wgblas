import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { dasum } from "wgblas/dasum";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { dasumReference as stdlibReference } from "../../helpers/stdlib.js";
import { ulpDiff64 } from "../../helpers/ulp.js";
import edgeCases from "../edge-cases.json" with { type: "json" };

const NUM_RUNS = 100;
const THRESHOLD = 64;

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
  x:      loadParam("x64"),
};

// Cap n for fixtures — validationSpecs allows up to 1000, which makes property tests slow.
const fixtureSpecs = { ...validationSpecs, n: { ...validationSpecs.n, range: { min: 1, max: 50 } } };

test("dasum validation", async (t) => {
  await runValidation(t, validationSpecs,
    (a) => dasum(a.device, a.n, a.x, a.incx),
    { device },
  );
});

test("dasum fixtures", async (t) => {
  await runFixtures(
    t,                 // node:test context
    "dasum",           // routine name — used in the diagnostic label
    device,            // WebGPU device instance
    NUM_RUNS,          // 100 random inputs
    THRESHOLD,         // max allowed f64 ULP difference
    fixtureSpecs,      // param specs used to generate random inputs
    async (dev, a) => dasum(dev, a.n, a.x, a.incx), // GPU call
    stdlibReference,   // CPU reference
    (gpu, ref) => ulpDiff64(gpu.asum, ref),         // raw f64 ULP difference between results
  );
});

// Small hand-picked scenarios loaded from edge-cases.json. Expected output is
// computed live from stdlib, not hardcoded.
test("dasum edge cases", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,                    // vector length
        x: new Float64Array(c.x),  // input vector
        incx: c.incx,              // stride through x
      };
      const { asum: got } = await dasum(
        device,   // GPU device
        a.n,      // vector length
        a.x,      // input vector
        a.incx,   // stride through x
      );
      const expected = stdlibReference(a);
      assert.ok(
        ulpDiff64(got, expected) <= THRESHOLD,
        `${c.label}: got ${got}, expected ${expected} (ULP diff ${ulpDiff64(got, expected)} > ${THRESHOLD})`,
      );
    });
  }
});
