import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { ssymv } from "wgblas/ssymv";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { forwardFactor } from "../helpers.js";
import { ssymvReference as stdlibReference } from "../../helpers/stdlib.js";
import edgeCases from "../edge-cases.json" with { type: "json" };
import edgeCasesColumnMajor from "../edge-cases-column-major.json" with { type: "json" };

const NUM_RUNS = 100;
const THRESHOLD = 2;

let device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => {
  cleanup();
});

//   n: negative throws (not a noop) — move n=-1 from edge to invalid
//   A: square n×n, no separate m — dependsOn ["n","lda"] instead of ["m","n","lda"]
//   x/y: size depends only on n, not trans/m — dependsOn ["n","inc*"]
const nSpec = loadParam("n");
const validationSpecs = {
  device: loadParam("device"),
  uplo:   loadParam("uplo"),
  n: {
    ...nSpec,
    edge:    nSpec.edge.filter((e) => e.value !== -1),
    invalid: [...nSpec.invalid, { value: -1, error: "n must be non-negative", label: "negative" }],
  },
  alpha:  loadParam("alpha"),
  A:      { ...loadParam("A"), dependsOn: ["n", "lda"] },
  lda:    loadParam("lda"),
  x:      { ...loadParam("x"), dependsOn: ["n", "incx"] },
  incx:   loadParam("incx"),
  beta:   loadParam("beta"),
  y:      { ...loadParam("y"), dependsOn: ["n", "incy"] },
  incy:   loadParam("incy"),
  layout: loadParam("layout"),
};

test("ssymv validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => ssymv(a.device, a.uplo, a.n, a.alpha, a.A, a.lda, a.x, a.incx, a.beta, a.y, a.incy, a.layout),
    { device },
  );
});

// Cap n: validationSpecs allows up to 1000 but n×n matrices at that size make property tests slow.
const fixtureSpecs = { ...validationSpecs, n: { ...validationSpecs.n, range: { min: 1, max: 50 } } };

test("ssymv fixtures", async (t) => {
  await runFixtures(
    t,                   // node:test context
    "ssymv",             // routine name — used in the diagnostic label
    device,              // WebGPU device instance
    NUM_RUNS,            // 100 random inputs
    THRESHOLD,           // threshold 2 — forward error factor ≤ 2 means within two roundings of true result
    fixtureSpecs,        // param specs used to generate random inputs (n capped at 50 for speed)
    async (dev, a) => ssymv(dev, a.uplo, a.n, a.alpha, a.A, a.lda, a.x, a.incx, a.beta, a.y, a.incy, a.layout), // GPU call
    stdlibReference,     // CPU reference
    forwardFactor,       // |err| / (eps * forward bound) — see helpers.js
  );
});

// Small hand-picked scenarios loaded from edge-cases.json. Expected output is
// computed live from stdlib, not hardcoded.
test("ssymv edge cases", async (t) => {
  for (const tc of edgeCases) {
    await t.test(tc.label, async () => {
      const a = {
        uplo: tc.uplo,               // which triangle of the symmetric matrix is stored
        n: tc.n,                     // matrix dimension (n×n)
        alpha: tc.alpha,             // scale factor for A·x
        A: new Float32Array(tc.A),   // matrix, row-major, size n*lda
        lda: tc.lda,                 // leading dimension (row stride) of A
        x: new Float32Array(tc.x),   // input vector
        incx: tc.incx,               // stride through x
        beta: tc.beta,               // scale factor applied to existing y before accumulating
        y: new Float32Array(tc.y),   // input/output vector
        incy: tc.incy,               // stride through y
      };
      const got = await ssymv(
        device,   // GPU device
        a.uplo,   // which triangle of the symmetric matrix is stored
        a.n,      // matrix dimension (n×n)
        a.alpha,  // scale factor for A·x
        a.A,      // matrix, row-major, size n*lda
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

// Small hand-picked scenarios loaded from edge-cases-column-major.json.
test("ssymv edge cases (column-major)", async (t) => {
  for (const tc of edgeCasesColumnMajor) {
    await t.test(tc.label, async () => {
      const a = {
        uplo: tc.uplo,                // which triangle of the symmetric matrix is stored
        n: tc.n,                      // matrix dimension (n×n)
        alpha: tc.alpha,              // scale factor for A·x
        A: new Float32Array(tc.A),    // matrix, column-major, size n*lda
        lda: tc.lda,                  // leading dimension (column stride) of A
        x: new Float32Array(tc.x),    // input vector
        incx: tc.incx,                // stride through x
        beta: tc.beta,                // scale factor applied to existing y before accumulating
        y: new Float32Array(tc.y),    // input/output vector
        incy: tc.incy,                // stride through y
        layout: tc.layout,            // "column-major"
      };
      const got = await ssymv(
        device,     // GPU device
        a.uplo,     // which triangle of the symmetric matrix is stored
        a.n,        // matrix dimension (n×n)
        a.alpha,    // scale factor for A·x
        a.A,        // matrix, column-major, size n*lda
        a.lda,      // leading dimension (column stride) of A
        a.x,        // input vector
        a.incx,     // stride through x
        a.beta,     // scale factor applied to existing y before accumulating
        a.y,        // input/output vector
        a.incy,     // stride through y
        a.layout,   // storage layout
      );
      const expected = stdlibReference(a);
      assert.deepEqual(got.y, expected.y);
    });
  }
});
