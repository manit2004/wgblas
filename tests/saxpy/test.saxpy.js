import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { saxpy } from "wgblas/saxpy";
import stdlibSaxpy from "@stdlib/blas-base-saxpy";
import { loadParam, runValidation } from "../helpers/validation.js";
import { runFixtures } from "../helpers/fixtures.js";
// GPU may fuse multiply-add (FMA, one rounding) while CPU stdlib does two separate roundings.
// Near cancellation raw ULP is unbounded, so we use |err| / (eps * |bound|) instead.
// https://www.w3.org/TR/WGSL/#fma-builtin §17.5.32, 15.7.2.
import { forwardFactor } from "./helpers.js";

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
  alpha:  loadParam("alpha"),
  x:      loadParam("x"),
  y:      loadParam("y"),
};

test("saxpy validation", async (t) => {
  await runValidation(t, validationSpecs,
    (a) => saxpy(a.device, a.n, a.alpha, a.x, a.incx, a.y, a.incy),
    { device },
  );
});

test("saxpy fixtures", async (t) => {
  await runFixtures(
    t,                 // node:test context
    "saxpy",           // routine name — used in the diagnostic label
    device,            // WebGPU device instance
    NUM_RUNS,          // 100 random inputs
    1,                 // threshold 1 — forward error factor ≤ 1 means within one rounding of true result
    validationSpecs,   // param specs used to generate random inputs
    async (dev, a) => saxpy(dev, a.n, a.alpha, a.x, a.incx, a.y, a.incy),  // GPU call
    (a) => {                                                                  // CPU reference
      const y = a.y.slice();
      stdlibSaxpy(a.n, a.alpha, a.x.slice(), a.incx, y, a.incy);
      return { y };
    },
    forwardFactor,     // |err| / (eps * |bound|) — see helpers.js
  );
});

test("saxpy edge cases", async (t) => {
  await t.test("alpha=0 — y unchanged even with large x", async () => {
    const { y: out } = await saxpy(device, 3, 0, new Float32Array([100, 200, 300]), 1, new Float32Array([3, 4, 5]), 1);
    assert.deepEqual(out, new Float32Array([3, 4, 5]));
  });

  await t.test("alpha=1 — reduces to y[i] += x[i]", async () => {
    const { y: out } = await saxpy(device, 3, 1, new Float32Array([1, 2, 3]), 1, new Float32Array([4, 5, 6]), 1);
    assert.deepEqual(out, new Float32Array([5, 7, 9]));
  });

  await t.test("alpha=-1 — reduces to y[i] -= x[i]", async () => {
    const { y: out } = await saxpy(device, 3, -1, new Float32Array([1, 2, 3]), 1, new Float32Array([4, 5, 6]), 1);
    assert.deepEqual(out, new Float32Array([3, 3, 3]));
  });

  await t.test("x all zeros — y unchanged regardless of alpha", async () => {
    const { y: out } = await saxpy(device, 3, 5, new Float32Array([0, 0, 0]), 1, new Float32Array([1, 2, 3]), 1);
    assert.deepEqual(out, new Float32Array([1, 2, 3]));
  });

  await t.test("incx=2, incy=1 — independent strides", async () => {
    // x strided: x[0]=1, x[2]=2, x[4]=3; y contiguous; alpha=2 → [2*1+10, 2*2+20, 2*3+30]
    const { y: out } = await saxpy(device, 3, 2, new Float32Array([1, 99, 2, 99, 3]), 2, new Float32Array([10, 20, 30]), 1);
    assert.deepEqual(out, new Float32Array([12, 24, 36]));
  });

  await t.test("n=1 — single element", async () => {
    const { y: out } = await saxpy(device, 1, 2, new Float32Array([5]), 1, new Float32Array([3]), 1);
    assert.deepEqual(out, new Float32Array([13]));
  });
});
