import {
  backwardResidualFactor,
  edge_cases_column_major_default,
  edge_cases_default,
} from "./chunk-IZPGFGWP.mjs";
import { padMatrix, withGpuResources } from "./chunk-KSBTCQGM.mjs";
import { loadParam, runFixtures } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import {
  GpuMatrix,
  GpuVector,
  cleanup,
  dtrsv,
  init,
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

// tests/dtrsv/src/gpustorage.dtrsv.js
var NUM_RUNS = 100;
var THRESHOLD = 5;
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
  // triangular: true keeps buildArb's diagonal well away from 0 — dtrsv divides by it.
  // range is also tightened to [-1,1] — same reasoning as strsv's own fixture spec.
  A: {
    ...loadParam("A64"),
    dependsOn: ["n", "lda"],
    triangular: true,
    range: { elementMin: -1, elementMax: 1 },
  },
  lda: loadParam("lda"),
  x: { ...loadParam("x64"), dependsOn: ["n", "incx"] },
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
      await dtrsv(dev, a.uplo, a.trans, a.diag, a.n, A, a.lda, x, a.incx);
      return { x: await x.read() };
    },
  );
}
test("dtrsv fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,
    // node:test context
    "dtrsv (GPU-resident)",
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
test("dtrsv edge cases (GPU-resident)", async (t) => {
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
        A: new Float64Array(c.A),
        // matrix, row-major, size n*lda
        lda: c.lda,
        // leading dimension (row stride) of A
        x: new Float64Array(c.x),
        // holds b on input, the solution on output
        incx: c.incx,
        // stride through x
      };
      const { x: got } = await callGpuResident(device, a);
      const factor = backwardResidualFactor({ x: got }, null, a);
      assert_default.ok(
        factor <= THRESHOLD,
        `${c.label}: backward residual factor ${factor} > ${THRESHOLD}`,
      );
    });
  }
});
test("dtrsv edge cases (GPU-resident, column-major)", async (t) => {
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
        A: new Float64Array(c.A),
        // matrix, column-major, size n*lda
        lda: c.lda,
        // leading dimension (column stride) of A
        x: new Float64Array(c.x),
        // holds b on input, the solution on output
        incx: c.incx,
        // stride through x
        layout: c.layout,
        // "column-major"
      };
      const { x: got } = await callGpuResident(device, a);
      const factor = backwardResidualFactor({ x: got }, null, a);
      assert_default.ok(
        factor <= THRESHOLD,
        `${c.label}: backward residual factor ${factor} > ${THRESHOLD}`,
      );
    });
  }
});
