// GPU-resident (GpuMatrix/GpuVector) coverage for dger — same inputs and
// stdlib oracle as test.dger.js, run through the overload where A/x/y stay
// on the GPU across the call.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, GpuMatrix, GpuVector } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { dger } from "wgblas/dger";
import { loadParam } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import {
  padMatrix,
  unpadMatrix,
  withGpuResources,
} from "../../helpers/gpustorage.js";
import { forwardFactor } from "../helpers.js";
import { dgerReference as stdlibReference } from "../../helpers/stdlib.js";
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
  m: loadParam("m"),
  n: {
    ...nSpec,
    edge: nSpec.edge.filter((e) => e.value !== -1),
    invalid: [
      ...nSpec.invalid,
      { value: -1, error: "n must be non-negative", label: "negative" },
    ],
  },
  alpha: loadParam("alpha64"),
  x: { ...loadParam("x64"), dependsOn: ["m", "incx"] },
  incx: loadParam("incx"),
  y: { ...loadParam("y64"), dependsOn: ["n", "incy"] },
  incy: loadParam("incy"),
  A: loadParam("A64"),
  lda: loadParam("lda"),
  layout: loadParam("layout"),
};

// Cap m and n for fixtures — validationSpecs allows much larger matrices which makes
// property tests prohibitively slow.
const fixtureSpecs = {
  ...validationSpecs,
  m: { ...validationSpecs.m, range: { min: 1, max: 50 } },
  n: { ...validationSpecs.n, range: { min: 1, max: 50 } },
};

// GpuMatrix's own layout wins over dger's layout arg, so a GPU-resident A
// never passes `layout` to dger() itself — only to GpuMatrix.from/unpadMatrix.
async function callGpuResident(dev, a) {
  const layout = a.layout ?? "row-major";
  const isColMajor = layout === "column-major";
  const outerCount = isColMajor ? a.n : a.m; // rows for row-major, cols for column-major
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
      await dger(dev, a.m, a.n, a.alpha, x, a.incx, y, a.incy, A, a.lda);
      const dense = await A.read();
      return { A: unpadMatrix(dense, a.A, a.m, a.n, a.lda, layout) };
    },
  );
}

test("dger fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t, // node:test context
    "dger (GPU-resident)", // routine name — used in the diagnostic label
    device, // WebGPU device instance
    NUM_RUNS, // 100 random inputs
    THRESHOLD, // forward error factor threshold
    fixtureSpecs, // param specs used to generate random inputs (m, n capped at 50 for speed)
    callGpuResident, // GPU call — wraps A, x, y into GpuMatrix/GpuVectors
    stdlibReference, // CPU reference
    forwardFactor, // |err| / (eps * forward bound) — see helpers.js
  );
});

test("dger edge cases (GPU-resident)", async (t) => {
  for (const tc of edgeCases) {
    await t.test(tc.label, async () => {
      const a = {
        m: tc.m, // rows of A (length of x)
        n: tc.n, // columns of A (length of y)
        alpha: tc.alpha, // scale factor for x*y^T
        x: new Float64Array(tc.x), // input vector
        incx: tc.incx, // stride through x
        y: new Float64Array(tc.y), // input vector
        incy: tc.incy, // stride through y
        A: new Float64Array(tc.A), // matrix, row-major, size m*lda
        lda: tc.lda, // leading dimension (row stride) of A
      };
      const got = await callGpuResident(device, a);
      const expected = stdlibReference(a);
      assert.deepEqual(got.A, expected.A);
    });
  }
});

test("dger edge cases (GPU-resident, column-major)", async (t) => {
  for (const tc of edgeCasesColumnMajor) {
    await t.test(tc.label, async () => {
      const a = {
        m: tc.m, // rows of A (length of x)
        n: tc.n, // columns of A (length of y)
        alpha: tc.alpha, // scale factor for x*y^T
        x: new Float64Array(tc.x), // input vector
        incx: tc.incx, // stride through x
        y: new Float64Array(tc.y), // input vector
        incy: tc.incy, // stride through y
        A: new Float64Array(tc.A), // matrix, column-major, size n*lda
        lda: tc.lda, // leading dimension (column stride) of A
        layout: tc.layout, // "column-major"
      };
      const got = await callGpuResident(device, a);
      const expected = stdlibReference(a);
      assert.deepEqual(got.A, expected.A);
    });
  }
});
