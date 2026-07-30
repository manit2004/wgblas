import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { ssyr } from "wgblas/ssyr";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { forwardFactor } from "../helpers.js";
import { ssyrReference as stdlibReference } from "../../helpers/stdlib.js";
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

// n: negative throws (not a noop) — move n=-1 from edge to invalid, matching ssymv.
// x: depends only on n (no trans/m) — override the default trans/m/n-based dependsOn.
// A: depends on n/lda only (square, no separate m) — matches ssymv's A override.
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
  x:      { ...loadParam("x"), dependsOn: ["n", "incx"] },
  incx:   loadParam("incx"),
  A:      { ...loadParam("A"), dependsOn: ["n", "lda"] },
  lda:    loadParam("lda"),
};

test("ssyr validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => ssyr(a.device, a.uplo, a.n, a.alpha, a.x, a.incx, a.A, a.lda),
    { device },
  );
});

// Cap n: validationSpecs allows up to 1000 but n×n matrices at that size make property tests slow.
const fixtureSpecs = { ...validationSpecs, n: { ...validationSpecs.n, range: { min: 1, max: 50 } } };

test("ssyr fixtures", async (t) => {
  await runFixtures(
    t,                   // node:test context
    "ssyr",              // routine name — used in the diagnostic label
    device,              // WebGPU device instance
    NUM_RUNS,            // 100 random inputs
    THRESHOLD,           // threshold 2 — forward error factor ≤ 2 means within two roundings of true result
    fixtureSpecs,        // param specs used to generate random inputs (n capped at 50 for speed)
    async (dev, a) => ssyr(dev, a.uplo, a.n, a.alpha, a.x, a.incx, a.A, a.lda), // GPU call
    stdlibReference,     // CPU reference
    forwardFactor,       // |err| / (eps * forward bound) — see helpers.js
  );
});

// Small hand-picked scenarios loaded from edge-cases.json. Expected output is
// computed live from stdlib, not hardcoded.
test("ssyr edge cases", async (t) => {
  for (const tc of edgeCases) {
    await t.test(tc.label, async () => {
      const a = {
        uplo: tc.uplo,               // which triangle of the symmetric matrix is stored
        n: tc.n,                     // matrix dimension (n×n)
        alpha: tc.alpha,             // scale factor for x*x^T
        x: new Float32Array(tc.x),   // input vector
        incx: tc.incx,               // stride through x
        A: new Float32Array(tc.A),   // matrix, row-major, size n*lda, mutated in place
        lda: tc.lda,                 // leading dimension (row stride) of A
      };
      const got = await ssyr(
        device,   // GPU device
        a.uplo,   // which triangle of the symmetric matrix is stored
        a.n,      // matrix dimension (n×n)
        a.alpha,  // scale factor for x*x^T
        a.x,      // input vector
        a.incx,   // stride through x
        a.A,      // matrix, row-major, size n*lda
        a.lda,    // leading dimension (row stride) of A
      );
      const expected = stdlibReference(a);
      assert.deepEqual(got.A, expected.A);
    });
  }
});
