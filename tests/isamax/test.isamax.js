import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { isamax } from "wgblas/isamax";
import stdlibIsamax from "@stdlib/blas-base-isamax";
import { loadParam, runValidation } from "../helpers/validation.js";
import { runFixtures } from "../helpers/fixtures.js";

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

test("isamax validation", async (t) => {
  await runValidation(t, validationSpecs,
    (a) => isamax(a.device, a.n, a.x, a.incx),
    { device },
  );
});

test("isamax fixtures", async (t) => {
  await runFixtures(
    t,                 // node:test context
    "isamax",          // routine name — used in the diagnostic label
    device,            // WebGPU device instance
    NUM_RUNS,          // 100 random inputs
    0,                 // threshold 0 — index must match exactly.
    validationSpecs,   // param specs used to generate random inputs
    async (dev, a) => isamax(dev, a.n, a.x, a.incx),        // GPU call
    (a) => stdlibIsamax(a.n, a.x.slice(), a.incx),           // CPU reference
    (gpu, ref) => (gpu.index === ref ? 0 : 1),                // 0 if correct, 1 if wrong
  );
});

test("isamax edge cases", async (t) => {
  await t.test("ties — smallest index wins (CBLAS behaviour)", async () => {
    const { index } = await isamax(device, 4, new Float32Array([3, -3, 1, 2]), 1);
    assert.strictEqual(index, 0);
  });

  await t.test("all same absolute value — index 0", async () => {
    const { index } = await isamax(device, 4, new Float32Array([5, -5, 5, -5]), 1);
    assert.strictEqual(index, 0);
  });

  await t.test("negative values compared by absolute value", async () => {
    const { index } = await isamax(device, 3, new Float32Array([2, -5, 3]), 1);
    assert.strictEqual(index, 1);
  });

  await t.test("all negative — largest absolute value wins", async () => {
    const { index } = await isamax(device, 3, new Float32Array([-1, -4, -2]), 1);
    assert.strictEqual(index, 1);
  });

  await t.test("all zeros — returns index 0", async () => {
    const { index } = await isamax(device, 3, new Float32Array([0, 0, 0]), 1);
    assert.strictEqual(index, 0);
  });

  await t.test("maximum at last position", async () => {
    const { index } = await isamax(device, 4, new Float32Array([1, 2, 3, 10]), 1);
    assert.strictEqual(index, 3);
  });

  await t.test("n=1 always returns index 0", async () => {
    const { index } = await isamax(device, 1, new Float32Array([-7]), 1);
    assert.strictEqual(index, 0);
  });

  await t.test("incx=2 — only considers strided elements", async () => {
    // considers x[0]=1, x[2]=5, x[4]=3 — max is at logical index 1
    const { index } = await isamax(device, 3, new Float32Array([1, 99, 5, 99, 3]), 2);
    assert.strictEqual(index, 1);
  });

  await t.test("incx=2 — tie on strided elements, smallest logical index wins", async () => {
    // considers x[0]=5, x[2]=5, x[4]=1 — tie at logical indices 0 and 1, expect 0
    const { index } = await isamax(device, 3, new Float32Array([5, 99, 5, 99, 1]), 2);
    assert.strictEqual(index, 0);
  });

  await t.test("tie in the middle — first occurrence wins", async () => {
    // x=[1, 5, 2, 5, 3] — tie at indices 1 and 3, expect 1
    const { index } = await isamax(device, 5, new Float32Array([1, 5, 2, 5, 3]), 1);
    assert.strictEqual(index, 1);
  });

  await t.test("incx=3 — stride correctness", async () => {
    // considers x[0]=1, x[3]=8, x[6]=3 — max is at logical index 1
    const { index } = await isamax(device, 3, new Float32Array([1, 99, 99, 8, 99, 99, 3]), 3);
    assert.strictEqual(index, 1);
  });
});
