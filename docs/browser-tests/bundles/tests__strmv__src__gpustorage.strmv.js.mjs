import {
  edge_cases_column_major_default,
  edge_cases_default,
  forwardFactor,
} from "./chunk-TCV5MO5S.mjs";
import { padMatrix, withGpuResources } from "./chunk-KSBTCQGM.mjs";
import { strmvReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, makeVec, runFixtures } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import {
  GpuMatrix,
  GpuVector,
  cleanup,
  init,
  strmv,
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

// tests/strmv/src/gpustorage.strmv.js
var NUM_RUNS = 100;
var THRESHOLD = 2;
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
  A: { ...loadParam("A"), dependsOn: ["n", "lda"] },
  lda: loadParam("lda"),
  x: { ...loadParam("x"), dependsOn: ["n", "incx"] },
  incx: loadParam("incx"),
  y: { ...loadParam("y"), dependsOn: ["n", "incy"] },
  incy: loadParam("incy"),
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
      y: () => GpuVector.from(a.y),
    },
    async ({ A, x, y }) => {
      await strmv(
        dev,
        a.uplo,
        a.trans,
        a.diag,
        a.n,
        A,
        a.lda,
        x,
        a.incx,
        y,
        a.incy,
      );
      return { y: await y.read() };
    },
  );
}
test("strmv fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,
    // node:test context
    "strmv (GPU-resident)",
    // routine name
    device,
    // GPUDevice
    NUM_RUNS,
    // number of fast-check runs
    THRESHOLD,
    // max allowed forward error factor
    fixtureSpecs,
    // param specs used to generate random inputs
    callGpuResident,
    // GPU impl — wraps A/x/y into GpuMatrix/GpuVector
    strmvReference,
    // CPU reference
    forwardFactor,
    // error metric
  );
});
test("strmv edge cases (GPU-resident)", async (t) => {
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
        // input vector
        incx: c.incx,
        // stride through x
        y: makeVec(c.n, c.incy),
        // output vector — only y[i*incy] for i in [0,n) is written
        incy: c.incy,
        // stride through y
      };
      const { y: got } = await callGpuResident(device, a);
      const { y: expected } = strmvReference(a);
      assert_default.deepEqual(got, expected);
    });
  }
});
test("strmv edge cases (GPU-resident, column-major)", async (t) => {
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
        // input vector
        incx: c.incx,
        // stride through x
        y: makeVec(c.n, c.incy),
        // output vector — only y[i*incy] for i in [0,n) is written
        incy: c.incy,
        // stride through y
        layout: c.layout,
        // "column-major"
      };
      const { y: got } = await callGpuResident(device, a);
      const { y: expected } = strmvReference(a);
      assert_default.deepEqual(got, expected);
    });
  }
});
