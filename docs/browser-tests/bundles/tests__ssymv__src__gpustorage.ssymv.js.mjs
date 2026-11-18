import {
  edge_cases_column_major_default,
  edge_cases_default,
  forwardFactor,
} from "./chunk-YPSWSHEJ.mjs";
import { padMatrix, withGpuResources } from "./chunk-KSBTCQGM.mjs";
import { ssymvReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import {
  GpuMatrix,
  GpuVector,
  cleanup,
  init,
  ssymv,
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

// tests/ssymv/src/gpustorage.ssymv.js
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
  n: {
    ...nSpec,
    edge: nSpec.edge.filter((e) => e.value !== -1),
    invalid: [
      ...nSpec.invalid,
      { value: -1, error: "n must be non-negative", label: "negative" },
    ],
  },
  alpha: loadParam("alpha"),
  A: { ...loadParam("A"), dependsOn: ["n", "lda"] },
  lda: loadParam("lda"),
  x: { ...loadParam("x"), dependsOn: ["n", "incx"] },
  incx: loadParam("incx"),
  beta: loadParam("beta"),
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
      await ssymv(
        dev,
        a.uplo,
        a.n,
        a.alpha,
        A,
        a.lda,
        x,
        a.incx,
        a.beta,
        y,
        a.incy,
      );
      return { y: await y.read() };
    },
  );
}
test("ssymv fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,
    // node:test context
    "ssymv (GPU-resident)",
    // routine name — used in the diagnostic label
    device,
    // WebGPU device instance
    NUM_RUNS,
    // 100 random inputs
    THRESHOLD,
    // threshold 2 — forward error factor ≤ 2 means within two roundings of true result
    fixtureSpecs,
    // param specs used to generate random inputs (n capped at 50 for speed)
    callGpuResident,
    // GPU call — wraps A, x, y into GpuMatrix/GpuVectors
    ssymvReference,
    // CPU reference
    forwardFactor,
    // |err| / (eps * forward bound) — see helpers.js
  );
});
test("ssymv edge cases (GPU-resident)", async (t) => {
  for (const tc of edge_cases_default) {
    await t.test(tc.label, async () => {
      const a = {
        uplo: tc.uplo,
        // which triangle of the symmetric matrix is stored
        n: tc.n,
        // matrix dimension (n×n)
        alpha: tc.alpha,
        // scale factor for A·x
        A: new Float32Array(tc.A),
        // matrix, row-major, size n*lda
        lda: tc.lda,
        // leading dimension (row stride) of A
        x: new Float32Array(tc.x),
        // input vector
        incx: tc.incx,
        // stride through x
        beta: tc.beta,
        // scale factor applied to existing y before accumulating
        y: new Float32Array(tc.y),
        // input/output vector
        incy: tc.incy,
        // stride through y
      };
      const got = await callGpuResident(device, a);
      const expected = ssymvReference(a);
      assert_default.deepEqual(got.y, expected.y);
    });
  }
});
test("ssymv edge cases (GPU-resident, column-major)", async (t) => {
  for (const tc of edge_cases_column_major_default) {
    await t.test(tc.label, async () => {
      const a = {
        uplo: tc.uplo,
        // which triangle of the symmetric matrix is stored
        n: tc.n,
        // matrix dimension (n×n)
        alpha: tc.alpha,
        // scale factor for A·x
        A: new Float32Array(tc.A),
        // matrix, column-major, size n*lda
        lda: tc.lda,
        // leading dimension (column stride) of A
        x: new Float32Array(tc.x),
        // input vector
        incx: tc.incx,
        // stride through x
        beta: tc.beta,
        // scale factor applied to existing y before accumulating
        y: new Float32Array(tc.y),
        // input/output vector
        incy: tc.incy,
        // stride through y
        layout: tc.layout,
        // "column-major"
      };
      const got = await callGpuResident(device, a);
      const expected = ssymvReference(a);
      assert_default.deepEqual(got.y, expected.y);
    });
  }
});
