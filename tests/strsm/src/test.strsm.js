import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { strsm } from "wgblas/strsm";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { backwardResidualFactor } from "../helpers.js";
import { strsmReference as stdlibReference } from "../../helpers/stdlib.js";
import edgeCases from "../edge-cases.json" with { type: "json" };
import edgeCasesColumnMajor from "../edge-cases-column-major.json" with { type: "json" };

const NUM_RUNS = 100;
// Higher than strsv's THRESHOLD=3 — strsm's explicit block inverse adds a
// rounding layer strsv's direct substitution doesn't have.
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
  side:   loadParam("side"),
  uplo:   loadParam("uplo"),
  transA: loadParam("trans"),
  diag:   loadParam("diag"),
  layout: loadParam("layout"),
  m:      { ...loadParam("m"), baseline: 2 },
  n: {
    ...nSpec,
    baseline: 2,
    edge:    nSpec.edge.filter((e) => e.value !== -1),
    invalid: [...nSpec.invalid, { value: -1, error: "must be non-negative", label: "negative" }],
  },
  alpha: loadParam("alpha"),
  // triangular: true keeps the diagonal away from 0, like strsv. Range
  // tightened to [-0.5,0.5]: with diag='unit', entries near ±1 can make a
  // block's explicit inverse grow combinatorially (strsm's own technique).
  A:     { ...loadParam("A"), dependsOn: ["m", "n", "lda", "side"], triangular: true, range: { elementMin: -0.5, elementMax: 0.5 } },
  lda:   loadParam("ld"),
  B:     { ...loadParam("B"), dependsOn: ["m", "n", "ldb"] },
  ldb:   loadParam("ld"),
};

test("strsm validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => strsm(a.device, a.side, a.uplo, a.transA, a.diag, a.m, a.n, a.alpha, a.A, a.lda, a.B, a.ldb, a.layout),
    { device },
  );
});

// Cap m/n for fixtures — validationSpecs allows up to 200x1000 matrices which
// makes property tests prohibitively slow. Keep validation coverage wide, fixtures fast.
const fixtureSpecs = {
  ...validationSpecs,
  m: { ...validationSpecs.m, range: { min: 1, max: 20 } },
  n: { ...validationSpecs.n, range: { min: 1, max: 20 } },
};

test("strsm fixtures", async (t) => {
  await runFixtures(
    t,
    "strsm",
    device,
    NUM_RUNS,
    THRESHOLD,
    fixtureSpecs,
    async (dev, a) => strsm(dev, a.side, a.uplo, a.transA, a.diag, a.m, a.n, a.alpha, a.A, a.lda, a.B, a.ldb, a.layout),
    stdlibReference,
    backwardResidualFactor,
  );
});

// Small hand-picked scenarios loaded from edge-cases.json. Expected output is
// computed live from stdlibReference, not hardcoded.
test("strsm edge cases", async (t) => {
  for (const tc of edgeCases) {
    await t.test(tc.label, async () => {
      const a = {
        side: tc.side, uplo: tc.uplo, transA: tc.transA, diag: tc.diag,
        m: tc.m, n: tc.n, alpha: tc.alpha,
        A: new Float32Array(tc.A), lda: tc.lda,
        B: new Float32Array(tc.B), ldb: tc.ldb,
      };
      const got = await strsm(device, a.side, a.uplo, a.transA, a.diag, a.m, a.n, a.alpha, a.A, a.lda, a.B, a.ldb);
      const expected = stdlibReference(a);
      const factor = backwardResidualFactor(got, expected, a);
      assert.ok(factor <= THRESHOLD, `backward residual factor ${factor} exceeds threshold ${THRESHOLD}`);
    });
  }
});

// NaN/Inf element-level semantics — expected value hardcoded (not
// stdlibReference-computed) since JSON can't hold Infinity/NaN literals.
// BLAS: alpha=0 means A is not referenced and B need not be set before
// entry — the result must be a literal zero, not alpha*B (0*Infinity would
// leak into B otherwise). See strsm.mjs's literal zero-write dispatch.
test("strsm NaN/Inf semantics", async (t) => {
  await t.test("alpha=0 — poisoned B becomes a literal zero", async () => {
    const A = new Float32Array([1, 0, 1, 1]); // finite, valid lower-triangular
    const B = new Float32Array([Infinity, NaN, 3, 4]);
    const got = await strsm(device, "left", "lower", "no-transpose", "non-unit", 2, 2, 0, A, 2, B, 2);
    assert.deepEqual(got.B, new Float32Array([0, 0, 0, 0]));
  });
});

// Small hand-picked scenarios loaded from edge-cases-column-major.json.
test("strsm edge cases (column-major)", async (t) => {
  for (const tc of edgeCasesColumnMajor) {
    await t.test(tc.label, async () => {
      const a = {
        layout: tc.layout,
        side: tc.side, uplo: tc.uplo, transA: tc.transA, diag: tc.diag,
        m: tc.m, n: tc.n, alpha: tc.alpha,
        A: new Float32Array(tc.A), lda: tc.lda,
        B: new Float32Array(tc.B), ldb: tc.ldb,
      };
      const got = await strsm(device, a.side, a.uplo, a.transA, a.diag, a.m, a.n, a.alpha, a.A, a.lda, a.B, a.ldb, a.layout);
      const expected = stdlibReference(a);
      const factor = backwardResidualFactor(got, expected, a);
      assert.ok(factor <= THRESHOLD, `backward residual factor ${factor} exceeds threshold ${THRESHOLD}`);
    });
  }
});
