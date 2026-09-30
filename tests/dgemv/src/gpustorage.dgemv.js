// GPU-resident (GpuMatrix/GpuVector) coverage for dgemv — same inputs and
// stdlib oracle as test.dgemv.js, run through the overload where A/x/y stay
// on the GPU across the call.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, GpuMatrix, GpuVector } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { dgemv } from "wgblas/dgemv";
import { loadParam } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { padMatrix, withGpuResources } from "../../helpers/gpustorage.js";
import { forwardFactor } from "../helpers.js";
import { dgemvReference as stdlibReference } from "../../helpers/stdlib.js";
import edgeCases from "../edge-cases.json" with { type: "json" };
import edgeCasesColumnMajor from "../edge-cases-column-major.json" with { type: "json" };

const NUM_RUNS = 100;
const THRESHOLD = 5;

let device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => {
  cleanup();
});

const validationSpecs = {
  device: loadParam("device"),
  trans: loadParam("trans"),
  m: loadParam("m"),
  n: loadParam("n"),
  alpha: loadParam("alpha64"),
  beta: loadParam("beta64"),
  lda: loadParam("lda"),
  A: loadParam("A64"),
  x: loadParam("x64"),
  incx: loadParam("incx"),
  y: loadParam("y64"),
  incy: loadParam("incy"),
  layout: loadParam("layout"),
};

// Cap m and n for fixtures — validationSpecs allows up to 200×1000 matrices which makes
// property tests prohibitively slow. Keep validation coverage wide, fixtures fast.
const fixtureSpecs = {
  ...validationSpecs,
  m: { ...validationSpecs.m, range: { min: 1, max: 50 } },
  n: { ...validationSpecs.n, range: { min: 1, max: 50 } },
};

// GpuMatrix's own layout wins over dgemv's layout arg, so a GPU-resident A
// never passes `layout` to dgemv() itself — only to GpuMatrix.from.
async function callGpuResident(dev, a) {
  const layout = a.layout ?? "row-major";
  const outerCount = layout === "column-major" ? a.n : a.m; // rows for row-major, cols for column-major
  return withGpuResources(
    {
      A: () =>
        GpuMatrix.from(
          padMatrix(a.A, outerCount, a.lda),
          a.m,
          a.n,
          a.lda,
          layout,
        ),
      x: () => GpuVector.from(a.x),
      y: () => GpuVector.from(a.y),
    },
    async ({ A, x, y }) => {
      await dgemv(
        dev,
        a.trans,
        a.m,
        a.n,
        a.alpha,
        A,
        a.lda,
        x,
        a.incx,
        a.beta,
        y,
        a.incy,
      );
      return { y: await y.read() };
    },
  );
}

test("dgemv fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t, // node:test context
    "dgemv (GPU-resident)", // routine name — used in the diagnostic label
    device, // WebGPU device instance
    NUM_RUNS, // number of fast-check runs
    THRESHOLD, // max allowed forward error factor
    fixtureSpecs, // param specs used to generate random inputs (m, n capped at 50 for speed)
    callGpuResident, // GPU call — wraps A, x, y into GpuMatrix/GpuVectors
    stdlibReference, // CPU reference
    forwardFactor, // error metric: max |err| / (eps * per-element bound) across output
  );
});

test("dgemv edge cases (GPU-resident)", async (t) => {
  for (const tc of edgeCases) {
    await t.test(tc.label, async () => {
      const a = {
        trans: tc.trans, // whether to use A or Aᵀ
        m: tc.m, // rows of A
        n: tc.n, // columns of A
        alpha: tc.alpha, // scale factor for A·x
        A: new Float64Array(tc.A), // matrix, row-major, size m*lda
        lda: tc.lda, // leading dimension (row stride) of A
        x: new Float64Array(tc.x), // input vector
        incx: tc.incx, // stride through x
        beta: tc.beta, // scale factor applied to existing y before accumulating
        y: new Float64Array(tc.y), // input/output vector
        incy: tc.incy, // stride through y
      };
      const got = await callGpuResident(device, a);
      const expected = stdlibReference(a);
      assert.deepEqual(got.y, expected.y);
    });
  }
});

test("dgemv edge cases (GPU-resident, column-major)", async (t) => {
  for (const tc of edgeCasesColumnMajor) {
    await t.test(tc.label, async () => {
      const a = {
        trans: tc.trans, // whether to use A or Aᵀ
        m: tc.m, // rows of A
        n: tc.n, // columns of A
        alpha: tc.alpha, // scale factor for A·x
        A: new Float64Array(tc.A), // matrix, column-major, size n*lda
        lda: tc.lda, // leading dimension (column stride) of A
        x: new Float64Array(tc.x), // input vector
        incx: tc.incx, // stride through x
        beta: tc.beta, // scale factor applied to existing y before accumulating
        y: new Float64Array(tc.y), // input/output vector
        incy: tc.incy, // stride through y
        layout: tc.layout, // "column-major"
      };
      const got = await callGpuResident(device, a);
      const expected = stdlibReference(a);
      assert.deepEqual(got.y, expected.y);
    });
  }
});
