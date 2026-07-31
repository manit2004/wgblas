import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { strmv } from "wgblas/strmv";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures, makeVec } from "../../helpers/fixtures.js";
import { forwardFactor } from "../helpers.js";
import { strmvReference as stdlibReference } from "../../helpers/stdlib.js";
import edgeCases from "../edge-cases.json" with { type: "json" };
import edgeCasesColumnMajor from "../edge-cases-column-major.json" with { type: "json" };

const NUM_RUNS = 100;
const THRESHOLD = 2;

let device;
before(async () => {
  device = await init();
});
after(() => {
  cleanup();
});

const nSpec = loadParam("n");
const validationSpecs = {
  device: loadParam("device"),
  uplo:   loadParam("uplo"),
  trans:  loadParam("trans"),
  diag:   loadParam("diag"),
  n: {
    ...nSpec,
    edge:    nSpec.edge.filter((e) => e.value !== -1),
    invalid: [...nSpec.invalid, { value: -1, error: "n must be non-negative", label: "negative" }],
  },
  A:      { ...loadParam("A"), dependsOn: ["n", "lda"] },
  lda:    loadParam("lda"),
  x:      { ...loadParam("x"), dependsOn: ["n", "incx"] },
  incx:   loadParam("incx"),
  y:      { ...loadParam("y"), dependsOn: ["n", "incy"] },
  incy:   loadParam("incy"),
  layout: loadParam("layout"),
};

// Cap n for fixtures — validationSpecs allows up to 1000, which makes property tests slow.
const fixtureSpecs = { ...validationSpecs, n: { ...validationSpecs.n, range: { min: 1, max: 50 } } };

test("strmv validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => strmv(a.device, a.uplo, a.trans, a.diag, a.n, a.A, a.lda, a.x, a.incx, a.y, a.incy, a.layout),
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
    async (dev, a) => strmv(dev, a.uplo, a.trans, a.diag, a.n, a.A, a.lda, a.x, a.incx, a.y, a.incy, a.layout), // GPU impl
    stdlibReference,     // CPU reference — stdlib solves in place on x, remapped into wgblas's y shape
    forwardFactor,       // error metric: max |err| / (eps * per-element bound) across output
  );
});

// Small hand-picked scenarios (transpose x uplo x diag combos, non-unit strides)
// loaded from edge-cases.json. Expected output is computed live from stdlib —
test("strmv edge cases", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        uplo: c.uplo,                 // which triangle of A is stored
        trans: c.trans,               // whether to use A or Aᵀ
        diag: c.diag,                 // unit (diagonal implicitly 1) or non-unit (read from A)
        n: c.n,                       // matrix dimension (n×n)
        A: new Float32Array(c.A),     // matrix, row-major, size n*lda
        lda: c.lda,                   // leading dimension (row stride) of A
        x: new Float32Array(c.x),     // input vector
        incx: c.incx,                 // stride through x
        y: makeVec(c.n, c.incy),      // output vector — only y[i*incy] for i in [0,n) is written
        incy: c.incy,                 // stride through y
      };
      const { y: got } = await strmv(
        device,   // GPU device
        a.uplo,   // which triangle of A is stored
        a.trans,  // whether to use A or Aᵀ
        a.diag,   // unit (diagonal implicitly 1) or non-unit (read from A)
        a.n,      // matrix dimension (n×n)
        a.A,      // matrix, row-major, size n*lda
        a.lda,    // leading dimension (row stride) of A
        a.x,      // input vector
        a.incx,   // stride through x
        a.y,      // output vector
        a.incy,   // stride through y
      ); // GPU result
      const { y: expected } = stdlibReference(a); // stdlib result
      assert.deepEqual(got, expected);
    });
  }
});

// Small hand-picked scenarios loaded from edge-cases-column-major.json.
test("strmv edge cases (column-major)", async (t) => {
  for (const c of edgeCasesColumnMajor) {
    await t.test(c.label, async () => {
      const a = {
        uplo: c.uplo,                  // which triangle of A is stored
        trans: c.trans,                // whether to use A or Aᵀ
        diag: c.diag,                  // unit (diagonal implicitly 1) or non-unit (read from A)
        n: c.n,                        // matrix dimension (n×n)
        A: new Float32Array(c.A),      // matrix, column-major, size n*lda
        lda: c.lda,                    // leading dimension (column stride) of A
        x: new Float32Array(c.x),      // input vector
        incx: c.incx,                  // stride through x
        y: makeVec(c.n, c.incy),       // output vector — only y[i*incy] for i in [0,n) is written
        incy: c.incy,                  // stride through y
        layout: c.layout,              // "column-major"
      };
      const { y: got } = await strmv(
        device,     // GPU device
        a.uplo,     // which triangle of A is stored
        a.trans,    // whether to use A or Aᵀ
        a.diag,     // unit (diagonal implicitly 1) or non-unit (read from A)
        a.n,        // matrix dimension (n×n)
        a.A,        // matrix, column-major, size n*lda
        a.lda,      // leading dimension (column stride) of A
        a.x,        // input vector
        a.incx,     // stride through x
        a.y,        // output vector
        a.incy,     // stride through y
        a.layout,   // storage layout
      ); // GPU result
      const { y: expected } = stdlibReference(a); // stdlib result
      assert.deepEqual(got, expected);
    });
  }
});
