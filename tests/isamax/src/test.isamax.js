import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { isamax } from "wgblas/isamax";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { isamaxReference as stdlibReference } from "../../helpers/stdlib.js";
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
  n:      loadParam("n"),
  incx:   loadParam("incx"),
  x:      loadParam("x"),
};

test("isamax validation", async (t) => {
  await runValidation(t, validationSpecs,
    (a) => isamax(a.device, a.n, a.x, a.incx),
    { device },
  );
});

test("isamax fixtures", async (t) => {
  await runFixtures(
    t,                 // node:test context
    "isamax",          // routine name — used in the diagnostic label
    device,            // WebGPU device instance
    NUM_RUNS,          // 100 random inputs
    0,                 // threshold 0 — index must match exactly.
    validationSpecs,   // param specs used to generate random inputs
    async (dev, a) => isamax(dev, a.n, a.x, a.incx),        // GPU call
    stdlibReference,   // CPU reference
    (gpu, ref) => (gpu.index === ref ? 0 : 1),                // 0 if correct, 1 if wrong
  );
});

// Small hand-picked scenarios loaded from edge-cases.json. Expected output is
// computed live from stdlib, not hardcoded.
test("isamax edge cases", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,                    // vector length
        x: new Float32Array(c.x),  // input vector
        incx: c.incx,              // stride through x
      };
      const { index: got } = await isamax(
        device,   // GPU device
        a.n,      // vector length
        a.x,      // input vector
        a.incx,   // stride through x
      );
      const expected = stdlibReference(a);
      assert.strictEqual(got, expected);
    });
  }
});

// NaN behaviour is documented in isamax.d.mts, so pin it: the search compares
// with `>`, which is false for NaN, so NaN is skipped rather than selected.
// JSON has no NaN literal, so these cannot live in edge-cases.json.
test("isamax NaN handling", async (t) => {
  const run = async (arr) => (await isamax(device, arr.length, new Float32Array(arr), 1)).index;
  const N = NaN, Inf = Infinity;

  await t.test("NaN elements are skipped, not selected", async () => {
    assert.equal(await run([1, N, 7, 3]), 2, "the largest non-NaN element should win");
    assert.equal(await run([1, 2, 3, N]), 2, "a trailing NaN must not be selected");
  });

  await t.test("an all-NaN vector returns index 0", async () => {
    // Nothing ever beats the -1.0 sentinel, so the initial index survives.
    assert.equal(await run([N, N, N, N]), 0);
  });

  await t.test("a leading NaN is skipped — documented divergence from CBLAS", async () => {
    // CBLAS seeds its running max from x[0]; with x[0] = NaN no later
    // comparison succeeds, so it returns 0. This skips the NaN instead.
    assert.equal(await run([N, 5, 2, 3]), 1, "should find the largest finite element");
    assert.equal(await run([N, Inf, 2, 3]), 1);
  });

  await t.test("infinities compare normally", async () => {
    assert.equal(await run([1, Inf, 2, 3]), 1, "+Infinity is the maximum");
    assert.equal(await run([1, -Inf, 2, 3]), 1, "|-Infinity| is the maximum");
  });
});
