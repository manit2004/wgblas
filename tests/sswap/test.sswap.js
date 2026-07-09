import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { sswap } from "wgblas/sswap";
import stdlibSswap from "@stdlib/blas-base-sswap";
import { loadParam, runValidation } from "../helpers/validation.js";
import { runFixtures, maxUlp } from "../helpers/fixtures.js";

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
  incy:   loadParam("incy"),
  x:      loadParam("x"),
  y:      loadParam("y"),
};

test("sswap validation", async (t) => {
  await runValidation(t, validationSpecs,
    (a) => sswap(a.device, a.n, a.x, a.incx, a.y, a.incy),
    { device },
  );
});

test("sswap fixtures", async (t) => {
  await runFixtures(
    t,                 // node:test context
    "sswap",           // routine name — used in the diagnostic label
    device,            // WebGPU device instance
    NUM_RUNS,          // 100 random inputs
    0,                 // threshold 0 — swap is exact, output must match reference bit-for-bit
    validationSpecs,   // param specs used to generate random inputs
    async (dev, a) => sswap(dev, a.n, a.x, a.incx, a.y, a.incy),  // GPU call
    (a) => {                                                          // CPU reference — sswap modifies x and y in-place so slice() both
      const x = a.x.slice();
      const y = a.y.slice();
      stdlibSswap(a.n, x, a.incx, y, a.incy);
      return { x, y };
    },
    (gpu, ref) => Math.max(maxUlp(gpu.x, ref.x).max, maxUlp(gpu.y, ref.y).max),  // max ULP across both vectors
  );
});

test("sswap edge cases", async (t) => {
  await t.test("basic swap — both vectors fully exchanged", async () => {
    const { x: ox, y: oy } = await sswap(device, 3, new Float32Array([1, 2, 3]), 1, new Float32Array([4, 5, 6]), 1);
    assert.deepEqual(ox, new Float32Array([4, 5, 6]));
    assert.deepEqual(oy, new Float32Array([1, 2, 3]));
  });

  await t.test("incx=2, incy=1 — gap elements in x untouched", async () => {
    // swaps x[0]↔y[0], x[2]↔y[1], x[4]↔y[2]; x[1] and x[3] must stay 99
    const { x: ox, y: oy } = await sswap(device, 3, new Float32Array([1, 99, 2, 99, 3]), 2, new Float32Array([4, 5, 6]), 1);
    assert.deepEqual(ox, new Float32Array([4, 99, 5, 99, 6]));
    assert.deepEqual(oy, new Float32Array([1, 2, 3]));
  });

  await t.test("incx=1, incy=2 — gap elements in y untouched", async () => {
    // swaps x[0]↔y[0], x[1]↔y[2], x[2]↔y[4]; y[1] and y[3] must stay 99
    const { x: ox, y: oy } = await sswap(device, 3, new Float32Array([1, 2, 3]), 1, new Float32Array([4, 99, 5, 99, 6]), 2);
    assert.deepEqual(ox, new Float32Array([4, 5, 6]));
    assert.deepEqual(oy, new Float32Array([1, 99, 2, 99, 3]));
  });

  await t.test("negative values preserved across swap", async () => {
    const { x: ox, y: oy } = await sswap(device, 2, new Float32Array([-1, -2]), 1, new Float32Array([3, 4]), 1);
    assert.deepEqual(ox, new Float32Array([3, 4]));
    assert.deepEqual(oy, new Float32Array([-1, -2]));
  });

  await t.test("n=1 — single element exchange", async () => {
    const { x: ox, y: oy } = await sswap(device, 1, new Float32Array([7]), 1, new Float32Array([8]), 1);
    assert.deepEqual(ox, new Float32Array([8]));
    assert.deepEqual(oy, new Float32Array([7]));
  });
});
