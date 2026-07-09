import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { snrm2 } from "wgblas/snrm2";
import stdlibSnrm2 from "@stdlib/blas-base-snrm2";
import { loadParam, runValidation } from "../helpers/validation.js";
import { runFixtures, ulpDiff } from "../helpers/fixtures.js";

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

test("snrm2 validation", async (t) => {
  await runValidation(t, validationSpecs,
    (a) => snrm2(a.device, a.n, a.x, a.incx),
    { device },
  );
});

test("snrm2 fixtures", async (t) => {
  await runFixtures(
    t,                 // node:test context
    "snrm2",           // routine name — used in the diagnostic label
    device,            // WebGPU device instance
    NUM_RUNS,          // 100 random inputs
    50,                // threshold 50 ULP — GPU uses tree reduction, CPU is sequential; rounding order differs
    validationSpecs,   // param specs used to generate random inputs
    async (dev, a) => snrm2(dev, a.n, a.x, a.incx),        // GPU call
    (a) => stdlibSnrm2(a.n, a.x.slice(), a.incx),           // CPU reference 
    (gpu, ref) => ulpDiff(gpu.nrm2, ref),                    // raw ULP difference between scalar results
  );
});

test("snrm2 edge cases", async (t) => {
  await t.test("Pythagorean triple — exact integer result", async () => {
    // sqrt(3²+4²) = sqrt(25) = 5 exactly
    const { nrm2 } = await snrm2(device, 2, new Float32Array([3, 4]), 1);
    assert.strictEqual(nrm2, 5);
  });

  await t.test("all negatives — same result as positives", async () => {
    // squaring eliminates sign: sqrt((-3)²+(-4)²) = 5
    const { nrm2 } = await snrm2(device, 2, new Float32Array([-3, -4]), 1);
    assert.strictEqual(nrm2, 5);
  });

  await t.test("unit vector — norm = 1", async () => {
    const { nrm2 } = await snrm2(device, 3, new Float32Array([1, 0, 0]), 1);
    assert.strictEqual(nrm2, 1);
  });

  await t.test("all zeros — norm = 0", async () => {
    const { nrm2 } = await snrm2(device, 3, new Float32Array([0, 0, 0]), 1);
    assert.strictEqual(nrm2, 0);
  });

  await t.test("n=1 negative element — norm is non-negative", async () => {
    const { nrm2 } = await snrm2(device, 1, new Float32Array([-5]), 1);
    assert.strictEqual(nrm2, 5);
  });

  await t.test("incx=2 — Pythagorean triple on strided elements", async () => {
    // reads x[0]=3, x[2]=4; skips x[1]=99 → norm = 5
    const { nrm2 } = await snrm2(device, 2, new Float32Array([3, 99, 4]), 2);
    assert.strictEqual(nrm2, 5);
  });
});