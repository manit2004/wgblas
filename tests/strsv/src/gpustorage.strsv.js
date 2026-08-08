// GPU-resident (GpuMatrix/GpuVector) coverage for strsv — same inputs and
// backward-residual metric as test.strsv.js, run through the overload where
// A/x stay on the GPU across the call, to exercise the AIsGpu/xIsGpu branches
// in strsv.mjs.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, GpuMatrix, GpuVector } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { strsv } from "wgblas/strsv";
import { loadParam } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { padMatrix, withGpuResources } from "../../helpers/gpustorage.js";
import { strsvReference as stdlibReference } from "../../helpers/stdlib.js";
import { backwardResidualFactor } from "../helpers.js";
import edgeCases from "../edge-cases.json" with { type: "json" };
import edgeCasesColumnMajor from "../edge-cases-column-major.json" with { type: "json" };

const NUM_RUNS = 100;
const THRESHOLD = 2;

let device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => {
  cleanup();
});

const nSpec = loadParam("n");
const validationSpecs = {
  device: loadParam("device"),
  uplo:   loadParam("uplo"),
  trans:  loadParam("trans"),
  diag:   loadParam("diag"),
  n: {
    ...nSpec,
    edge:    nSpec.edge.filter((e) => e.value !== -1),
    invalid: [...nSpec.invalid, { value: -1, error: "n must be non-negative", label: "negative" }],
  },
  // triangular: true keeps buildArb's diagonal well away from 0 — strsv divides by it.
  // range is also tightened to [-1,1]: with diag="unit" the diagonal is implicitly 1
  // (the triangular patch above doesn't apply), so an off-diagonal magnitude near the
  // default ±10 compounds across a long dependency chain (n up to 50) and overflows
  // float32 to Infinity/NaN — a pathological fixture, not a real accuracy bug.
  A:      { ...loadParam("A"), dependsOn: ["n", "lda"], triangular: true, range: { elementMin: -1.0, elementMax: 1.0 } },
  lda:    loadParam("lda"),
  x:      { ...loadParam("x"), dependsOn: ["n", "incx"] },
  incx:   loadParam("incx"),
  layout: loadParam("layout"),
};

// Cap n for fixtures — validationSpecs allows up to 1000, which makes property tests slow.
const fixtureSpecs = { ...validationSpecs, n: { ...validationSpecs.n, range: { min: 1, max: 50 } } };

// GpuMatrix's own layout wins over strsv's layout arg, so a GPU-resident A
// never passes `layout` to strsv() itself — only to GpuMatrix.from. A is
// square (n×n), so the padMatrix outer count (n) doesn't change with layout.
async function callGpuResident(dev, a) {
  const layout = a.layout ?? "row-major";
  return withGpuResources(
    {
      A: GpuMatrix.from(padMatrix(a.A, a.n, a.lda), a.n, a.n, a.lda, layout),
      x: GpuVector.from(a.x),
    },
    async ({ A, x }) => {
      await strsv(dev, a.uplo, a.trans, a.diag, a.n, A, a.lda, x, a.incx);
      return { x: await x.read() };
    },
  );
}

test("strsv fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,                             // node:test context
    "strsv (GPU-resident)",        // routine name
    device,                        // GPUDevice
    NUM_RUNS,                      // number of fast-check runs
    THRESHOLD,                     // max allowed backward-residual factor
    fixtureSpecs,                  // A's spec has triangular: true — buildArb keeps its diagonal safe
    callGpuResident,               // GPU impl — wraps A/x into GpuMatrix/GpuVector
    () => ({}),                    // no CPU reference needed — backwardResidualFactor self-checks against b
    backwardResidualFactor,        // error metric
  );
});

test("strsv edge cases (GPU-resident)", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        uplo: c.uplo,                 // which triangle of A is stored
        trans: c.trans,               // whether to use A or Aᵀ
        diag: c.diag,                 // unit (diagonal implicitly 1) or non-unit (read from A)
        n: c.n,                       // matrix dimension (n×n)
        A: new Float32Array(c.A),     // matrix, row-major, size n*lda
        lda: c.lda,                   // leading dimension (row stride) of A
        x: new Float32Array(c.x),     // holds b on input, the solution on output
        incx: c.incx,                 // stride through x
      };
      const { x: got } = await callGpuResident(device, a); // GPU result
      const { x: expected } = stdlibReference(a); // stdlib result
      assert.deepEqual(got, expected);
    });
  }
});

test("strsv edge cases (GPU-resident, column-major)", async (t) => {
  for (const c of edgeCasesColumnMajor) {
    await t.test(c.label, async () => {
      const a = {
        uplo: c.uplo,                 // which triangle of A is stored
        trans: c.trans,               // whether to use A or Aᵀ
        diag: c.diag,                 // unit (diagonal implicitly 1) or non-unit (read from A)
        n: c.n,                       // matrix dimension (n×n)
        A: new Float32Array(c.A),     // matrix, column-major, size n*lda
        lda: c.lda,                   // leading dimension (column stride) of A
        x: new Float32Array(c.x),     // holds b on input, the solution on output
        incx: c.incx,                 // stride through x
        layout: c.layout,             // "column-major"
      };
      const { x: got } = await callGpuResident(device, a); // GPU result
      const { x: expected } = stdlibReference(a); // stdlib result
      assert.deepEqual(got, expected);
    });
  }
});
