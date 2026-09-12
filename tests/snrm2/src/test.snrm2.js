import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, randomFloat32Array } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { snrm2 } from "wgblas/snrm2";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures, ulpDiff } from "../../helpers/fixtures.js";
import { snrm2Reference as stdlibReference } from "../../helpers/stdlib.js";
import edgeCases from "../edge-cases.json" with { type: "json" };

const NUM_RUNS = 100;

let device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => {
  cleanup();
});

const validationSpecs = {
  device: loadParam("device"),
  n: loadParam("n"),
  incx: loadParam("incx"),
  x: loadParam("x"),
};

test("snrm2 validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => snrm2(a.device, a.n, a.x, a.incx),
    { device },
  );
});

test("snrm2 fixtures", async (t) => {
  await runFixtures(
    t, // node:test context
    "snrm2", // routine name — used in the diagnostic label
    device, // WebGPU device instance
    NUM_RUNS, // 100 random inputs
    50, // threshold 50 ULP — GPU uses tree reduction, CPU is sequential; rounding order differs
    validationSpecs, // param specs used to generate random inputs
    async (dev, a) => snrm2(dev, a.n, a.x, a.incx), // GPU call
    stdlibReference, // CPU reference
    (gpu, ref) => ulpDiff(gpu.nrm2, ref), // raw ULP difference between scalar results
  );
});

// Small hand-picked scenarios loaded from edge-cases.json. Expected output is
// computed live from stdlib, not hardcoded.
test("snrm2 edge cases", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n, // vector length
        x: new Float32Array(c.x), // input vector
        incx: c.incx, // stride through x
      };
      const { nrm2: got } = await snrm2(
        device, // GPU device
        a.n, // vector length
        a.x, // input vector
        a.incx, // stride through x
      );
      const expected = stdlibReference(a);
      assert.strictEqual(got, expected);
    });
  }
});

// n=0 has zero logical elements to touch, so the only correct norm is
// exactly 0. The edge-cases block above only asserts "does not throw" for
// n<=0 entries, so an implementation that mishandles n=0 (e.g. dispatches a
// pass over stale buffer contents) could still pass everything above.
test("snrm2 zero-dimension (regression)", async () => {
  const x = randomFloat32Array(8, -1, 1, 300);

  const { nrm2: got } = await snrm2(device, 0, x, 1);

  assert.strictEqual(got, 0);
});
