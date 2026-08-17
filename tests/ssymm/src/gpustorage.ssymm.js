// GPU-resident (GpuMatrix) coverage for ssymm — same inputs and stdlib
// oracle as test.ssymm.js, run through the overload where A/B/C stay on
// the GPU across the call.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, GpuMatrix } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { ssymm } from "wgblas/ssymm";
import { loadParam } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { padMatrix, unpadMatrix, withGpuResources } from "../../helpers/gpustorage.js";
import { forwardFactor } from "../helpers.js";
import { ssymmReference as stdlibReference } from "../../helpers/stdlib.js";
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
  side:   loadParam("side"),
  uplo:   loadParam("uplo"),
  layout: loadParam("layout"),
  m:      { ...loadParam("m"), baseline: 2 },
  n: {
    ...nSpec,
    baseline: 2,
    edge:    nSpec.edge.filter((e) => e.value !== -1),
    invalid: [...nSpec.invalid, { value: -1, error: "must be non-negative", label: "negative" }],
  },
  alpha:  loadParam("alpha"),
  beta:   loadParam("beta"),
  A:      { ...loadParam("A"), dependsOn: ["m", "n", "lda", "side"] },
  lda:    loadParam("ld"),
  B:      { ...loadParam("B"), dependsOn: ["m", "n", "ldb"] },
  ldb:    loadParam("ld"),
  C:      loadParam("C"),
  ldc:    loadParam("ld"),
};

// Cap m/n — validationSpecs' full range is too slow for property tests.
const fixtureSpecs = {
  ...validationSpecs,
  m: { ...validationSpecs.m, range: { min: 1, max: 20 } },
  n: { ...validationSpecs.n, range: { min: 1, max: 20 } },
};

// A is always aOrder x aOrder (order picked by side); B/C are always m x n —
// only the outerCount fed to padMatrix depends on layout.
async function callGpuResident(dev, a) {
  const layout = a.layout ?? "row-major";
  const isCM = layout === "column-major";
  const aOrder = a.side === "left" ? a.m : a.n;

  const aOuterCount = aOrder; // square either way, layout doesn't change it
  const bOuterCount = isCM ? a.n : a.m;
  const cOuterCount = isCM ? a.n : a.m;

  return withGpuResources(
    {
      A: GpuMatrix.from(padMatrix(a.A, aOuterCount, a.lda), aOrder, aOrder, a.lda, layout),
      B: GpuMatrix.from(padMatrix(a.B, bOuterCount, a.ldb), a.m, a.n, a.ldb, layout),
      C: GpuMatrix.from(padMatrix(a.C, cOuterCount, a.ldc), a.m, a.n, a.ldc, layout),
    },
    async ({ A, B, C }) => {
      await ssymm(dev, a.side, a.uplo, a.m, a.n, a.alpha, A, a.lda, B, a.ldb, a.beta, C, a.ldc);
      const dense = await C.read();
      return { C: unpadMatrix(dense, a.C, a.m, a.n, a.ldc, layout) };
    },
  );
}

test("ssymm fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,
    "ssymm (GPU-resident)",
    device,
    NUM_RUNS,
    THRESHOLD,
    fixtureSpecs,
    callGpuResident,
    stdlibReference,
    forwardFactor,
  );
});

test("ssymm edge cases (GPU-resident)", async (t) => {
  for (const tc of edgeCases) {
    await t.test(tc.label, async () => {
      const a = {
        side: tc.side, uplo: tc.uplo,
        m: tc.m, n: tc.n, alpha: tc.alpha,
        A: new Float32Array(tc.A), lda: tc.lda,
        B: new Float32Array(tc.B), ldb: tc.ldb,
        beta: tc.beta,
        C: new Float32Array(tc.C), ldc: tc.ldc,
      };
      const got = await callGpuResident(device, a);
      const expected = stdlibReference(a);
      assert.deepEqual(got.C, expected.C);
    });
  }
});

test("ssymm edge cases (GPU-resident, column-major)", async (t) => {
  for (const tc of edgeCasesColumnMajor) {
    await t.test(tc.label, async () => {
      const a = {
        layout: tc.layout,
        side: tc.side, uplo: tc.uplo,
        m: tc.m, n: tc.n, alpha: tc.alpha,
        A: new Float32Array(tc.A), lda: tc.lda,
        B: new Float32Array(tc.B), ldb: tc.ldb,
        beta: tc.beta,
        C: new Float32Array(tc.C), ldc: tc.ldc,
      };
      const got = await callGpuResident(device, a);
      const expected = stdlibReference(a);
      assert.deepEqual(got.C, expected.C);
    });
  }
});
