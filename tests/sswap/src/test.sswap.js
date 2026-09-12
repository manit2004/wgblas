import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, randomFloat32Array } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { sswap } from "wgblas/sswap";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures, maxUlp } from "../../helpers/fixtures.js";
import { sswapReference as stdlibReference } from "../../helpers/stdlib.js";
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
  incy: loadParam("incy"),
  x: loadParam("x"),
  y: loadParam("y"),
};

test("sswap validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => sswap(a.device, a.n, a.x, a.incx, a.y, a.incy),
    { device },
  );
});

test("sswap fixtures", async (t) => {
  await runFixtures(
    t, // node:test context
    "sswap", // routine name — used in the diagnostic label
    device, // WebGPU device instance
    NUM_RUNS, // 100 random inputs
    0, // threshold 0 — swap is exact, output must match reference bit-for-bit
    validationSpecs, // param specs used to generate random inputs
    async (dev, a) => sswap(dev, a.n, a.x, a.incx, a.y, a.incy), // GPU call
    stdlibReference, // CPU reference
    (gpu, ref) => Math.max(maxUlp(gpu.x, ref.x).max, maxUlp(gpu.y, ref.y).max), // max ULP across both vectors
  );
});

// Small hand-picked scenarios loaded from edge-cases.json. Expected output is
// computed live from stdlib, not hardcoded.
test("sswap edge cases", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n, // vector length
        x: new Float32Array(c.x), // vector to swap
        incx: c.incx, // stride through x
        y: new Float32Array(c.y), // vector to swap
        incy: c.incy, // stride through y
      };
      const got = await sswap(
        device, // GPU device
        a.n, // vector length
        a.x, // vector to swap
        a.incx, // stride through x
        a.y, // vector to swap
        a.incy, // stride through y
      );
      const expected = stdlibReference(a);
      assert.deepEqual(got.x, expected.x);
      assert.deepEqual(got.y, expected.y);
    });
  }
});

// n=0 has zero logical elements to touch, so the only correct behavior is a
// true no-op. The edge-cases block above only asserts "does not throw" for
// n<=0 entries, so an implementation that scribbles on x/y before an early
// return (or otherwise mishandles n=0) would still pass everything above.
// This checks both x and y come back byte-identical to what went in.
test("sswap zero-dimension (regression)", async () => {
  const x = randomFloat32Array(8, -1, 1, 300);
  const y = randomFloat32Array(8, -1, 1, 301);
  const beforeX = x.slice();
  const beforeY = y.slice();

  const got = await sswap(device, 0, x, 1, y, 1);

  assert.deepEqual(Array.from(got.x), Array.from(beforeX));
  assert.deepEqual(Array.from(got.y), Array.from(beforeY));
});
