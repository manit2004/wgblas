import {
  edge_cases_column_major_default,
  edge_cases_default,
  forwardFactor,
} from "./chunk-22YEMGJ7.mjs";
import { padMatrix, unpadMatrix, withGpuResources } from "./chunk-KSBTCQGM.mjs";
import { strmmReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { GpuMatrix, cleanup, init, strmm } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/strmm/src/gpustorage.strmm.js
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
  transA: loadParam("trans"),
  diag: loadParam("diag"),
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
  A: { ...loadParam("A"), dependsOn: ["m", "n", "lda", "side"] },
  lda: loadParam("ld"),
  B: { ...loadParam("B"), dependsOn: ["m", "n", "ldb"] },
  ldb: loadParam("ld"),
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
    },
    async ({ A, B }) => {
      await strmm(
        dev,
        a.side,
        a.uplo,
        a.transA,
        a.diag,
        a.m,
        a.n,
        a.alpha,
        A,
        a.lda,
        B,
        a.ldb,
      );
      const dense = await B.read();
      return { B: unpadMatrix(dense, a.B, a.m, a.n, a.ldb, layout) };
    },
  );
}
test("strmm fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,
    "strmm (GPU-resident)",
    device,
    NUM_RUNS,
    THRESHOLD,
    fixtureSpecs,
    callGpuResident,
    strmmReference,
    forwardFactor,
  );
});
test("strmm edge cases (GPU-resident)", async (t) => {
  for (const tc of edge_cases_default) {
    await t.test(tc.label, async () => {
      const a = {
        side: tc.side,
        uplo: tc.uplo,
        transA: tc.transA,
        diag: tc.diag,
        m: tc.m,
        n: tc.n,
        alpha: tc.alpha,
        A: new Float32Array(tc.A),
        lda: tc.lda,
        B: new Float32Array(tc.B),
        ldb: tc.ldb,
      };
      const got = await callGpuResident(device, a);
      const expected = strmmReference(a);
      assert_default.deepEqual(got.B, expected.B);
    });
  }
});
test("strmm edge cases (GPU-resident, column-major)", async (t) => {
  for (const tc of edge_cases_column_major_default) {
    await t.test(tc.label, async () => {
      const a = {
        layout: tc.layout,
        side: tc.side,
        uplo: tc.uplo,
        transA: tc.transA,
        diag: tc.diag,
        m: tc.m,
        n: tc.n,
        alpha: tc.alpha,
        A: new Float32Array(tc.A),
        lda: tc.lda,
        B: new Float32Array(tc.B),
        ldb: tc.ldb,
      };
      const got = await callGpuResident(device, a);
      const expected = strmmReference(a);
      assert_default.deepEqual(got.B, expected.B);
    });
  }
});
