import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { sasum } from "wgblas/sasum";
import stdlibSasum from "@stdlib/blas-base-sasum";
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
    (a) => stdlibSasum(a.n, a.x.slice(), a.incx),           // CPU reference
    (gpu, ref) => ulpDiff(gpu.asum, ref),                    // raw ULP difference between results
  );
});

test("sasum edge cases", async (t) => {
  await t.test("all negative — abs applied to each element", async () => {
    // signed sum = -9, abs sum = 9
    const { asum } = await sasum(device, 4, new Float32Array([-3, -1, -4, -1]), 1);
    assert.strictEqual(asum, 9);
  });

  await t.test("mixed signs — abs sum not net sum", async () => {
    // signed sum = 5, abs sum = 205 — catches any impl that does plain summation
    const { asum } = await sasum(device, 3, new Float32Array([100, -100, 5]), 1);
    assert.strictEqual(asum, 205);
  });

  await t.test("all zeros → 0", async () => {
    const { asum } = await sasum(device, 3, new Float32Array([0, 0, 0]), 1);
    assert.strictEqual(asum, 0);
  });

  await t.test("n=1 negative element", async () => {
    const { asum } = await sasum(device, 1, new Float32Array([-7]), 1);
    assert.strictEqual(asum, 7);
  });

  await t.test("incx=2 — only strided elements summed", async () => {
    // considers x[0]=1, x[2]=2, x[4]=3 — skips x[1]=99 and x[3]=99
    const { asum } = await sasum(device, 3, new Float32Array([1, 99, 2, 99, 3]), 2);
    assert.strictEqual(asum, 6);
  });
});