import { test, before, after } from "node:test";
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