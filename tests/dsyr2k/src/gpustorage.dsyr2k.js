// GPU-resident (GpuMatrix) coverage for dsyr2k — same inputs and stdlib
// oracle as test.dsyr2k.js, run through the overload where A/B/C stay on
// the GPU across the call.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, GpuMatrix } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { dsyr2k } from "wgblas/dsyr2k";
import { loadParam } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import {
  padMatrix,
  unpadMatrix,
  withGpuResources,
} from "../../helpers/gpustorage.js";
import { forwardFactor } from "../helpers.js";
import { dsyr2kReference as stdlibReference } from "../../helpers/stdlib.js";
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

// Same hand-built f64/L3 A spec as test.dsyr2k.js — see its comment.
const A64 = loadParam("A64");
const aLevel3 = A64["level-3"];
const aSpec = {
  ...A64,
  edge: aLevel3.edge,
  invalid: [
    ...aLevel3.invalid.map((entry) => ({
      ...entry,
      error:
        typeof entry.error === "string"
          ? entry.error.replace("Float32Array", "Float64Array")
          : entry.error,
    })),
    ...A64.invalid.filter((entry) => entry.scenario === "wrongDtypeGpuMatrix"),
  ],
};

const nSpec = loadParam("n");
const ldSpec = loadParam("ld");
const validationSpecs = {
  uplo: loadParam("uplo"),
  trans: loadParam("trans"),
  layout: loadParam("layout"),
  n: { ...nSpec, baseline: 2, edge: nSpec.edge.filter((e) => e.value !== -1) },
  k: loadParam("k"),
  alpha: loadParam("alpha"),
  beta: loadParam("beta"),
  A: { ...aSpec, dependsOn: ["n", "k", "lda", "trans"] },
  lda: ldSpec,
  B: { ...loadParam("B64"), dependsOn: ["n", "k", "ldb", "trans"] },
  ldb: ldSpec,
  C: { ...loadParam("C64"), dependsOn: ["n", "ldc"] },
  ldc: ldSpec,
};

// Cap n/k — validationSpecs' full range is too slow for property tests.
const fixtureSpecs = {
  ...validationSpecs,
  n: { ...validationSpecs.n, range: { min: 1, max: 20 } },
  k: { ...validationSpecs.k, range: { min: 1, max: 20 } },
};

// GpuMatrix.rows/cols is the trans-swapped logical shape, same regardless of
// layout — only the outerCount fed to padMatrix depends on it.
async function callGpuResident(dev, a) {
  const layout = a.layout ?? "row-major";
  const isCM = layout === "column-major";

  const aRows = a.trans === "no-transpose" ? a.n : a.k;
  const aCols = a.trans === "no-transpose" ? a.k : a.n;
  const aOuterCount = isCM ? aCols : aRows;

  const bRows = a.trans === "no-transpose" ? a.n : a.k;
  const bCols = a.trans === "no-transpose" ? a.k : a.n;
  const bOuterCount = isCM ? bCols : bRows;

  const cOuterCount = a.n; // square, same either layout

  return withGpuResources(
    {
      A: () =>
        GpuMatrix.from(
          padMatrix(a.A, aOuterCount, a.lda),
          aRows,
          aCols,
          a.lda,
          layout,
        ),
      B: () =>
        GpuMatrix.from(
          padMatrix(a.B, bOuterCount, a.ldb),
          bRows,
          bCols,
          a.ldb,
          layout,
        ),
      C: () =>
        GpuMatrix.from(
          padMatrix(a.C, cOuterCount, a.ldc),
          a.n,
          a.n,
          a.ldc,
          layout,
        ),
    },
    async ({ A, B, C }) => {
      await dsyr2k(
        dev,
        a.uplo,
        a.trans,
        a.n,
        a.k,
        a.alpha,
        A,
        a.lda,
        B,
        a.ldb,
        a.beta,
        C,
        a.ldc,
      );
      const dense = await C.read();
      return { C: unpadMatrix(dense, a.C, a.n, a.n, a.ldc, layout) };
    },
  );
}

test("dsyr2k fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,
    "dsyr2k (GPU-resident)",
    device,
    NUM_RUNS,
    THRESHOLD,
    fixtureSpecs,
    callGpuResident,
    stdlibReference,
    forwardFactor,
  );
});

test("dsyr2k edge cases (GPU-resident)", async (t) => {
  for (const tc of edgeCases) {
    await t.test(tc.label, async () => {
      const a = {
        uplo: tc.uplo,
        trans: tc.trans,
        n: tc.n,
        k: tc.k,
        alpha: tc.alpha,
        A: new Float64Array(tc.A),
        lda: tc.lda,
        B: new Float64Array(tc.B),
        ldb: tc.ldb,
        beta: tc.beta,
        C: new Float64Array(tc.C),
        ldc: tc.ldc,
      };
      const got = await callGpuResident(device, a);
      const expected = stdlibReference(a);
      assert.deepEqual(got.C, expected.C);
    });
  }
});

test("dsyr2k edge cases (GPU-resident, column-major)", async (t) => {
  for (const tc of edgeCasesColumnMajor) {
    await t.test(tc.label, async () => {
      const a = {
        layout: tc.layout,
        uplo: tc.uplo,
        trans: tc.trans,
        n: tc.n,
        k: tc.k,
        alpha: tc.alpha,
        A: new Float64Array(tc.A),
        lda: tc.lda,
        B: new Float64Array(tc.B),
        ldb: tc.ldb,
        beta: tc.beta,
        C: new Float64Array(tc.C),
        ldc: tc.ldc,
      };
      const got = await callGpuResident(device, a);
      const expected = stdlibReference(a);
      assert.deepEqual(got.C, expected.C);
    });
  }
});
