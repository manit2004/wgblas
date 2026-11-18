import {
  backwardResidualFactor,
  edge_cases_column_major_default,
  edge_cases_default,
} from "./chunk-VKVZNLUG.mjs";
import { padMatrix, withGpuResources } from "./chunk-KSBTCQGM.mjs";
import { strsvReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import {
  GpuMatrix,
  GpuVector,
  cleanup,
  init,
  strsv,
} from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/strsv/src/gpustorage.strsv.js
var NUM_RUNS = 100;
var THRESHOLD = 3;
var device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => {
  cleanup();
});
var nSpec = loadParam("n");
var validationSpecs = {
  device: loadParam("device"),
  uplo: loadParam("uplo"),
  trans: loadParam("trans"),
  diag: loadParam("diag"),
  n: {
    ...nSpec,
    edge: nSpec.edge.filter((e) => e.value !== -1),
    invalid: [
      ...nSpec.invalid,
      { value: -1, error: "n must be non-negative", label: "negative" },
    ],
  },
  // triangular: true keeps buildArb's diagonal well away from 0 — strsv divides by it.
  // range is also tightened to [-1,1]: with diag="unit" the diagonal is implicitly 1
  // (the triangular patch above doesn't apply), so an off-diagonal magnitude near the
  // default ±10 compounds across a long dependency chain (n up to 50) and overflows
  // float32 to Infinity/NaN — a pathological fixture, not a real accuracy bug.
  A: {
    ...loadParam("A"),
    dependsOn: ["n", "lda"],
    triangular: true,
    range: { elementMin: -1, elementMax: 1 },
  },
  lda: loadParam("lda"),
  x: { ...loadParam("x"), dependsOn: ["n", "incx"] },
  incx: loadParam("incx"),
  layout: loadParam("layout"),
};
var fixtureSpecs = {
  ...validationSpecs,
  n: { ...validationSpecs.n, range: { min: 1, max: 50 } },
};
async function callGpuResident(dev, a) {
  const layout = a.layout ?? "row-major";
  return withGpuResources(
    {
      A: () =>
        GpuMatrix.from(padMatrix(a.A, a.n, a.lda), a.n, a.n, a.lda, layout),
      x: () => GpuVector.from(a.x),
    },
    async ({ A, x }) => {
      await strsv(dev, a.uplo, a.trans, a.diag, a.n, A, a.lda, x, a.incx);
      return { x: await x.read() };
    },
  );
}
test("strsv fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,
    // node:test context
    "strsv (GPU-resident)",
    // routine name
    device,
    // GPUDevice
    NUM_RUNS,
    // number of fast-check runs
    THRESHOLD,
    // max allowed backward-residual factor
    fixtureSpecs,
    // A's spec has triangular: true — buildArb keeps its diagonal safe
    callGpuResident,
    // GPU impl — wraps A/x into GpuMatrix/GpuVector
    () => ({}),
    // no CPU reference needed — backwardResidualFactor self-checks against b
    backwardResidualFactor,
    // error metric
  );
});
test("strsv edge cases (GPU-resident)", async (t) => {
  for (const c of edge_cases_default) {
    await t.test(c.label, async () => {
      const a = {
        uplo: c.uplo,
        // which triangle of A is stored
        trans: c.trans,
        // whether to use A or Aᵀ
        diag: c.diag,
        // unit (diagonal implicitly 1) or non-unit (read from A)
        n: c.n,
        // matrix dimension (n×n)
        A: new Float32Array(c.A),
        // matrix, row-major, size n*lda
        lda: c.lda,
        // leading dimension (row stride) of A
        x: new Float32Array(c.x),
        // holds b on input, the solution on output
        incx: c.incx,
        // stride through x
      };
      const { x: got } = await callGpuResident(device, a);
      const { x: expected } = strsvReference(a);
      assert_default.deepEqual(got, expected);
    });
  }
});
test("strsv edge cases (GPU-resident, column-major)", async (t) => {
  for (const c of edge_cases_column_major_default) {
    await t.test(c.label, async () => {
      const a = {
        uplo: c.uplo,
        // which triangle of A is stored
        trans: c.trans,
        // whether to use A or Aᵀ
        diag: c.diag,
        // unit (diagonal implicitly 1) or non-unit (read from A)
        n: c.n,
        // matrix dimension (n×n)
        A: new Float32Array(c.A),
        // matrix, column-major, size n*lda
        lda: c.lda,
        // leading dimension (column stride) of A
        x: new Float32Array(c.x),
        // holds b on input, the solution on output
        incx: c.incx,
        // stride through x
        layout: c.layout,
        // "column-major"
      };
      const { x: got } = await callGpuResident(device, a);
      const { x: expected } = strsvReference(a);
      assert_default.deepEqual(got, expected);
    });
  }
});
