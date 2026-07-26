import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { strsv } from "wgblas/strsv";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { strsvReference as stdlibReference } from "../../helpers/stdlib.js";
import { backwardResidualFactor } from "../helpers.js";
import edgeCases from "../edge-cases.json" with { type: "json" };

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
};

// Cap n for fixtures — validationSpecs allows up to 1000, which makes property tests slow.
const fixtureSpecs = { ...validationSpecs, n: { ...validationSpecs.n, range: { min: 1, max: 50 } } };

test("strsv validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => strsv(a.device, a.uplo, a.trans, a.diag, a.n, a.A, a.lda, a.x, a.incx),
    { device },
  );
});

test("strsv fixtures", async (t) => {
  await runFixtures(
    t,                          // node:test context
    "strsv",                    // routine name
    device,                     // GPUDevice
    NUM_RUNS,                   // number of fast-check runs
    THRESHOLD,                  // max allowed backward-residual factor
    fixtureSpecs,               // A's spec has triangular: true — buildArb keeps its diagonal safe
    async (dev, a) => strsv(dev, a.uplo, a.trans, a.diag, a.n, a.A, a.lda, a.x, a.incx), // GPU impl
    () => ({}),                 // no CPU reference needed — backwardResidualFactor self-checks against b
    backwardResidualFactor,     // error metric: plug GPU x back into op(A)*x and compare to b
  );
});

// Small hand-picked scenarios (transpose x uplo x diag combos, non-unit stride)
// loaded from edge-cases.json. Expected output is computed live from stdlib.
test("strsv edge cases", async (t) => {
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
      const { x: got } = await strsv(
        device,   // GPU device
        a.uplo,   // which triangle of A is stored
        a.trans,  // whether to use A or Aᵀ
        a.diag,   // unit (diagonal implicitly 1) or non-unit (read from A)
        a.n,      // matrix dimension (n×n)
        a.A,      // matrix, row-major, size n*lda
        a.lda,    // leading dimension (row stride) of A
        a.x,      // holds b on input, the solution on output
        a.incx,   // stride through x
      ); // GPU result
      const { x: expected } = stdlibReference(a); // stdlib result
      assert.deepEqual(got, expected);
    });
  }
});
