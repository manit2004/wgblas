import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { scopy } from "wgblas/scopy";
import stdlibScopy from "@stdlib/blas-base-scopy";
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
    (a) => {                                                          // CPU reference
      const y = a.y.slice();
      stdlibScopy(a.n, a.x.slice(), a.incx, y, a.incy);
      return { y };
    },
    (gpu, ref) => maxUlp(gpu.y, ref.y).max,                          // max ULP across all elements of y
  );
});

test("scopy edge cases", async (t) => {
  await t.test("incx=2, incy=1 — independent strides", async () => {
    // reads x[0]=1, x[2]=2, x[4]=3; writes y contiguously
    const { y: out } = await scopy(device, 3, new Float32Array([1, 99, 2, 99, 3]), 2, new Float32Array([0, 0, 0]), 1);
    assert.deepEqual(out, new Float32Array([1, 2, 3]));
  });

  await t.test("incx=1, incy=2 — odd y slots untouched", async () => {
    // writes y[0]=1, y[2]=2, y[4]=3; y[1] and y[3] must stay 99
    const { y: out } = await scopy(device, 3, new Float32Array([1, 2, 3]), 1, new Float32Array([0, 99, 0, 99, 0]), 2);
    assert.deepEqual(out, new Float32Array([1, 99, 2, 99, 3]));
  });

  await t.test("y elements beyond n are untouched", async () => {
    // n=2 writes only y[0] and y[1]; y[2..4] must stay at original values
    const { y: out } = await scopy(device, 2, new Float32Array([7, 8]), 1, new Float32Array([1, 2, 3, 4, 5]), 1);
    assert.deepEqual(out, new Float32Array([7, 8, 3, 4, 5]));
  });

  await t.test("negative values preserved — bitwise copy", async () => {
    const { y: out } = await scopy(device, 3, new Float32Array([-1, -2, -3]), 1, new Float32Array([0, 0, 0]), 1);
    assert.deepEqual(out, new Float32Array([-1, -2, -3]));
  });

  await t.test("n=1 — single element", async () => {
    const { y: out } = await scopy(device, 1, new Float32Array([5]), 1, new Float32Array([0]), 1);
    assert.deepEqual(out, new Float32Array([5]));
  });
});