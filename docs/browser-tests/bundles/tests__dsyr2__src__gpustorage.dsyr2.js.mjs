import {
  edge_cases_column_major_default,
  edge_cases_default,
  forwardFactor,
} from "./chunk-DCEAGHG6.mjs";
import { padMatrix, unpadMatrix, withGpuResources } from "./chunk-KSBTCQGM.mjs";
import { dsyr2Reference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import {
  GpuMatrix,
  GpuVector,
  cleanup,
  dsyr2,
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

// tests/dsyr2/src/gpustorage.dsyr2.js
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
  n: {
    ...nSpec,
    edge: nSpec.edge.filter((e) => e.value !== -1),
    invalid: [
      ...nSpec.invalid,
      { value: -1, error: "n must be non-negative", label: "negative" },
    ],
  },
  alpha: loadParam("alpha64"),
  x: { ...loadParam("x64"), dependsOn: ["n", "incx"] },
  incx: loadParam("incx"),
  y: { ...loadParam("y64"), dependsOn: ["n", "incy"] },
  incy: loadParam("incy"),
  A: { ...loadParam("A64"), dependsOn: ["n", "lda"] },
  lda: loadParam("lda"),
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
      await dsyr2(dev, a.uplo, a.n, a.alpha, x, a.incx, y, a.incy, A, a.lda);
      const dense = await A.read();
      return { A: unpadMatrix(dense, a.A, a.n, a.n, a.lda, layout) };
    },
  );
}
test("dsyr2 fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,
    // node:test context
    "dsyr2 (GPU-resident)",
    // routine name — used in the diagnostic label
    device,
    // WebGPU device instance
    NUM_RUNS,
    // 100 random inputs
    THRESHOLD,
    // forward error factor threshold
    fixtureSpecs,
    // param specs used to generate random inputs (n capped at 50 for speed)
    callGpuResident,
    // GPU call — wraps A, x, y into GpuMatrix/GpuVectors
    dsyr2Reference,
    // CPU reference
    forwardFactor,
    // |err| / (eps * forward bound) — see helpers.js
  );
});
test("dsyr2 edge cases (GPU-resident)", async (t) => {
  for (const tc of edge_cases_default) {
    await t.test(tc.label, async () => {
      const a = {
        uplo: tc.uplo,
        // which triangle of the symmetric matrix is stored
        n: tc.n,
        // matrix dimension (n×n)
        alpha: tc.alpha,
        // scale factor for x*y^T + y*x^T
        x: new Float64Array(tc.x),
        // input vector
        incx: tc.incx,
        // stride through x
        y: new Float64Array(tc.y),
        // input vector
        incy: tc.incy,
        // stride through y
        A: new Float64Array(tc.A),
        // matrix, row-major, size n*lda
        lda: tc.lda,
        // leading dimension (row stride) of A
      };
      const got = await callGpuResident(device, a);
      const expected = dsyr2Reference(a);
      assert_default.deepEqual(got.A, expected.A);
    });
  }
});
test("dsyr2 edge cases (GPU-resident, column-major)", async (t) => {
  for (const tc of edge_cases_column_major_default) {
    await t.test(tc.label, async () => {
      const a = {
        uplo: tc.uplo,
        // which triangle of the symmetric matrix is stored
        n: tc.n,
        // matrix dimension (n×n)
        alpha: tc.alpha,
        // scale factor for x*y^T + y*x^T
        x: new Float64Array(tc.x),
        // input vector
        incx: tc.incx,
        // stride through x
        y: new Float64Array(tc.y),
        // input vector
        incy: tc.incy,
        // stride through y
        A: new Float64Array(tc.A),
        // matrix, column-major, size n*lda
        lda: tc.lda,
        // leading dimension (column stride) of A
        layout: tc.layout,
        // "column-major"
      };
      const got = await callGpuResident(device, a);
      const expected = dsyr2Reference(a);
      assert_default.deepEqual(got.A, expected.A);
    });
  }
});
