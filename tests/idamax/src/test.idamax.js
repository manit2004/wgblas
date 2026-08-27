import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { idamax } from "wgblas/idamax";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { idamaxReference as stdlibReference } from "../../helpers/stdlib.js";
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
  x:      loadParam("x64"),
};

test("idamax validation", async (t) => {
  await runValidation(t, validationSpecs,
    (a) => idamax(a.device, a.n, a.x, a.incx),
    { device },
  );
});

test("idamax fixtures", async (t) => {
  await runFixtures(
    t,                 // node:test context
    "idamax",          // routine name — used in the diagnostic label
    device,            // WebGPU device instance
    NUM_RUNS,          // 100 random inputs
    0,                 // threshold 0 — index must match exactly.
    validationSpecs,   // param specs used to generate random inputs
    async (dev, a) => idamax(dev, a.n, a.x, a.incx),        // GPU call
    stdlibReference,   // CPU reference
    (gpu, ref) => (gpu.index === ref ? 0 : 1),                // 0 if correct, 1 if wrong
  );
});

// Small hand-picked scenarios loaded from edge-cases.json. Expected output is
// computed live from stdlib, not hardcoded.
test("idamax edge cases", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,                    // vector length
        x: new Float64Array(c.x),  // input vector
        incx: c.incx,              // stride through x
      };
      const { index: got } = await idamax(
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

// Mirrors the isamax NaN tests — same `>` comparison, same documented
// divergence from CBLAS when x[0] is NaN. See idamax.d.mts.
test("idamax NaN handling", async (t) => {
  const run = async (arr) => (await idamax(device, arr.length, new Float64Array(arr), 1)).index;
  const N = NaN, Inf = Infinity;

  await t.test("NaN elements are skipped, not selected", async () => {
    assert.equal(await run([1, N, 7, 3]), 2);
    assert.equal(await run([1, 2, 3, N]), 2);
  });

  await t.test("an all-NaN vector returns index 0", async () => {
    assert.equal(await run([N, N, N, N]), 0);
  });

  await t.test("a leading NaN is skipped — documented divergence from CBLAS", async () => {
    assert.equal(await run([N, 5, 2, 3]), 1);
    assert.equal(await run([N, Inf, 2, 3]), 1);
  });

  await t.test("infinities compare normally", async () => {
    assert.equal(await run([1, Inf, 2, 3]), 1);
    assert.equal(await run([1, -Inf, 2, 3]), 1);
  });
});
