import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { sdot } from "wgblas/sdot";
import stdlibSdot from "@stdlib/blas-base-sdot";
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
  x:      loadParam("x"),
  y:      loadParam("y"),
};

test("sdot validation", async (t) => {
  await runValidation(t, validationSpecs,
    (a) => sdot(a.device, a.n, a.x, a.incx, a.y, a.incy),
    { device },
  );
});

test("sdot fixtures", async (t) => {
  await runFixtures(
    t,                 // node:test context
    "sdot",            // routine name — used in the diagnostic label
    device,            // WebGPU device instance
    NUM_RUNS,          // 100 random inputs
    1,                 // threshold 1 — forward error factor ≤ 1 means within one rounding of true result
    validationSpecs,   // param specs used to generate random inputs
    async (dev, a) => sdot(dev, a.n, a.x, a.incx, a.y, a.incy),              // GPU call
    (a) => stdlibSdot(a.n, a.x.slice(), a.incx, a.y.slice(), a.incy),         // CPU reference — slice() to avoid mutating inputs
    forwardFactor,     // |err| / (eps * |bound|) — see helpers.js
  );
});

test("sdot edge cases", async (t) => {
  await t.test("orthogonal vectors — dot = 0", async () => {
    const { dot } = await sdot(device, 2, new Float32Array([1, 0]), 1, new Float32Array([0, 1]), 1);
    assert.strictEqual(dot, 0);
  });

  await t.test("dot with itself — equals sum of squares", async () => {
    // [3,4]·[3,4] = 9+16 = 25, always non-negative
    const { dot } = await sdot(device, 2, new Float32Array([3, 4]), 1, new Float32Array([3, 4]), 1);
    assert.strictEqual(dot, 25);
  });

  await t.test("x all zeros — dot = 0 regardless of y", async () => {
    const { dot } = await sdot(device, 3, new Float32Array([0, 0, 0]), 1, new Float32Array([1, 2, 3]), 1);
    assert.strictEqual(dot, 0);
  });

  await t.test("perfect cancellation — signed terms sum to zero", async () => {
    // 1*5 + (-1)*5 = 0
    const { dot } = await sdot(device, 2, new Float32Array([1, -1]), 1, new Float32Array([5, 5]), 1);
    assert.strictEqual(dot, 0);
  });

  await t.test("incx=2, incy=1 — independent strides", async () => {
    // reads x[0]=1, x[2]=2; reads y[0]=3, y[1]=4 → 1*3 + 2*4 = 11
    const { dot } = await sdot(device, 2, new Float32Array([1, 99, 2]), 2, new Float32Array([3, 4]), 1);
    assert.strictEqual(dot, 11);
  });

  await t.test("n=1 — single multiply", async () => {
    const { dot } = await sdot(device, 1, new Float32Array([3]), 1, new Float32Array([4]), 1);
    assert.strictEqual(dot, 12);
  });
});