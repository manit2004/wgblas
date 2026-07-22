import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { sgemv } from "wgblas/sgemv";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
// GPU may fuse multiply-add (FMA, one rounding) while CPU may compute (alpha·A)·x,
// producing up to 2 extra eps per term from the different multiplication order. Combined
// with FMA fusion in the final alpha*acc+beta*y step this doubles the raw bound, so a
// factor of 4 gives headroom for all known GPU-vs-CPU rounding paths.
import { forwardFactor } from "../helpers.js";
import { sgemvReference as stdlibReference } from "../../helpers/stdlib.js";
import edgeCases from "../edge-cases.json" with { type: "json" };

const NUM_RUNS = 100;
const THRESHOLD = 4;

let device;
before(async () => {
  device = await init();
});
after(() => {
  cleanup();
});


const validationSpecs = {
  device: loadParam("device"),
  trans:  loadParam("trans"),
  m:      loadParam("m"),
  n:      loadParam("n"),
  alpha:  loadParam("alpha"),
  beta:   loadParam("beta"),
  lda:    loadParam("lda"),
  A:      loadParam("A"),
  x:      loadParam("x"),
  incx:   loadParam("incx"),
  y:      loadParam("y"),
  incy:   loadParam("incy"),
};

test("sgemv validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => sgemv(a.device, a.trans, a.m, a.n, a.alpha, a.A, a.lda, a.x, a.incx, a.beta, a.y, a.incy),
    { device },
  );
});

// Cap m and n for fixtures — validationSpecs allows up to 200×1000 matrices which makes
// property tests prohibitively slow. Keep validation coverage wide, fixtures fast.
const fixtureSpecs = {
  ...validationSpecs,
  m: { ...validationSpecs.m, range: { min: 1, max: 50 } },
  n: { ...validationSpecs.n, range: { min: 1, max: 50 } },
};

test("sgemv fixtures", async (t) => {
  await runFixtures(
    t,                   // node:test context
    "sgemv",             // routine name — used in failure labels
    device,              // GPUDevice from before()
    NUM_RUNS,            // number of fast-check runs
    THRESHOLD,           // max allowed forward error factor
    fixtureSpecs,        // param specs used to generate random inputs (m, n capped at 50 for speed)
    async (dev, a) => sgemv(dev, a.trans, a.m, a.n, a.alpha, a.A, a.lda, a.x, a.incx, a.beta, a.y, a.incy), // GPU impl
    stdlibReference,     // CPU reference
    forwardFactor,       // error metric: max |err| / (eps * per-element bound) across output
  );
});

// Small hand-picked scenarios loaded from edge-cases.json. Expected output is
// computed live from stdlib, not hardcoded.
test("sgemv edge cases", async (t) => {
  for (const tc of edgeCases) {
    await t.test(tc.label, async () => {
      const a = {
        trans: tc.trans,             // whether to use A or Aᵀ
        m: tc.m,                     // rows of A
        n: tc.n,                     // columns of A
        alpha: tc.alpha,             // scale factor for A·x
        A: new Float32Array(tc.A),   // matrix, row-major, size m*lda
        lda: tc.lda,                 // leading dimension (row stride) of A
        x: new Float32Array(tc.x),   // input vector
        incx: tc.incx,               // stride through x
        beta: tc.beta,               // scale factor applied to existing y before accumulating
        y: new Float32Array(tc.y),   // input/output vector
        incy: tc.incy,               // stride through y
      };
      const got = await sgemv(
        device,   // GPU device
        a.trans,  // whether to use A or Aᵀ
        a.m,      // rows of A
        a.n,      // columns of A
        a.alpha,  // scale factor for A·x
        a.A,      // matrix, row-major, size m*lda
        a.lda,    // leading dimension (row stride) of A
        a.x,      // input vector
        a.incx,   // stride through x
        a.beta,   // scale factor applied to existing y before accumulating
        a.y,      // input/output vector
        a.incy,   // stride through y
      );
      const expected = stdlibReference(a);
      assert.deepEqual(got.y, expected.y);
    });
  }
});
