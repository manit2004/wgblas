// GPU-resident (GpuMatrix/GpuVector) coverage for sgemv — same inputs and
// stdlib oracle as test.sgemv.js, run through the overload where A/x/y stay
// on the GPU across the call.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, GpuMatrix, GpuVector } from "wgblas";
import { sgemv } from "wgblas/sgemv";
import { loadParam } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { padMatrix, withGpuResources } from "../../helpers/gpustorage.js";
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

// Cap m and n for fixtures — validationSpecs allows up to 200×1000 matrices which makes
// property tests prohibitively slow. Keep validation coverage wide, fixtures fast.
const fixtureSpecs = {
  ...validationSpecs,
  m: { ...validationSpecs.m, range: { min: 1, max: 50 } },
  n: { ...validationSpecs.n, range: { min: 1, max: 50 } },
};

async function callGpuResident(dev, a) {
  return withGpuResources(
    {
      A: GpuMatrix.from(padMatrix(a.A, a.m, a.lda), a.m, a.n, a.lda),
      x: GpuVector.from(a.x),
      y: GpuVector.from(a.y),
    },
    async ({ A, x, y }) => {
      await sgemv(dev, a.trans, a.m, a.n, a.alpha, A, a.lda, x, a.incx, a.beta, y, a.incy);
      return { y: await y.read() };
    },
  );
}

test("sgemv fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,                      // node:test context
    "sgemv (GPU-resident)", // routine name — used in the diagnostic label
    device,                 // WebGPU device instance
    NUM_RUNS,               // number of fast-check runs
    THRESHOLD,              // max allowed forward error factor
    fixtureSpecs,           // param specs used to generate random inputs (m, n capped at 50 for speed)
    callGpuResident,        // GPU call — wraps A, x, y into GpuMatrix/GpuVectors
    stdlibReference,        // CPU reference
    forwardFactor,          // error metric: max |err| / (eps * per-element bound) across output
  );
});

test("sgemv edge cases (GPU-resident)", async (t) => {
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
      const got = await callGpuResident(device, a);
      const expected = stdlibReference(a);
      assert.deepEqual(got.y, expected.y);
    });
  }
});
