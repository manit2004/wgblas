import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { sscal } from "wgblas/sscal";
import stdlibSscal from "@stdlib/blas-base-sscal";
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
    (a) => {                                                     // CPU reference — sscal modifies x in-place so slice() first
      const x = a.x.slice();
      stdlibSscal(a.n, a.alpha, x, a.incx);
      return x;
    },
    (gpu, ref) => maxUlp(gpu, ref).max,                         // max ULP across all elements of x
  );
});

test("sscal edge cases", async (t) => {
  await t.test("alpha=0 — all elements zeroed", async () => {
    const out = await sscal(device, 3, 0, new Float32Array([1, 2, 3]), 1);
    assert.deepEqual(out, new Float32Array([0, 0, 0]));
  });

  await t.test("alpha=1 — x unchanged", async () => {
    const out = await sscal(device, 3, 1, new Float32Array([1, 2, 3]), 1);
    assert.deepEqual(out, new Float32Array([1, 2, 3]));
  });

  await t.test("alpha=-1 — sign flip on every element", async () => {
    const out = await sscal(device, 3, -1, new Float32Array([1, -2, 3]), 1);
    assert.deepEqual(out, new Float32Array([-1, 2, -3]));
  });

  await t.test("all zeros scaled by anything → all zeros", async () => {
    const out = await sscal(device, 3, 5, new Float32Array([0, 0, 0]), 1);
    assert.deepEqual(out, new Float32Array([0, 0, 0]));
  });

  await t.test("incx=2 — gap elements untouched", async () => {
    // scales x[0]=1, x[2]=2, x[4]=3 by 2; x[1] and x[3] must stay 99
    const out = await sscal(device, 3, 2, new Float32Array([1, 99, 2, 99, 3]), 2);
    assert.deepEqual(out, new Float32Array([2, 99, 4, 99, 6]));
  });

  await t.test("n=1 — single element", async () => {
    const out = await sscal(device, 1, 3, new Float32Array([5]), 1);
    assert.deepEqual(out, new Float32Array([15]));
  });
});
