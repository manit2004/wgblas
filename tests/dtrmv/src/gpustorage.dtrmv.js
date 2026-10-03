// GPU-resident (GpuMatrix/GpuVector) coverage for dtrmv — same inputs and stdlib
// oracle as test.dtrmv.js, run through the overload where A/x/y stay on the GPU
// across the call, to exercise the AIsGpu/xIsGpu/yIsGpu branches in dtrmv.mjs.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, GpuMatrix, GpuVector } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { dtrmv } from "wgblas/dtrmv";
import { loadParam } from "../../helpers/validation.js";
import { runFixtures, makeVec } from "../../helpers/fixtures.js";
import { padMatrix, withGpuResources } from "../../helpers/gpustorage.js";
import { forwardFactor } from "../helpers.js";
import { dtrmvReference as stdlibReference } from "../../helpers/stdlib.js";
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
  A: { ...loadParam("A64"), dependsOn: ["n", "lda"] },
  lda: loadParam("lda"),
  x: { ...loadParam("x64"), dependsOn: ["n", "incx"] },
  incx: loadParam("incx"),
  y: { ...loadParam("y64"), dependsOn: ["n", "incy"] },
  incy: loadParam("incy"),
  layout: loadParam("layout"),
};

// Cap n for fixtures — validationSpecs allows up to 1000, which makes property tests slow.
const fixtureSpecs = {
  ...validationSpecs,
  n: { ...validationSpecs.n, range: { min: 1, max: 50 } },
};

// GpuMatrix's own layout wins over dtrmv's layout arg, so a GPU-resident A
// never passes `layout` to dtrmv() itself — only to GpuMatrix.from. A is
// square (n×n), so the padMatrix outer count (n) doesn't change with layout.
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
      await dtrmv(
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

test("dtrmv fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t, // node:test context
    "dtrmv (GPU-resident)", // routine name
    device, // GPUDevice
    NUM_RUNS, // number of fast-check runs
    THRESHOLD, // max allowed forward error factor
    fixtureSpecs, // param specs used to generate random inputs
    callGpuResident, // GPU impl — wraps A/x/y into GpuMatrix/GpuVector
    stdlibReference, // CPU reference
    forwardFactor, // error metric
  );
});

test("dtrmv edge cases (GPU-resident)", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        uplo: c.uplo, // which triangle of A is stored
        trans: c.trans, // whether to use A or Aᵀ
        diag: c.diag, // unit (diagonal implicitly 1) or non-unit (read from A)
        n: c.n, // matrix dimension (n×n)
        A: new Float64Array(c.A), // matrix, row-major, size n*lda
        lda: c.lda, // leading dimension (row stride) of A
        x: new Float64Array(c.x), // input vector
        incx: c.incx, // stride through x
        y: makeVec(c.n, c.incy, 99, Float64Array), // output vector — only y[i*incy] for i in [0,n) is written
        incy: c.incy, // stride through y
      };
      const { y: got } = await callGpuResident(device, a); // GPU result
      const { y: expected } = stdlibReference(a); // stdlib result
      assert.deepEqual(got, expected);
    });
  }
});

test("dtrmv edge cases (GPU-resident, column-major)", async (t) => {
  for (const c of edgeCasesColumnMajor) {
    await t.test(c.label, async () => {
      const a = {
        uplo: c.uplo, // which triangle of A is stored
        trans: c.trans, // whether to use A or Aᵀ
        diag: c.diag, // unit (diagonal implicitly 1) or non-unit (read from A)
        n: c.n, // matrix dimension (n×n)
        A: new Float64Array(c.A), // matrix, column-major, size n*lda
        lda: c.lda, // leading dimension (column stride) of A
        x: new Float64Array(c.x), // input vector
        incx: c.incx, // stride through x
        y: makeVec(c.n, c.incy, 99, Float64Array), // output vector — only y[i*incy] for i in [0,n) is written
        incy: c.incy, // stride through y
        layout: c.layout, // "column-major"
      };
      const { y: got } = await callGpuResident(device, a); // GPU result
      const { y: expected } = stdlibReference(a); // stdlib result
      assert.deepEqual(got, expected);
    });
  }
});
