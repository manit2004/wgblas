// GPU-resident (GpuMatrix/GpuVector) coverage for ssyr — same inputs and
// stdlib oracle as test.ssyr.js, run through the overload where A/x stay on
// the GPU across the call.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, GpuMatrix, GpuVector } from "wgblas";
import { ssyr } from "wgblas/ssyr";
import { loadParam } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { padMatrix, unpadMatrix, withGpuResources } from "../../helpers/gpustorage.js";
import { forwardFactor } from "../helpers.js";
import { ssyrReference as stdlibReference } from "../../helpers/stdlib.js";
import edgeCases from "../edge-cases.json" with { type: "json" };
import edgeCasesColumnMajor from "../edge-cases-column-major.json" with { type: "json" };

const NUM_RUNS = 100;
const THRESHOLD = 2;

let device;
before(async () => {
  device = await init();
});
after(() => {
  cleanup();
});

const nSpec = loadParam("n");
const validationSpecs = {
  device: loadParam("device"),
  uplo:   loadParam("uplo"),
  n: {
    ...nSpec,
    edge:    nSpec.edge.filter((e) => e.value !== -1),
    invalid: [...nSpec.invalid, { value: -1, error: "n must be non-negative", label: "negative" }],
  },
  alpha:  loadParam("alpha"),
  x:      { ...loadParam("x"), dependsOn: ["n", "incx"] },
  incx:   loadParam("incx"),
  A:      { ...loadParam("A"), dependsOn: ["n", "lda"] },
  lda:    loadParam("lda"),
  layout: loadParam("layout"),
};

// Cap n: validationSpecs allows up to 1000 but n×n matrices at that size make property tests slow.
const fixtureSpecs = { ...validationSpecs, n: { ...validationSpecs.n, range: { min: 1, max: 50 } } };

// GpuMatrix's own layout wins over ssyr's layout arg, so a GPU-resident A
// never passes `layout` to ssyr() itself — only to GpuMatrix.from/unpadMatrix.
// A is square (n×n), so the padMatrix outer count (n) doesn't change with layout.
async function callGpuResident(dev, a) {
  const layout = a.layout ?? "row-major";
  return withGpuResources(
    {
      A: GpuMatrix.from(padMatrix(a.A, a.n, a.lda), a.n, a.n, a.lda, layout),
      x: GpuVector.from(a.x),
    },
    async ({ A, x }) => {
      await ssyr(dev, a.uplo, a.n, a.alpha, x, a.incx, A, a.lda);
      const dense = await A.read();
      return { A: unpadMatrix(dense, a.A, a.n, a.n, a.lda, layout) };
    },
  );
}

test("ssyr fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,                    // node:test context
    "ssyr (GPU-resident)", // routine name — used in the diagnostic label
    device,               // WebGPU device instance
    NUM_RUNS,             // 100 random inputs
    THRESHOLD,            // threshold 2 — forward error factor ≤ 2 means within two roundings of true result
    fixtureSpecs,         // param specs used to generate random inputs (n capped at 50 for speed)
    callGpuResident,      // GPU call — wraps A, x into GpuMatrix/GpuVector
    stdlibReference,      // CPU reference
    forwardFactor,        // |err| / (eps * forward bound) — see helpers.js
  );
});

test("ssyr edge cases (GPU-resident)", async (t) => {
  for (const tc of edgeCases) {
    await t.test(tc.label, async () => {
      const a = {
        uplo: tc.uplo,               // which triangle of the symmetric matrix is stored
        n: tc.n,                     // matrix dimension (n×n)
        alpha: tc.alpha,             // scale factor for x*x^T
        x: new Float32Array(tc.x),   // input vector
        incx: tc.incx,               // stride through x
        A: new Float32Array(tc.A),   // matrix, row-major, size n*lda
        lda: tc.lda,                 // leading dimension (row stride) of A
      };
      const got = await callGpuResident(device, a);
      const expected = stdlibReference(a);
      assert.deepEqual(got.A, expected.A);
    });
  }
});

test("ssyr edge cases (GPU-resident, column-major)", async (t) => {
  for (const tc of edgeCasesColumnMajor) {
    await t.test(tc.label, async () => {
      const a = {
        uplo: tc.uplo,               // which triangle of the symmetric matrix is stored
        n: tc.n,                     // matrix dimension (n×n)
        alpha: tc.alpha,             // scale factor for x*x^T
        x: new Float32Array(tc.x),   // input vector
        incx: tc.incx,               // stride through x
        A: new Float32Array(tc.A),   // matrix, column-major, size n*lda
        lda: tc.lda,                 // leading dimension (column stride) of A
        layout: tc.layout,           // "column-major"
      };
      const got = await callGpuResident(device, a);
      const expected = stdlibReference(a);
      assert.deepEqual(got.A, expected.A);
    });
  }
});
