import {
  edge_cases_column_major_default,
  edge_cases_default,
  forwardFactor,
} from "./chunk-57G2M3YA.mjs";
import { padMatrix, unpadMatrix, withGpuResources } from "./chunk-KSBTCQGM.mjs";
import { sgerReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import {
  GpuMatrix,
  GpuVector,
  cleanup,
  init,
  sger,
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

// tests/sger/src/gpustorage.sger.js
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
  m: loadParam("m"),
  n: {
    ...nSpec,
    edge: nSpec.edge.filter((e) => e.value !== -1),
    invalid: [
      ...nSpec.invalid,
      { value: -1, error: "n must be non-negative", label: "negative" },
    ],
  },
  alpha: loadParam("alpha"),
  x: { ...loadParam("x"), dependsOn: ["m", "incx"] },
  incx: loadParam("incx"),
  y: { ...loadParam("y"), dependsOn: ["n", "incy"] },
  incy: loadParam("incy"),
  A: loadParam("A"),
  lda: loadParam("lda"),
  layout: loadParam("layout"),
};
var fixtureSpecs = {
  ...validationSpecs,
  m: { ...validationSpecs.m, range: { min: 1, max: 50 } },
  n: { ...validationSpecs.n, range: { min: 1, max: 50 } },
};
async function callGpuResident(dev, a) {
  const layout = a.layout ?? "row-major";
  const isColMajor = layout === "column-major";
  const outerCount = isColMajor ? a.n : a.m;
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
      await sger(dev, a.m, a.n, a.alpha, x, a.incx, y, a.incy, A, a.lda);
      const dense = await A.read();
      return { A: unpadMatrix(dense, a.A, a.m, a.n, a.lda, layout) };
    },
  );
}
test("sger fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,
    // node:test context
    "sger (GPU-resident)",
    // routine name — used in the diagnostic label
    device,
    // WebGPU device instance
    NUM_RUNS,
    // 100 random inputs
    THRESHOLD,
    // threshold 2 — forward error factor ≤ 2 means within two roundings of true result
    fixtureSpecs,
    // param specs used to generate random inputs (m, n capped at 50 for speed)
    callGpuResident,
    // GPU call — wraps A, x, y into GpuMatrix/GpuVectors
    sgerReference,
    // CPU reference
    forwardFactor,
    // |err| / (eps * forward bound) — see helpers.js
  );
});
test("sger edge cases (GPU-resident)", async (t) => {
  for (const tc of edge_cases_default) {
    await t.test(tc.label, async () => {
      const a = {
        m: tc.m,
        // rows of A (length of x)
        n: tc.n,
        // columns of A (length of y)
        alpha: tc.alpha,
        // scale factor for x*y^T
        x: new Float32Array(tc.x),
        // input vector
        incx: tc.incx,
        // stride through x
        y: new Float32Array(tc.y),
        // input vector
        incy: tc.incy,
        // stride through y
        A: new Float32Array(tc.A),
        // matrix, row-major, size m*lda
        lda: tc.lda,
        // leading dimension (row stride) of A
      };
      const got = await callGpuResident(device, a);
      const expected = sgerReference(a);
      assert_default.deepEqual(got.A, expected.A);
    });
  }
});
test("sger edge cases (GPU-resident, column-major)", async (t) => {
  for (const tc of edge_cases_column_major_default) {
    await t.test(tc.label, async () => {
      const a = {
        m: tc.m,
        // rows of A (length of x)
        n: tc.n,
        // columns of A (length of y)
        alpha: tc.alpha,
        // scale factor for x*y^T
        x: new Float32Array(tc.x),
        // input vector
        incx: tc.incx,
        // stride through x
        y: new Float32Array(tc.y),
        // input vector
        incy: tc.incy,
        // stride through y
        A: new Float32Array(tc.A),
        // matrix, column-major, size n*lda
        lda: tc.lda,
        // leading dimension (column stride) of A
        layout: tc.layout,
        // "column-major"
      };
      const got = await callGpuResident(device, a);
      const expected = sgerReference(a);
      assert_default.deepEqual(got.A, expected.A);
    });
  }
});
