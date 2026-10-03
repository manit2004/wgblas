import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, randomFloat64Array } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { dtrsv } from "wgblas/dtrsv";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { backwardResidualFactor } from "../helpers.js";
import edgeCases from "../edge-cases.json" with { type: "json" };
import edgeCasesColumnMajor from "../edge-cases-column-major.json" with { type: "json" };

const NUM_RUNS = 100;
// Forward-error cap, pinned to the high-performance/NVIDIA-calibrated bound
// (see tests/dger/src/test.dger.js) — dtrsv is the first f64 routine to use
// ddDivProtected (block inversion's non-unit-diagonal division), deliberately
// last in the port order since division is where dnrm2 found real DD
// edge-case bugs during the L1 port.
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
  // range is also tightened to [-1,1]: with diag="unit" the diagonal is implicitly 1
  // (the triangular patch above doesn't apply), so an off-diagonal magnitude near the
  // default ±10 compounds across a long dependency chain (n up to 50) and could overflow —
  // same reasoning as strsv's own fixture spec.
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

test("dtrsv validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) =>
      dtrsv(
        a.device,
        a.uplo,
        a.trans,
        a.diag,
        a.n,
        a.A,
        a.lda,
        a.x,
        a.incx,
        a.layout,
      ),
    { device },
  );
});

test("dtrsv fixtures", async (t) => {
  await runFixtures(
    t, // node:test context
    "dtrsv", // routine name
    device, // GPUDevice
    NUM_RUNS, // number of fast-check runs
    THRESHOLD, // max allowed backward-residual factor
    fixtureSpecs, // A's spec has triangular: true — buildArb keeps its diagonal safe
    async (dev, a) =>
      dtrsv(
        dev,
        a.uplo,
        a.trans,
        a.diag,
        a.n,
        a.A,
        a.lda,
        a.x,
        a.incx,
        a.layout,
      ), // GPU impl
    () => ({}), // no CPU reference needed — backwardResidualFactor self-checks against b
    backwardResidualFactor, // error metric: plug GPU x back into op(A)*x and compare to b
  );
});

// Small hand-picked scenarios (transpose x uplo x diag combos, non-unit stride)
// loaded from edge-cases.json. dtrsv is the first L2 routine using
// ddDivProtected (non-unit-diagonal division), which divide.wgsl's own
// header documents as having much higher low-power/Intel variance than
// mul/add — bit-exact equality against stdlib (what dtrmv/dsymv/dgemv's
// division-free edge cases use) isn't reliable here even for "clean" inputs
// like 10/5. Same backward-residual threshold check the fixtures test uses,
// following dnrm2's own precedent for its ddDivProtected/ddSqrtProtected
// edge cases.
test("dtrsv edge cases", async (t) => {
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
      const { x: got } = await dtrsv(
        device, // GPU device
        a.uplo, // which triangle of A is stored
        a.trans, // whether to use A or Aᵀ
        a.diag, // unit (diagonal implicitly 1) or non-unit (read from A)
        a.n, // matrix dimension (n×n)
        a.A, // matrix, row-major, size n*lda
        a.lda, // leading dimension (row stride) of A
        a.x, // holds b on input, the solution on output
        a.incx, // stride through x
      ); // GPU result
      const factor = backwardResidualFactor({ x: got }, null, a);
      assert.ok(
        factor <= THRESHOLD,
        `${c.label}: backward residual factor ${factor} > ${THRESHOLD}`,
      );
    });
  }
});

// Zero-dimension edge case: dtrsv is in-place on x (no separate y, no
// beta), and n ties A's order and x's length together, so n=0 is fully
// vacuous. Guards that x comes back byte-for-byte untouched.
test("dtrsv zero-dimension (regression)", async (t) => {
  await t.test("n=0", async () => {
    const xBefore = randomFloat64Array(4, -1, 1, 9601);
    const x = Float64Array.from(xBefore);
    const got = await dtrsv(
      device,
      "lower",
      "no-transpose",
      "non-unit",
      0, // n=0
      new Float64Array(0), // A: 0x0 has no elements
      1,
      x,
      1,
    );
    assert.deepEqual(got.x, xBefore);
  });
});

// Small hand-picked scenarios loaded from edge-cases-column-major.json.
test("dtrsv edge cases (column-major)", async (t) => {
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
      const { x: got } = await dtrsv(
        device, // GPU device
        a.uplo, // which triangle of A is stored
        a.trans, // whether to use A or Aᵀ
        a.diag, // unit (diagonal implicitly 1) or non-unit (read from A)
        a.n, // matrix dimension (n×n)
        a.A, // matrix, column-major, size n*lda
        a.lda, // leading dimension (column stride) of A
        a.x, // holds b on input, the solution on output
        a.incx, // stride through x
        a.layout, // storage layout
      ); // GPU result
      const factor = backwardResidualFactor({ x: got }, null, a);
      assert.ok(
        factor <= THRESHOLD,
        `${c.label}: backward residual factor ${factor} > ${THRESHOLD}`,
      );
    });
  }
});
