import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { strmm } from "wgblas/strmm";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { forwardFactor } from "../helpers.js";
import { strmmReference as stdlibReference } from "../../helpers/stdlib.js";
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
  A:     { ...loadParam("A"), dependsOn: ["m", "n", "lda", "side"] },
  lda:   loadParam("ld"),
  B:     { ...loadParam("B"), dependsOn: ["m", "n", "ldb"] },
  ldb:   loadParam("ld"),
};

test("strmm validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => strmm(a.device, a.side, a.uplo, a.transA, a.diag, a.m, a.n, a.alpha, a.A, a.lda, a.B, a.ldb, a.layout),
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

test("strmm fixtures", async (t) => {
  await runFixtures(
    t,
    "strmm",
    device,
    NUM_RUNS,
    THRESHOLD,
    fixtureSpecs,
    async (dev, a) => strmm(dev, a.side, a.uplo, a.transA, a.diag, a.m, a.n, a.alpha, a.A, a.lda, a.B, a.ldb, a.layout),
    stdlibReference,
    forwardFactor,
  );
});

// Small hand-picked scenarios loaded from edge-cases.json. Expected output is
// computed live from stdlibReference, not hardcoded.
test("strmm edge cases", async (t) => {
  for (const tc of edgeCases) {
    await t.test(tc.label, async () => {
      const a = {
        side: tc.side, uplo: tc.uplo, transA: tc.transA, diag: tc.diag,
        m: tc.m, n: tc.n, alpha: tc.alpha,
        A: new Float32Array(tc.A), lda: tc.lda,
        B: new Float32Array(tc.B), ldb: tc.ldb,
      };
      const got = await strmm(device, a.side, a.uplo, a.transA, a.diag, a.m, a.n, a.alpha, a.A, a.lda, a.B, a.ldb);
      const expected = stdlibReference(a);
      assert.deepEqual(got.B, expected.B);
    });
  }
});

// Small hand-picked scenarios loaded from edge-cases-column-major.json.
test("strmm edge cases (column-major)", async (t) => {
  for (const tc of edgeCasesColumnMajor) {
    await t.test(tc.label, async () => {
      const a = {
        layout: tc.layout,
        side: tc.side, uplo: tc.uplo, transA: tc.transA, diag: tc.diag,
        m: tc.m, n: tc.n, alpha: tc.alpha,
        A: new Float32Array(tc.A), lda: tc.lda,
        B: new Float32Array(tc.B), ldb: tc.ldb,
      };
      const got = await strmm(device, a.side, a.uplo, a.transA, a.diag, a.m, a.n, a.alpha, a.A, a.lda, a.B, a.ldb, a.layout);
      const expected = stdlibReference(a);
      assert.deepEqual(got.B, expected.B);
    });
  }
});
