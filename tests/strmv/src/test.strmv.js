import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { strmv } from "wgblas/strmv";
import { runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { forwardFactor, stdlibReference, validationSpecs, fixtureSpecs, makeY } from "../helpers.js";
import edgeCases from "../edge-cases.json" with { type: "json" };

const NUM_RUNS = 100;
const THRESHOLD = 2;

let device;
before(async () => {
  device = await init();
});
after(() => {
  cleanup();
});

test("strmv validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => strmv(a.device, a.uplo, a.trans, a.diag, a.n, a.A, a.lda, a.x, a.incx, a.y, a.incy),
    { device },
  );
});

test("strmv fixtures", async (t) => {
  await runFixtures(
    t,                   // node:test context
    "strmv",             // routine name
    device,              // GPUDevice
    NUM_RUNS,            // number of fast-check runs
    THRESHOLD,           // max allowed forward error factor
    fixtureSpecs,        // param specs used to generate random inputs (n capped at 50 for speed)
    async (dev, a) => strmv(dev, a.uplo, a.trans, a.diag, a.n, a.A, a.lda, a.x, a.incx, a.y, a.incy), // GPU impl
    stdlibReference,     // CPU reference — stdlib solves in place on x, remapped into wgblas's y shape
    forwardFactor,       // error metric: max |err| / (eps * per-element bound) across output
  );
});

// Small hand-picked scenarios (transpose x uplo x diag combos, non-unit strides)
// loaded from edge-cases.json. Expected output is computed live from stdlib —
test("strmv edge cases", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = { // case params, JSON arrays converted to typed arrays
        uplo: c.uplo, trans: c.trans, diag: c.diag, n: c.n,
        A: new Float32Array(c.A), lda: c.lda,
        x: new Float32Array(c.x), incx: c.incx,
        y: makeY(c.n, c.incy), incy: c.incy,
      };
      const { y: got } = await strmv(device, a.uplo, a.trans, a.diag, a.n, a.A, a.lda, a.x, a.incx, a.y, a.incy); // GPU result
      const { y: expected } = stdlibReference(a); // stdlib result
      assert.deepEqual(got, expected);
    });
  }
});
