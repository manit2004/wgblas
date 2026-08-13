import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { sgemm } from "wgblas/sgemm";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { forwardFactor } from "../helpers.js";
import { sgemmReference as stdlibReference } from "../../helpers/stdlib.js";
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
  transA: loadParam("trans"),
  transB: loadParam("trans"),
  layout: loadParam("layout"),
  m:      { ...loadParam("m"), baseline: 2 },
  n: {
    ...nSpec,
    baseline: 2,
    edge:    nSpec.edge.filter((e) => e.value !== -1),
    invalid: [...nSpec.invalid, { value: -1, error: "m, n, and k must be non-negative", label: "negative" }],
  },
  k:      loadParam("k"),
  alpha:  loadParam("alpha"),
  beta:   loadParam("beta"),
  A:      { ...aSpec, ...aSpec["level-3"] },
  lda:    ldSpec,
  B:      loadParam("B"),
  ldb:    ldSpec,
  C:      loadParam("C"),
  ldc:    ldSpec,
};

test("sgemm validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => sgemm(a.device, a.transA, a.transB, a.m, a.n, a.k, a.alpha, a.A, a.lda, a.B, a.ldb, a.beta, a.C, a.ldc, a.layout),
    { device },
  );
});

// Cap m/n/k for fixtures — validationSpecs allows up to 200×1000 matrices which
// makes property tests prohibitively slow. Keep validation coverage wide, fixtures fast.
const fixtureSpecs = {
  ...validationSpecs,
  m: { ...validationSpecs.m, range: { min: 1, max: 20 } },
  n: { ...validationSpecs.n, range: { min: 1, max: 20 } },
  k: { ...validationSpecs.k, range: { min: 1, max: 20 } },
};

test("sgemm fixtures", async (t) => {
  await runFixtures(
    t,
    "sgemm",
    device,
    NUM_RUNS,
    THRESHOLD,
    fixtureSpecs,
    async (dev, a) => sgemm(dev, a.transA, a.transB, a.m, a.n, a.k, a.alpha, a.A, a.lda, a.B, a.ldb, a.beta, a.C, a.ldc, a.layout),
    stdlibReference,
    forwardFactor,
  );
});

// Small hand-picked scenarios loaded from edge-cases.json. Expected output is
// computed live from stdlib, not hardcoded.
test("sgemm edge cases", async (t) => {
  for (const tc of edgeCases) {
    await t.test(tc.label, async () => {
      const a = {
        transA: tc.transA, transB: tc.transB,
        m: tc.m, n: tc.n, k: tc.k, alpha: tc.alpha,
        A: new Float32Array(tc.A), lda: tc.lda,
        B: new Float32Array(tc.B), ldb: tc.ldb,
        beta: tc.beta,
        C: new Float32Array(tc.C), ldc: tc.ldc,
      };
      const got = await sgemm(device, a.transA, a.transB, a.m, a.n, a.k, a.alpha, a.A, a.lda, a.B, a.ldb, a.beta, a.C, a.ldc);
      const expected = stdlibReference(a);
      assert.deepEqual(got.C, expected.C);
    });
  }
});

// Small hand-picked scenarios loaded from edge-cases-column-major.json.
test("sgemm edge cases (column-major)", async (t) => {
  for (const tc of edgeCasesColumnMajor) {
    await t.test(tc.label, async () => {
      const a = {
        layout: tc.layout,
        transA: tc.transA, transB: tc.transB,
        m: tc.m, n: tc.n, k: tc.k, alpha: tc.alpha,
        A: new Float32Array(tc.A), lda: tc.lda,
        B: new Float32Array(tc.B), ldb: tc.ldb,
        beta: tc.beta,
        C: new Float32Array(tc.C), ldc: tc.ldc,
      };
      const got = await sgemm(device, a.transA, a.transB, a.m, a.n, a.k, a.alpha, a.A, a.lda, a.B, a.ldb, a.beta, a.C, a.ldc, a.layout);
      const expected = stdlibReference(a);
      assert.deepEqual(got.C, expected.C);
    });
  }
});

