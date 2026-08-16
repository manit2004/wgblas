import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { ssyr2k } from "wgblas/ssyr2k";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { forwardFactor } from "../helpers.js";
import { ssyr2kReference as stdlibReference } from "../../helpers/stdlib.js";
import edgeCases from "../edge-cases.json" with { type: "json" };
import edgeCasesColumnMajor from "../edge-cases-column-major.json" with { type: "json" };

const NUM_RUNS = 100;
const THRESHOLD = 1;

let device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => {
  cleanup();
});

const nSpec = loadParam("n");
const aSpec = loadParam("A");
const ldSpec = loadParam("ld");
const validationSpecs = {
  device: loadParam("device"),
  uplo:   loadParam("uplo"),
  trans:  loadParam("trans"),
  layout: loadParam("layout"),
  n: {
    ...nSpec,
    baseline: 2,
    edge:    nSpec.edge.filter((e) => e.value !== -1),
    invalid: [...nSpec.invalid, { value: -1, error: "must be non-negative", label: "negative" }],
  },
  k:      loadParam("k"),
  alpha:  loadParam("alpha"),
  beta:   loadParam("beta"),
  A:      { ...aSpec, ...aSpec["level-3"], dependsOn: ["n", "k", "lda", "trans"] },
  lda:    ldSpec,
  B:      { ...loadParam("B"), dependsOn: ["n", "k", "ldb", "trans"] },
  ldb:    ldSpec,
  C:      { ...loadParam("C"), dependsOn: ["n", "ldc"] },
  ldc:    ldSpec,
};

test("ssyr2k validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => ssyr2k(a.device, a.uplo, a.trans, a.n, a.k, a.alpha, a.A, a.lda, a.B, a.ldb, a.beta, a.C, a.ldc, a.layout),
    { device },
  );
});

// Cap n/k for fixtures — validationSpecs allows up to 200×1000 matrices which
// makes property tests prohibitively slow. Keep validation coverage wide, fixtures fast.
const fixtureSpecs = {
  ...validationSpecs,
  n: { ...validationSpecs.n, range: { min: 1, max: 20 } },
  k: { ...validationSpecs.k, range: { min: 1, max: 20 } },
};

test("ssyr2k fixtures", async (t) => {
  await runFixtures(
    t,
    "ssyr2k",
    device,
    NUM_RUNS,
    THRESHOLD,
    fixtureSpecs,
    async (dev, a) => ssyr2k(dev, a.uplo, a.trans, a.n, a.k, a.alpha, a.A, a.lda, a.B, a.ldb, a.beta, a.C, a.ldc, a.layout),
    stdlibReference,
    forwardFactor,
  );
});

// Small hand-picked scenarios loaded from edge-cases.json. Expected output is
// computed live from stdlib, not hardcoded.
test("ssyr2k edge cases", async (t) => {
  for (const tc of edgeCases) {
    await t.test(tc.label, async () => {
      const a = {
        uplo: tc.uplo, trans: tc.trans,
        n: tc.n, k: tc.k, alpha: tc.alpha,
        A: new Float32Array(tc.A), lda: tc.lda,
        B: new Float32Array(tc.B), ldb: tc.ldb,
        beta: tc.beta,
        C: new Float32Array(tc.C), ldc: tc.ldc,
      };
      const got = await ssyr2k(device, a.uplo, a.trans, a.n, a.k, a.alpha, a.A, a.lda, a.B, a.ldb, a.beta, a.C, a.ldc);
      const expected = stdlibReference(a);
      assert.deepEqual(got.C, expected.C);
    });
  }
});

// Small hand-picked scenarios loaded from edge-cases-column-major.json.
test("ssyr2k edge cases (column-major)", async (t) => {
  for (const tc of edgeCasesColumnMajor) {
    await t.test(tc.label, async () => {
      const a = {
        layout: tc.layout,
        uplo: tc.uplo, trans: tc.trans,
        n: tc.n, k: tc.k, alpha: tc.alpha,
        A: new Float32Array(tc.A), lda: tc.lda,
        B: new Float32Array(tc.B), ldb: tc.ldb,
        beta: tc.beta,
        C: new Float32Array(tc.C), ldc: tc.ldc,
      };
      const got = await ssyr2k(device, a.uplo, a.trans, a.n, a.k, a.alpha, a.A, a.lda, a.B, a.ldb, a.beta, a.C, a.ldc, a.layout);
      const expected = stdlibReference(a);
      assert.deepEqual(got.C, expected.C);
    });
  }
});
