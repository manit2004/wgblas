// GPU-resident (GpuMatrix/GpuVector) coverage for dtrsv — same inputs and
// backward-residual metric as test.dtrsv.js, run through the overload where
// A/x stay on the GPU across the call, to exercise the AIsGpu/xIsGpu
// branches in dtrsv.mjs.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, GpuMatrix, GpuVector } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { dtrsv } from "wgblas/dtrsv";
import { loadParam } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { padMatrix, withGpuResources } from "../../helpers/gpustorage.js";
import { backwardResidualFactor } from "../helpers.js";
import edgeCases from "../edge-cases.json" with { type: "json" };
import edgeCasesColumnMajor from "../edge-cases-column-major.json" with { type: "json" };

const NUM_RUNS = 100;
const THRESHOLD = 5;

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
    range: { elementMin: -1.0, elementMax: 1.0 },
  },
  lda: loadParam("lda"),
  x: { ...loadParam("x64"), dependsOn: ["n", "incx"] },
  incx: loadParam("incx"),
  layout: loadParam("layout"),
};

// Cap n for fixtures — validationSpecs allows up to 1000, which makes property tests slow.
const fixtureSpecs = {
  ...validationSpecs,
  n: { ...validationSpecs.n, range: { min: 1, max: 50 } },
};

// GpuMatrix's own layout wins over dtrsv's layout arg, so a GPU-resident A
// never passes `layout` to dtrsv() itself — only to GpuMatrix.from. A is
// square (n×n), so the padMatrix outer count (n) doesn't change with layout.
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
    t, // node:test context
    "dtrsv (GPU-resident)", // routine name
    device, // GPUDevice
    NUM_RUNS, // number of fast-check runs
    THRESHOLD, // max allowed backward-residual factor
    fixtureSpecs, // A's spec has triangular: true — buildArb keeps its diagonal safe
    callGpuResident, // GPU impl — wraps A/x into GpuMatrix/GpuVector
    () => ({}), // no CPU reference needed — backwardResidualFactor self-checks against b
    backwardResidualFactor, // error metric
  );
});

test("dtrsv edge cases (GPU-resident)", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        uplo: c.uplo, // which triangle of A is stored
        trans: c.trans, // whether to use A or Aᵀ
        diag: c.diag, // unit (diagonal implicitly 1) or non-unit (read from A)
        n: c.n, // matrix dimension (n×n)
        A: new Float64Array(c.A), // matrix, row-major, size n*lda
        lda: c.lda, // leading dimension (row stride) of A
        x: new Float64Array(c.x), // holds b on input, the solution on output
        incx: c.incx, // stride through x
      };
      const { x: got } = await callGpuResident(device, a); // GPU result
      const factor = backwardResidualFactor({ x: got }, null, a);
      assert.ok(
        factor <= THRESHOLD,
        `${c.label}: backward residual factor ${factor} > ${THRESHOLD}`,
      );
    });
  }
});

test("dtrsv edge cases (GPU-resident, column-major)", async (t) => {
  for (const c of edgeCasesColumnMajor) {
    await t.test(c.label, async () => {
      const a = {
        uplo: c.uplo, // which triangle of A is stored
        trans: c.trans, // whether to use A or Aᵀ
        diag: c.diag, // unit (diagonal implicitly 1) or non-unit (read from A)
        n: c.n, // matrix dimension (n×n)
        A: new Float64Array(c.A), // matrix, column-major, size n*lda
        lda: c.lda, // leading dimension (column stride) of A
        x: new Float64Array(c.x), // holds b on input, the solution on output
        incx: c.incx, // stride through x
        layout: c.layout, // "column-major"
      };
      const { x: got } = await callGpuResident(device, a); // GPU result
      const factor = backwardResidualFactor({ x: got }, null, a);
      assert.ok(
        factor <= THRESHOLD,
        `${c.label}: backward residual factor ${factor} > ${THRESHOLD}`,
      );
    });
  }
});
