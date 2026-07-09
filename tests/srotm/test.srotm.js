import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fc from "fast-check";
import { init, cleanup } from "wgblas";
import { srotm } from "wgblas/srotm";
import stdlibSrotm from "@stdlib/blas-base-srotm";
import { loadParam, runValidation } from "../helpers/validation.js";
import { runFixtures, floatArb } from "../helpers/fixtures.js";
// GPU may fuse multiply-add (FMA, one rounding) while CPU stdlib does two separate roundings.
// Near cancellation raw ULP is unbounded, so we use |err| / (eps * |bound|) instead.
// https://www.w3.org/TR/WGSL/#fma-builtin §17.5.32, 15.7.2
import { forwardFactor } from "./helpers.js";

const NUM_RUNS = 100;

const paramSpec = loadParam("param");
const paramArb = fc.integer({ min: 0, max: paramSpec.range.flags.length - 1 })
  .chain((fi) => {
    const flag = paramSpec.range.flags[fi];
    const { min, max } = paramSpec.range.coeff;
    return fc.tuple(floatArb(min, max), floatArb(min, max), floatArb(min, max), floatArb(min, max))
      .map(([h11, h21, h12, h22]) => new Float32Array([flag, h11, h21, h12, h22]));
  });

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
  param:  paramSpec,
};

test("srotm validation", async (t) => {
  await runValidation(t, validationSpecs,
    (a) => srotm(a.device, a.n, a.x, a.incx, a.y, a.incy, a.param),
    { device },
  );
});

test("srotm fixtures", async (t) => {
  await runFixtures(
    t,                    // node:test context
    "srotm",              // routine name — used in the diagnostic label
    device,               // WebGPU device instance
    NUM_RUNS,             // 100 random inputs
    1,                    // threshold 1 — forward error factor ≤ 1
    validationSpecs,      // param specs used to generate random inputs
    async (dev, a) => srotm(dev, a.n, a.x, a.incx, a.y, a.incy, a.param),  // GPU call
    (a) => {                                                                   // CPU reference
      const x = a.x.slice();
      const y = a.y.slice();
      stdlibSrotm(a.n, x, a.incx, y, a.incy, a.param);
      return { x, y };
    },
    forwardFactor,        // |err| / (eps * |bound|) — see helpers.js
    { param: paramArb },  // custom arbitrary for param — flag + matrix coefficients generated separately
  );
});

test("srotm edge cases", async (t) => {
  await t.test("flag=-2 — identity, both vectors unchanged", async () => {
    // flag=-2 always applies H=I regardless of h values
    const { x: ox, y: oy } = await srotm(device, 3, new Float32Array([1, 2, 3]), 1, new Float32Array([4, 5, 6]), 1, new Float32Array([-2, 99, 99, 99, 99]));
    assert.deepEqual(ox, new Float32Array([1, 2, 3]));
    assert.deepEqual(oy, new Float32Array([4, 5, 6]));
  });

  await t.test("flag=-1 — full matrix, diagonal scaling", async () => {
    // H = [[2,0],[0,3]]: x[i]*=2, y[i]*=3
    const { x: ox, y: oy } = await srotm(device, 2, new Float32Array([1, 2]), 1, new Float32Array([3, 4]), 1, new Float32Array([-1, 2, 0, 0, 3]));
    assert.deepEqual(ox, new Float32Array([2, 4]));
    assert.deepEqual(oy, new Float32Array([9, 12]));
  });

  await t.test("flag=0 — h11=h22=1 implied; x[i]+=y[i], y unchanged", async () => {
    // H = [[1,1],[0,1]]: x[i]=x[i]+y[i], y[i]=y[i]
    const { x: ox, y: oy } = await srotm(device, 2, new Float32Array([1, 2]), 1, new Float32Array([3, 4]), 1, new Float32Array([0, 99, 0, 1, 99]));
    assert.deepEqual(ox, new Float32Array([4, 6]));
    assert.deepEqual(oy, new Float32Array([3, 4]));
  });

  await t.test("flag=1 — h12=1, h21=-1 implied; x[i]+=y[i], y[i]-=x_orig[i]", async () => {
    // H = [[1,1],[-1,1]]: x[i]=x[i]+y[i], y[i]=-x_orig[i]+y[i]
    const { x: ox, y: oy } = await srotm(device, 2, new Float32Array([1, 2]), 1, new Float32Array([3, 4]), 1, new Float32Array([1, 1, 99, 99, 1]));
    assert.deepEqual(ox, new Float32Array([4, 6]));
    assert.deepEqual(oy, new Float32Array([2, 2]));
  });

  await t.test("flag=-1, incx=2 incy=1 — gap elements in x untouched", async () => {
    // H = [[2,0],[0,3]]; reads x[0]=1, x[2]=2; reads y[0]=3, y[1]=4; x[1] must stay 99
    const { x: ox, y: oy } = await srotm(device, 2, new Float32Array([1, 99, 2]), 2, new Float32Array([3, 4]), 1, new Float32Array([-1, 2, 0, 0, 3]));
    assert.deepEqual(ox, new Float32Array([2, 99, 4]));
    assert.deepEqual(oy, new Float32Array([9, 12]));
  });
});
