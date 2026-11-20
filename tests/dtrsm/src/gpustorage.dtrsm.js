// GPU-resident (GpuMatrix) coverage for dtrsm — same inputs and residual
// check as test.dtrsm.js, run through the overload where A/B stay on the
// GPU across the call (B solved in place in its own buffers).
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, GpuMatrix, randomFloat64Array } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { dtrsm } from "wgblas/dtrsm";
import { loadParam } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import {
  padMatrix,
  unpadMatrix,
  withGpuResources,
} from "../../helpers/gpustorage.js";
import { backwardResidualFactor } from "../helpers.js";
import { dtrsmReference as stdlibReference } from "../../helpers/stdlib.js";
import edgeCases from "../edge-cases.json" with { type: "json" };
import edgeCasesColumnMajor from "../edge-cases-column-major.json" with { type: "json" };

const NUM_RUNS = 100;
const THRESHOLD = 5; // see test.dtrsm.js

let device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => {
  cleanup();
});

const nSpec = loadParam("n");
const validationSpecs = {
  side: loadParam("side"),
  uplo: loadParam("uplo"),
  transA: loadParam("trans"),
  diag: loadParam("diag"),
  layout: loadParam("layout"),
  m: { ...loadParam("m"), baseline: 2 },
  n: {
    ...nSpec,
    baseline: 2,
    edge: nSpec.edge.filter((e) => e.value !== -1),
    invalid: [
      ...nSpec.invalid,
      { value: -1, error: "must be non-negative", label: "negative" },
    ],
  },
  alpha: loadParam("alpha"),
  // Diagonal kept away from 0, off-diagonals in [-0.5,0.5] — see test.dtrsm.js.
  A: {
    ...loadParam("A64"),
    dependsOn: ["m", "n", "lda", "side"],
    triangular: true,
    range: { elementMin: -0.5, elementMax: 0.5 },
  },
  lda: loadParam("ld"),
  B: { ...loadParam("B64"), dependsOn: ["m", "n", "ldb"] },
  ldb: loadParam("ld"),
};

// Cap m/n — validationSpecs' full range is too slow for property tests.
const fixtureSpecs = {
  ...validationSpecs,
  m: { ...validationSpecs.m, range: { min: 1, max: 20 } },
  n: { ...validationSpecs.n, range: { min: 1, max: 20 } },
};

// A is always aOrder x aOrder (order picked by side); B is always m x n —
// only the outerCount fed to padMatrix depends on layout.
async function callGpuResident(dev, a) {
  const layout = a.layout ?? "row-major";
  const isCM = layout === "column-major";
  const aOrder = a.side === "left" ? a.m : a.n;
  const bOuterCount = isCM ? a.n : a.m;

  return withGpuResources(
    {
      A: () =>
        GpuMatrix.from(
          padMatrix(a.A, aOrder, a.lda),
          aOrder,
          aOrder,
          a.lda,
          layout,
        ),
      B: () =>
        GpuMatrix.from(
          padMatrix(a.B, bOuterCount, a.ldb),
          a.m,
          a.n,
          a.ldb,
          layout,
        ),
    },
    async ({ A, B }) => {
      await dtrsm(
        dev,
        a.side,
        a.uplo,
        a.transA,
        a.diag,
        a.m,
        a.n,
        a.alpha,
        A,
        a.lda,
        B,
        a.ldb,
      );
      const dense = await B.read();
      return { B: unpadMatrix(dense, a.B, a.m, a.n, a.ldb, layout) };
    },
  );
}

function assertSolved(got, a) {
  const factor = backwardResidualFactor(got, null, a);
  assert.ok(
    factor <= THRESHOLD,
    `backward residual factor ${factor} exceeds threshold ${THRESHOLD}`,
  );
}

test("dtrsm fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,
    "dtrsm (GPU-resident)",
    device,
    NUM_RUNS,
    THRESHOLD,
    fixtureSpecs,
    callGpuResident,
    stdlibReference,
    backwardResidualFactor,
  );
});

test("dtrsm edge cases (GPU-resident)", async (t) => {
  for (const tc of edgeCases) {
    await t.test(tc.label, async () => {
      const a = {
        side: tc.side,
        uplo: tc.uplo,
        transA: tc.transA,
        diag: tc.diag,
        m: tc.m,
        n: tc.n,
        alpha: tc.alpha,
        A: new Float64Array(tc.A),
        lda: tc.lda,
        B: new Float64Array(tc.B),
        ldb: tc.ldb,
      };
      assertSolved(await callGpuResident(device, a), a);
    });
  }
});

test("dtrsm edge cases (GPU-resident, column-major)", async (t) => {
  for (const tc of edgeCasesColumnMajor) {
    await t.test(tc.label, async () => {
      const a = {
        layout: tc.layout,
        side: tc.side,
        uplo: tc.uplo,
        transA: tc.transA,
        diag: tc.diag,
        m: tc.m,
        n: tc.n,
        alpha: tc.alpha,
        A: new Float64Array(tc.A),
        lda: tc.lda,
        B: new Float64Array(tc.B),
        ldb: tc.ldb,
      };
      assertSolved(await callGpuResident(device, a), a);
    });
  }
});

// Fixtures stay within one block; the blocked solve's gathers and scatters
// write B's own GPU buffers in place here, both layouts, both directions
// (lower solves forward, upper backward with a short first block).
test("dtrsm blocked solve (GPU-resident)", async (t) => {
  const N = 150;
  const OTHER = 6;
  for (const layout of ["row-major", "column-major"])
    for (const side of ["left", "right"])
      for (const uplo of ["lower", "upper"])
        await t.test(`${layout} ${side} ${uplo}`, async () => {
          const A = randomFloat64Array(N * N, -1 / N, 1 / N, 161);
          for (let i = 0; i < N; i++) A[i * N + i] = 2;
          const m = side === "left" ? N : OTHER;
          const n = side === "left" ? OTHER : N;
          const a = {
            layout,
            side,
            uplo,
            transA: "no-transpose",
            diag: "non-unit",
            m,
            n,
            alpha: 1.5,
            A,
            lda: N,
            B: randomFloat64Array(m * n, -1, 1, 162),
            ldb: layout === "column-major" ? m : n,
          };
          assertSolved(await callGpuResident(device, a), a);
        });
});

// B may hold more rows than m: dtrsm only solves the m x n block in place,
// and the rows past it must come back as they were.
test("dtrsm GpuMatrix B larger than m x n", async () => {
  const A = GpuMatrix.from(new Float64Array([2, 0, 3, 4]), 2, 2, 2);
  const B = GpuMatrix.from(new Float64Array([2, 4, 15, 22, 5, 6]), 3, 2, 2);
  try {
    await dtrsm(
      device,
      "left",
      "lower",
      "no-transpose",
      "non-unit",
      2,
      2,
      1,
      A,
      2,
      B,
      2,
    );
    assert.deepEqual(await B.read(), new Float64Array([1, 2, 3, 4, 5, 6]));
  } finally {
    A.destroy();
    B.destroy();
  }
});
