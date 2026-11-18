import {
  edge_cases_column_major_default,
  edge_cases_default,
  forwardFactor,
} from "./chunk-BAUESGWD.mjs";
import { padMatrix, withGpuResources } from "./chunk-KSBTCQGM.mjs";
import { sgemvReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import {
  GpuMatrix,
  GpuVector,
  cleanup,
  init,
  sgemv,
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

// tests/sgemv/src/gpustorage.sgemv.js
var NUM_RUNS = 100;
var THRESHOLD = 4;
var device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => {
  cleanup();
});
var validationSpecs = {
  device: loadParam("device"),
  trans: loadParam("trans"),
  m: loadParam("m"),
  n: loadParam("n"),
  alpha: loadParam("alpha"),
  beta: loadParam("beta"),
  lda: loadParam("lda"),
  A: loadParam("A"),
  x: loadParam("x"),
  incx: loadParam("incx"),
  y: loadParam("y"),
  incy: loadParam("incy"),
  layout: loadParam("layout"),
};
var fixtureSpecs = {
  ...validationSpecs,
  m: { ...validationSpecs.m, range: { min: 1, max: 50 } },
  n: { ...validationSpecs.n, range: { min: 1, max: 50 } },
};
async function callGpuResident(dev, a) {
  const layout = a.layout ?? "row-major";
  const outerCount = layout === "column-major" ? a.n : a.m;
  return withGpuResources(
    {
      A: () =>
        GpuMatrix.from(
          padMatrix(a.A, outerCount, a.lda),
          a.m,
          a.n,
          a.lda,
          layout,
        ),
      x: () => GpuVector.from(a.x),
      y: () => GpuVector.from(a.y),
    },
    async ({ A, x, y }) => {
      await sgemv(
        dev,
        a.trans,
        a.m,
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
test("sgemv fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,
    // node:test context
    "sgemv (GPU-resident)",
    // routine name — used in the diagnostic label
    device,
    // WebGPU device instance
    NUM_RUNS,
    // number of fast-check runs
    THRESHOLD,
    // max allowed forward error factor
    fixtureSpecs,
    // param specs used to generate random inputs (m, n capped at 50 for speed)
    callGpuResident,
    // GPU call — wraps A, x, y into GpuMatrix/GpuVectors
    sgemvReference,
    // CPU reference
    forwardFactor,
    // error metric: max |err| / (eps * per-element bound) across output
  );
});
test("sgemv edge cases (GPU-resident)", async (t) => {
  for (const tc of edge_cases_default) {
    await t.test(tc.label, async () => {
      const a = {
        trans: tc.trans,
        // whether to use A or Aᵀ
        m: tc.m,
        // rows of A
        n: tc.n,
        // columns of A
        alpha: tc.alpha,
        // scale factor for A·x
        A: new Float32Array(tc.A),
        // matrix, row-major, size m*lda
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
      const expected = sgemvReference(a);
      assert_default.deepEqual(got.y, expected.y);
    });
  }
});
test("sgemv edge cases (GPU-resident, column-major)", async (t) => {
  for (const tc of edge_cases_column_major_default) {
    await t.test(tc.label, async () => {
      const a = {
        trans: tc.trans,
        // whether to use A or Aᵀ
        m: tc.m,
        // rows of A
        n: tc.n,
        // columns of A
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
      const expected = sgemvReference(a);
      assert_default.deepEqual(got.y, expected.y);
    });
  }
});
