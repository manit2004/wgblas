// GPU-resident (GpuVector) coverage for srotm — same inputs and stdlib oracle
// as test.srotm.js, run through the overload where x/y stay on the GPU across
// the call. param is always a plain Float32Array (srotm.mjs never accepts a
// GpuVector for it), so only x and y are wrapped here.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fc from "fast-check";
import { init, cleanup, GpuVector } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { srotm } from "wgblas/srotm";
import { loadParam } from "../../helpers/validation.js";
import { runFixtures, floatArb } from "../../helpers/fixtures.js";
import { withGpuResources } from "../../helpers/gpustorage.js";
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

async function callGpuResident(dev, a) {
  return withGpuResources(
    { x: GpuVector.from(a.x), y: GpuVector.from(a.y) },
    async ({ x, y }) => {
      await srotm(dev, a.n, x, a.incx, y, a.incy, a.param);
      const [xOut, yOut] = await Promise.all([x.read(), y.read()]);
      return { x: xOut, y: yOut };
    },
  );
}

test("srotm fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,                      // node:test context
    "srotm (GPU-resident)", // routine name — used in the diagnostic label
    device,                 // WebGPU device instance
    NUM_RUNS,               // 100 random inputs
    1,                      // threshold 1 — forward error factor ≤ 1
    validationSpecs,        // param specs used to generate random inputs
    callGpuResident,        // GPU call — wraps x and y into GpuVectors
    stdlibReference,        // CPU reference
    forwardFactor,          // |err| / (eps * |bound|) — see helpers.js
    { param: paramArb },    // custom arbitrary for param — flag + matrix coefficients generated separately
  );
});

test("srotm edge cases (GPU-resident)", async (t) => {
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
      const got = await callGpuResident(device, a);
      const expected = stdlibReference(a);
      assert.deepEqual(got.x, expected.x);
      assert.deepEqual(got.y, expected.y);
    });
  }
});
