import {
  edge_cases_column_major_default,
  edge_cases_default,
  forwardFactor,
} from "./chunk-4EBF4GYY.mjs";
import { padMatrix, unpadMatrix, withGpuResources } from "./chunk-KSBTCQGM.mjs";
import { dgemmReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { GpuMatrix, cleanup, dgemm, init } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/dgemm/src/gpustorage.dgemm.js
var NUM_RUNS = 100;
var THRESHOLD = 1;
var device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => {
  cleanup();
});
var A64 = loadParam("A64");
var aLevel3 = A64["level-3"];
var aSpec = {
  ...A64,
  dependsOn: aLevel3.dependsOn,
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
var nSpec = loadParam("n");
var ldSpec = loadParam("ld");
var validationSpecs = {
  transA: loadParam("trans"),
  transB: loadParam("trans"),
  layout: loadParam("layout"),
  m: { ...loadParam("m"), baseline: 2 },
  n: { ...nSpec, baseline: 2, edge: nSpec.edge.filter((e) => e.value !== -1) },
  k: loadParam("k"),
  alpha: loadParam("alpha"),
  beta: loadParam("beta"),
  A: aSpec,
  lda: ldSpec,
  B: loadParam("B64"),
  ldb: ldSpec,
  C: loadParam("C64"),
  ldc: ldSpec,
};
var fixtureSpecs = {
  ...validationSpecs,
  m: { ...validationSpecs.m, range: { min: 1, max: 20 } },
  n: { ...validationSpecs.n, range: { min: 1, max: 20 } },
  k: { ...validationSpecs.k, range: { min: 1, max: 20 } },
};
async function callGpuResident(dev, a) {
  const layout = a.layout ?? "row-major";
  const isCM = layout === "column-major";
  const aRows = a.transA === "no-transpose" ? a.m : a.k;
  const aCols = a.transA === "no-transpose" ? a.k : a.m;
  const aOuterCount = isCM ? aCols : aRows;
  const bRows = a.transB === "no-transpose" ? a.k : a.n;
  const bCols = a.transB === "no-transpose" ? a.n : a.k;
  const bOuterCount = isCM ? bCols : bRows;
  const cOuterCount = isCM ? a.n : a.m;
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
          a.m,
          a.n,
          a.ldc,
          layout,
        ),
    },
    async ({ A, B, C }) => {
      await dgemm(
        dev,
        a.transA,
        a.transB,
        a.m,
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
      return { C: unpadMatrix(dense, a.C, a.m, a.n, a.ldc, layout) };
    },
  );
}
test("dgemm fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,
    "dgemm (GPU-resident)",
    device,
    NUM_RUNS,
    THRESHOLD,
    fixtureSpecs,
    callGpuResident,
    dgemmReference,
    forwardFactor,
  );
});
test("dgemm edge cases (GPU-resident)", async (t) => {
  for (const tc of edge_cases_default) {
    await t.test(tc.label, async () => {
      const a = {
        transA: tc.transA,
        transB: tc.transB,
        m: tc.m,
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
      const expected = dgemmReference(a);
      assert_default.deepEqual(got.C, expected.C);
    });
  }
});
test("dgemm edge cases (GPU-resident, column-major)", async (t) => {
  for (const tc of edge_cases_column_major_default) {
    await t.test(tc.label, async () => {
      const a = {
        layout: tc.layout,
        transA: tc.transA,
        transB: tc.transB,
        m: tc.m,
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
      const expected = dgemmReference(a);
      assert_default.deepEqual(got.C, expected.C);
    });
  }
});
