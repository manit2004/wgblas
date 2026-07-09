import { test, before, after } from "node:test";
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
