import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fc from "fast-check";
import { init, cleanup } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { srotm } from "wgblas/srotm";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures, floatArb } from "../../helpers/fixtures.js";
// GPU may fuse multiply-add (FMA, one rounding) while CPU stdlib does two separate roundings.
// Near cancellation raw ULP is unbounded, so we use |err| / (eps * |bound|) instead.
// https://www.w3.org/TR/WGSL/#fma-builtin §17.5.32, 15.7.2
import { forwardFactor } from "../helpers.js";
import { srotmReference as stdlibReference } from "../../helpers/stdlib.js";
import edgeCases from "../edge-cases.json" with { type: "json" };

const NUM_RUNS = 100;

// flag must be picked before the h-coefficients since it selects which are meaningful (see forwardFactor).
const paramSpec = loadParam("param");
const paramArb = fc.integer({ min: 0, max: paramSpec.range.flags.length - 1 }) // pick an index into range.flags
  .chain((fi) => {
    const flag = paramSpec.range.flags[fi];       // resolve index -> actual flag value (-1, 0, or 1)
    const { min, max } = paramSpec.range.coeff;    // coefficient bounds from param.json
    return fc.tuple(floatArb(min, max), floatArb(min, max), floatArb(min, max), floatArb(min, max))
      .map(([h11, h21, h12, h22]) => new Float32Array([flag, h11, h21, h12, h22])); // pack into srotm's param shape
  });

let device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
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
    stdlibReference,      // CPU reference
    forwardFactor,        // |err| / (eps * |bound|) — see helpers.js
    { param: paramArb },  // custom arbitrary for param — flag + matrix coefficients generated separately
  );
});

// Small hand-picked scenarios loaded from edge-cases.json. Expected output is
// computed live from stdlib, not hardcoded.
test("srotm edge cases", async (t) => {
  for (const tc of edgeCases) {
    await t.test(tc.label, async () => {
      const a = {
        n: tc.n,                        // vector length
        x: new Float32Array(tc.x),      // input/output vector
        incx: tc.incx,                  // stride through x
        y: new Float32Array(tc.y),      // input/output vector
        incy: tc.incy,                  // stride through y
        param: new Float32Array(tc.param), // [flag, h11, h21, h12, h22] modified Givens matrix
      };
      const got = await srotm(
        device,    // GPU device
        a.n,       // vector length
        a.x,       // input/output vector
        a.incx,    // stride through x
        a.y,       // input/output vector
        a.incy,    // stride through y
        a.param,   // [flag, h11, h21, h12, h22] modified Givens matrix
      );
      const expected = stdlibReference(a);
      assert.deepEqual(got.x, expected.x);
      assert.deepEqual(got.y, expected.y);
    });
  }
});
