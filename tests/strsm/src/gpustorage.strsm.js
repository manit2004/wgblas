// GPU-resident (GpuMatrix) coverage for strsm — same inputs and stdlib
// oracle as test.strsm.js, run through the overload where A/B stay on the
// GPU across the call (B mutated in place).
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, GpuMatrix } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { strsm } from "wgblas/strsm";
import { loadParam } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { padMatrix, unpadMatrix, withGpuResources } from "../../helpers/gpustorage.js";
import { backwardResidualFactor } from "../helpers.js";
import { strsmReference as stdlibReference } from "../../helpers/stdlib.js";
import edgeCases from "../edge-cases.json" with { type: "json" };
import edgeCasesColumnMajor from "../edge-cases-column-major.json" with { type: "json" };

const NUM_RUNS = 100;
// Higher than strsv's THRESHOLD=2 — see test.strsm.js for why.
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
  // Off-diagonal range tightened to [-0.5,0.5] — see test.strsm.js for why
  // (explicit block inversion, unlike strsv's direct substitution, can grow
  // combinatorially with entries near ±1 under diag='unit').
  A:     { ...loadParam("A"), dependsOn: ["m", "n", "lda", "side"], triangular: true, range: { elementMin: -0.5, elementMax: 0.5 } },
  lda:   loadParam("ld"),
  B:     { ...loadParam("B"), dependsOn: ["m", "n", "ldb"] },
  ldb:   loadParam("ld"),
};

// Cap m/n — validationSpecs' full range is too slow for property tests.
const fixtureSpecs = {
  ...validationSpecs,
  m: { ...validationSpecs.m, range: { min: 1, max: 20 } },
  n: { ...validationSpecs.n, range: { min: 1, max: 20 } },
};

// A is always aOrder x aOrder (order picked by side); B is always m x n —
// only the outerCount fed to padMatrix depends on layout.
async function callGpuResident(dev, a) {
  const layout = a.layout ?? "row-major";
  const isCM = layout === "column-major";
  const aOrder = a.side === "left" ? a.m : a.n;

  const aOuterCount = aOrder; // square either way, layout doesn't change it
  const bOuterCount = isCM ? a.n : a.m;

  return withGpuResources(
    {
      A: GpuMatrix.from(padMatrix(a.A, aOuterCount, a.lda), aOrder, aOrder, a.lda, layout),
      B: GpuMatrix.from(padMatrix(a.B, bOuterCount, a.ldb), a.m, a.n, a.ldb, layout),
    },
    async ({ A, B }) => {
      await strsm(dev, a.side, a.uplo, a.transA, a.diag, a.m, a.n, a.alpha, A, a.lda, B, a.ldb);
      const dense = await B.read();
      return { B: unpadMatrix(dense, a.B, a.m, a.n, a.ldb, layout) };
    },
  );
}

test("strsm fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,
    "strsm (GPU-resident)",
    device,
    NUM_RUNS,
    THRESHOLD,
    fixtureSpecs,
    callGpuResident,
    stdlibReference,
    backwardResidualFactor,
  );
});

test("strsm edge cases (GPU-resident)", async (t) => {
  for (const tc of edgeCases) {
    await t.test(tc.label, async () => {
      const a = {
        side: tc.side, uplo: tc.uplo, transA: tc.transA, diag: tc.diag,
        m: tc.m, n: tc.n, alpha: tc.alpha,
        A: new Float32Array(tc.A), lda: tc.lda,
        B: new Float32Array(tc.B), ldb: tc.ldb,
      };
      const got = await callGpuResident(device, a);
      const expected = stdlibReference(a);
      const factor = backwardResidualFactor(got, expected, a);
      assert.ok(factor <= THRESHOLD, `backward residual factor ${factor} exceeds threshold ${THRESHOLD}`);
    });
  }
});

test("strsm edge cases (GPU-resident, column-major)", async (t) => {
  for (const tc of edgeCasesColumnMajor) {
    await t.test(tc.label, async () => {
      const a = {
        layout: tc.layout,
        side: tc.side, uplo: tc.uplo, transA: tc.transA, diag: tc.diag,
        m: tc.m, n: tc.n, alpha: tc.alpha,
        A: new Float32Array(tc.A), lda: tc.lda,
        B: new Float32Array(tc.B), ldb: tc.ldb,
      };
      const got = await callGpuResident(device, a);
      const expected = stdlibReference(a);
      const factor = backwardResidualFactor(got, expected, a);
      assert.ok(factor <= THRESHOLD, `backward residual factor ${factor} exceeds threshold ${THRESHOLD}`);
    });
  }
});
