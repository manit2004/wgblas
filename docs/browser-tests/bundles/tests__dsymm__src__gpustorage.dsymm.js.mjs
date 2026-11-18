import {
  edge_cases_column_major_default,
  edge_cases_default,
  forwardFactor,
} from "./chunk-7RN367H6.mjs";
import { padMatrix, unpadMatrix, withGpuResources } from "./chunk-KSBTCQGM.mjs";
import { dsymmReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { GpuMatrix, cleanup, dsymm, init } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/dsymm/src/gpustorage.dsymm.js
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
var validationSpecs = {
  side: loadParam("side"),
  uplo: loadParam("uplo"),
  layout: loadParam("layout"),
  m: { ...loadParam("m"), baseline: 2 },
  n: {
    ...nSpec,
    baseline: 2,
    edge: nSpec.edge.filter((e) => e.value !== -1),
    invalid: [
      ...nSpec.invalid,
      { value: -1, error: "must be non-negative", label: "negative" },
    ],
  },
  alpha: loadParam("alpha"),
  beta: loadParam("beta"),
  A: { ...loadParam("A64"), dependsOn: ["m", "n", "lda", "side"] },
  lda: loadParam("ld"),
  B: { ...loadParam("B64"), dependsOn: ["m", "n", "ldb"] },
  ldb: loadParam("ld"),
  C: loadParam("C64"),
  ldc: loadParam("ld"),
};
var fixtureSpecs = {
  ...validationSpecs,
  m: { ...validationSpecs.m, range: { min: 1, max: 20 } },
  n: { ...validationSpecs.n, range: { min: 1, max: 20 } },
};
async function callGpuResident(dev, a) {
  const layout = a.layout ?? "row-major";
  const isCM = layout === "column-major";
  const aOrder = a.side === "left" ? a.m : a.n;
  const aOuterCount = aOrder;
  const bOuterCount = isCM ? a.n : a.m;
  const cOuterCount = isCM ? a.n : a.m;
  return withGpuResources(
    {
      A: () =>
        GpuMatrix.from(
          padMatrix(a.A, aOuterCount, a.lda),
          aOrder,
          aOrder,
          a.lda,
          layout,
        ),
      B: () =>
        GpuMatrix.from(
          padMatrix(a.B, bOuterCount, a.ldb),
          a.m,
          a.n,
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
      await dsymm(
        dev,
        a.side,
        a.uplo,
        a.m,
        a.n,
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
test("dsymm fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,
    "dsymm (GPU-resident)",
    device,
    NUM_RUNS,
    THRESHOLD,
    fixtureSpecs,
    callGpuResident,
    dsymmReference,
    forwardFactor,
  );
});
test("dsymm edge cases (GPU-resident)", async (t) => {
  for (const tc of edge_cases_default) {
    await t.test(tc.label, async () => {
      const a = {
        side: tc.side,
        uplo: tc.uplo,
        m: tc.m,
        n: tc.n,
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
      const expected = dsymmReference(a);
      assert_default.deepEqual(got.C, expected.C);
    });
  }
});
test("dsymm edge cases (GPU-resident, column-major)", async (t) => {
  for (const tc of edge_cases_column_major_default) {
    await t.test(tc.label, async () => {
      const a = {
        layout: tc.layout,
        side: tc.side,
        uplo: tc.uplo,
        m: tc.m,
        n: tc.n,
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
      const expected = dsymmReference(a);
      assert_default.deepEqual(got.C, expected.C);
    });
  }
});
