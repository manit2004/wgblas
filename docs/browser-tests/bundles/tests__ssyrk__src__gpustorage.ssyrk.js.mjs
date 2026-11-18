import {
  edge_cases_column_major_default,
  edge_cases_default,
  forwardFactor,
} from "./chunk-74HIRTMK.mjs";
import { padMatrix, unpadMatrix, withGpuResources } from "./chunk-KSBTCQGM.mjs";
import { ssyrkReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { GpuMatrix, cleanup, init, ssyrk } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/ssyrk/src/gpustorage.ssyrk.js
var NUM_RUNS = 100;
var THRESHOLD = 1;
var device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => {
  cleanup();
});
var nSpec = loadParam("n");
var aSpec = loadParam("A");
var ldSpec = loadParam("ld");
var validationSpecs = {
  uplo: loadParam("uplo"),
  trans: loadParam("trans"),
  layout: loadParam("layout"),
  n: { ...nSpec, baseline: 2, edge: nSpec.edge.filter((e) => e.value !== -1) },
  k: loadParam("k"),
  alpha: loadParam("alpha"),
  beta: loadParam("beta"),
  A: { ...aSpec, ...aSpec["level-3"], dependsOn: ["n", "k", "lda", "trans"] },
  lda: ldSpec,
  C: { ...loadParam("C"), dependsOn: ["n", "ldc"] },
  ldc: ldSpec,
};
var fixtureSpecs = {
  ...validationSpecs,
  n: { ...validationSpecs.n, range: { min: 1, max: 20 } },
  k: { ...validationSpecs.k, range: { min: 1, max: 20 } },
};
async function callGpuResident(dev, a) {
  const layout = a.layout ?? "row-major";
  const isCM = layout === "column-major";
  const aRows = a.trans === "no-transpose" ? a.n : a.k;
  const aCols = a.trans === "no-transpose" ? a.k : a.n;
  const aOuterCount = isCM ? aCols : aRows;
  const cOuterCount = a.n;
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
      C: () =>
        GpuMatrix.from(
          padMatrix(a.C, cOuterCount, a.ldc),
          a.n,
          a.n,
          a.ldc,
          layout,
        ),
    },
    async ({ A, C }) => {
      await ssyrk(
        dev,
        a.uplo,
        a.trans,
        a.n,
        a.k,
        a.alpha,
        A,
        a.lda,
        a.beta,
        C,
        a.ldc,
      );
      const dense = await C.read();
      return { C: unpadMatrix(dense, a.C, a.n, a.n, a.ldc, layout) };
    },
  );
}
test("ssyrk fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,
    "ssyrk (GPU-resident)",
    device,
    NUM_RUNS,
    THRESHOLD,
    fixtureSpecs,
    callGpuResident,
    ssyrkReference,
    forwardFactor,
  );
});
test("ssyrk edge cases (GPU-resident)", async (t) => {
  for (const tc of edge_cases_default) {
    await t.test(tc.label, async () => {
      const a = {
        uplo: tc.uplo,
        trans: tc.trans,
        n: tc.n,
        k: tc.k,
        alpha: tc.alpha,
        A: new Float32Array(tc.A),
        lda: tc.lda,
        beta: tc.beta,
        C: new Float32Array(tc.C),
        ldc: tc.ldc,
      };
      const got = await callGpuResident(device, a);
      const expected = ssyrkReference(a);
      assert_default.deepEqual(got.C, expected.C);
    });
  }
});
test("ssyrk edge cases (GPU-resident, column-major)", async (t) => {
  for (const tc of edge_cases_column_major_default) {
    await t.test(tc.label, async () => {
      const a = {
        layout: tc.layout,
        uplo: tc.uplo,
        trans: tc.trans,
        n: tc.n,
        k: tc.k,
        alpha: tc.alpha,
        A: new Float32Array(tc.A),
        lda: tc.lda,
        beta: tc.beta,
        C: new Float32Array(tc.C),
        ldc: tc.ldc,
      };
      const got = await callGpuResident(device, a);
      const expected = ssyrkReference(a);
      assert_default.deepEqual(got.C, expected.C);
    });
  }
});
