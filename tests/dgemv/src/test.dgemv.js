import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, randomFloat64Array } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { dgemv } from "wgblas/dgemv";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { forwardFactor } from "../helpers.js";
import { dgemvReference as stdlibReference } from "../../helpers/stdlib.js";
import edgeCases from "../edge-cases.json" with { type: "json" };
import edgeCasesColumnMajor from "../edge-cases-column-major.json" with { type: "json" };

const NUM_RUNS = 100;
// Forward-error cap, pinned to the high-performance/NVIDIA-calibrated bound
// (see tests/dger/src/test.dger.js) — dgemv does a full DD tree reduction
// per row (same shape as ddot, THRESHOLD=1) plus an extra alpha*dot+beta*y
// combine, so like the other arithmetic f64 routines this is not expected
// to clear on the low-power/Intel backend.
const THRESHOLD = 5;

let device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => {
  cleanup();
});

const nSpec = loadParam("n");
const validationSpecs = {
  device: loadParam("device"),
  trans: loadParam("trans"),
  m: loadParam("m"),
  n: {
    ...nSpec,
    edge: nSpec.edge.filter((e) => e.value !== -1),
    invalid: [
      ...nSpec.invalid,
      { value: -1, error: "n must be non-negative", label: "negative" },
    ],
  },
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

test("dgemv validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) =>
      dgemv(
        a.device,
        a.trans,
        a.m,
        a.n,
        a.alpha,
        a.A,
        a.lda,
        a.x,
        a.incx,
        a.beta,
        a.y,
        a.incy,
        a.layout,
      ),
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

test("dgemv fixtures", async (t) => {
  await runFixtures(
    t, // node:test context
    "dgemv", // routine name — used in failure labels
    device, // GPUDevice from before()
    NUM_RUNS, // number of fast-check runs
    THRESHOLD, // max allowed forward error factor
    fixtureSpecs, // param specs used to generate random inputs (m, n capped at 50 for speed)
    async (dev, a) =>
      dgemv(
        dev,
        a.trans,
        a.m,
        a.n,
        a.alpha,
        a.A,
        a.lda,
        a.x,
        a.incx,
        a.beta,
        a.y,
        a.incy,
        a.layout,
      ), // GPU impl
    stdlibReference, // CPU reference
    forwardFactor, // error metric: max |err| / (eps * per-element bound) across output
  );
});

// Small hand-picked scenarios loaded from edge-cases.json. Expected output is
// computed live from stdlib, not hardcoded.
test("dgemv edge cases", async (t) => {
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
      const got = await dgemv(
        device, // GPU device
        a.trans, // whether to use A or Aᵀ
        a.m, // rows of A
        a.n, // columns of A
        a.alpha, // scale factor for A·x
        a.A, // matrix, row-major, size m*lda
        a.lda, // leading dimension (row stride) of A
        a.x, // input vector
        a.incx, // stride through x
        a.beta, // scale factor applied to existing y before accumulating
        a.y, // input/output vector
        a.incy, // stride through y
      );
      const expected = stdlibReference(a);
      assert.deepEqual(got.y, expected.y);
    });
  }
});

// Zero-dimension edge case: the CONTRACTION dimension (n for no-transpose,
// m for transpose) can be 0 while y stays nonempty, so this is
// value-observable, not vacuous. Both reference BLAS and @stdlib's oracle
// leave y untouched with beta never applied — assert exact identity, not
// a beta-scaled value.
test("dgemv zero-dimension (regression)", async (t) => {
  await t.test("no-transpose, n=0 (contraction dim zero, m>0)", async () => {
    const yBefore = randomFloat64Array(4, -1, 1, 9001);
    const y = Float64Array.from(yBefore);
    const got = await dgemv(
      device,
      "no-transpose",
      4, // m>0
      0, // n=0 — contraction dimension for no-transpose
      1.5,
      new Float64Array(0), // A: m*0 has no elements
      1,
      new Float64Array(0), // x: length n=0
      1,
      0.5, // beta != 0, != 1
      y,
      1,
    );
    assert.deepEqual(got.y, yBefore);
  });

  await t.test("transpose, m=0 (contraction dim zero, n>0)", async () => {
    const yBefore = randomFloat64Array(4, -1, 1, 9002);
    const y = Float64Array.from(yBefore);
    const got = await dgemv(
      device,
      "transpose",
      0, // m=0 — contraction dimension for transpose
      4, // n>0
      1.5,
      new Float64Array(0), // A: 0*n has no elements
      1,
      new Float64Array(0), // x: length m=0
      1,
      0.5, // beta != 0, != 1
      y,
      1,
    );
    assert.deepEqual(got.y, yBefore);
  });
});

// Small hand-picked scenarios loaded from edge-cases-column-major.json.
test("dgemv edge cases (column-major)", async (t) => {
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
      const got = await dgemv(
        device, // GPU device
        a.trans, // whether to use A or Aᵀ
        a.m, // rows of A
        a.n, // columns of A
        a.alpha, // scale factor for A·x
        a.A, // matrix, column-major, size n*lda
        a.lda, // leading dimension (column stride) of A
        a.x, // input vector
        a.incx, // stride through x
        a.beta, // scale factor applied to existing y before accumulating
        a.y, // input/output vector
        a.incy, // stride through y
        a.layout, // storage layout
      );
      const expected = stdlibReference(a);
      assert.deepEqual(got.y, expected.y);
    });
  }
});
