import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { srot } from "wgblas/srot";
import stdlibSrot from "@stdlib/blas-base-srot";
import { loadParam, runValidation } from "../helpers/validation.js";
import { runFixtures } from "../helpers/fixtures.js";
// GPU may fuse multiply-add (FMA, one rounding) while CPU stdlib does two separate roundings.
// Near cancellation raw ULP is unbounded, so we use |err| / (eps * |bound|) instead.
// https://www.w3.org/TR/WGSL/#fma-builtin §17.5.32, 15.7.2
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
  c:      loadParam("c"),
  s:      loadParam("s"),
};

test("srot validation", async (t) => {
  await runValidation(t, validationSpecs,
    (a) => srot(a.device, a.n, a.x, a.incx, a.y, a.incy, a.c, a.s),
    { device },
  );
});

test("srot fixtures", async (t) => {
  await runFixtures(
    t,                 // node:test context
    "srot",            // routine name — used in the diagnostic label
    device,            // WebGPU device instance
    NUM_RUNS,          // 100 random inputs
    1,                 // threshold 1 — forward error factor ≤ 1 means within one rounding of true result
    validationSpecs,   // param specs used to generate random inputs
    async (dev, a) => srot(dev, a.n, a.x, a.incx, a.y, a.incy, a.c, a.s),  // GPU call
    (a) => {                                                                   // CPU reference
      const x = a.x.slice();
      const y = a.y.slice();
      stdlibSrot(a.n, x, a.incx, y, a.incy, a.c, a.s);
      return { x, y };
    },
    forwardFactor,     // |err| / (eps * |bound|) — see helpers.js
  );
});

test("srot edge cases", async (t) => {
  await t.test("identity rotation (c=1, s=0) — both vectors unchanged", async () => {
    const { x: ox, y: oy } = await srot(device, 3, new Float32Array([1, 2, 3]), 1, new Float32Array([4, 5, 6]), 1, 1, 0);
    assert.deepEqual(ox, new Float32Array([1, 2, 3]));
    assert.deepEqual(oy, new Float32Array([4, 5, 6]));
  });

  await t.test("90° rotation (c=0, s=1) — x←y, y←−x", async () => {
    // x[i] = 0*x[i]+1*y[i] = y[i],  y[i] = 0*y[i]-1*x_orig[i] = -x[i]
    const { x: ox, y: oy } = await srot(device, 3, new Float32Array([1, 2, 3]), 1, new Float32Array([4, 5, 6]), 1, 0, 1);
    assert.deepEqual(ox, new Float32Array([4, 5, 6]));
    assert.deepEqual(oy, new Float32Array([-1, -2, -3]));
  });

  await t.test("n=1 — single pair", async () => {
    // c=0, s=1: x←y=3, y←-x_orig=-2
    const { x: ox, y: oy } = await srot(device, 1, new Float32Array([2]), 1, new Float32Array([3]), 1, 0, 1);
    assert.deepEqual(ox, new Float32Array([3]));
    assert.deepEqual(oy, new Float32Array([-2]));
  });

  await t.test("incx=2, incy=1 — gap elements in x untouched", async () => {
    // c=0, s=1; reads x[0]=1, x[2]=2; reads y[0]=3, y[1]=4; x[1] must stay 99
    // new x[0]=3, x[2]=4; new y[0]=-1, y[1]=-2
    const { x: ox, y: oy } = await srot(device, 2, new Float32Array([1, 99, 2]), 2, new Float32Array([3, 4]), 1, 0, 1);
    assert.deepEqual(ox, new Float32Array([3, 99, 4]));
    assert.deepEqual(oy, new Float32Array([-1, -2]));
  });
});
