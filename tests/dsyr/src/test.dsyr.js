import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, randomFloat64Array } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { dsyr } from "wgblas/dsyr";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { forwardFactor } from "../helpers.js";
import { dsyrReference as stdlibReference } from "../../helpers/stdlib.js";
import edgeCases from "../edge-cases.json" with { type: "json" };
import edgeCasesColumnMajor from "../edge-cases-column-major.json" with { type: "json" };

const NUM_RUNS = 100;
// Forward-error cap, pinned to the high-performance/NVIDIA-calibrated bound
// (see tests/dger/src/test.dger.js) — dsyr does real double-double
// arithmetic (mul+add per element), so like the other arithmetic f64
// routines this is not expected to clear on the low-power/Intel backend.
const THRESHOLD = 5;

let device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => {
  cleanup();
});

// n: negative throws (not a noop) — move n=-1 from edge to invalid, matching ssyr.
// x: depends only on n (no trans/m) — override the default trans/m/n-based dependsOn.
// A: depends on n/lda only (square, no separate m) — matches ssymv's A override.
const nSpec = loadParam("n");
const validationSpecs = {
  device: loadParam("device"),
  uplo: loadParam("uplo"),
  n: {
    ...nSpec,
    edge: nSpec.edge.filter((e) => e.value !== -1),
    invalid: [
      ...nSpec.invalid,
      { value: -1, error: "n must be non-negative", label: "negative" },
    ],
  },
  alpha: loadParam("alpha64"),
  x: { ...loadParam("x64"), dependsOn: ["n", "incx"] },
  incx: loadParam("incx"),
  A: { ...loadParam("A64"), dependsOn: ["n", "lda"] },
  lda: loadParam("lda"),
  layout: loadParam("layout"),
};

test("dsyr validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) =>
      dsyr(a.device, a.uplo, a.n, a.alpha, a.x, a.incx, a.A, a.lda, a.layout),
    { device },
  );
});

// Cap n: validationSpecs allows up to 1000 but n×n matrices at that size make property tests slow.
const fixtureSpecs = {
  ...validationSpecs,
  n: { ...validationSpecs.n, range: { min: 1, max: 50 } },
};

test("dsyr fixtures", async (t) => {
  await runFixtures(
    t, // node:test context
    "dsyr", // routine name — used in the diagnostic label
    device, // WebGPU device instance
    NUM_RUNS, // 100 random inputs
    THRESHOLD, // forward error factor threshold
    fixtureSpecs, // param specs used to generate random inputs (n capped at 50 for speed)
    async (dev, a) =>
      dsyr(dev, a.uplo, a.n, a.alpha, a.x, a.incx, a.A, a.lda, a.layout), // GPU call
    stdlibReference, // CPU reference
    forwardFactor, // |err| / (eps * forward bound) — see helpers.js
  );
});

// Small hand-picked scenarios loaded from edge-cases.json. Expected output is
// computed live from stdlib, not hardcoded.
test("dsyr edge cases", async (t) => {
  for (const tc of edgeCases) {
    await t.test(tc.label, async () => {
      const a = {
        uplo: tc.uplo, // which triangle of the symmetric matrix is stored
        n: tc.n, // matrix dimension (n×n)
        alpha: tc.alpha, // scale factor for x*x^T
        x: new Float64Array(tc.x), // input vector
        incx: tc.incx, // stride through x
        A: new Float64Array(tc.A), // matrix, row-major, size n*lda, mutated in place
        lda: tc.lda, // leading dimension (row stride) of A
      };
      const got = await dsyr(
        device, // GPU device
        a.uplo, // which triangle of the symmetric matrix is stored
        a.n, // matrix dimension (n×n)
        a.alpha, // scale factor for x*x^T
        a.x, // input vector
        a.incx, // stride through x
        a.A, // matrix, row-major, size n*lda
        a.lda, // leading dimension (row stride) of A
      );
      const expected = stdlibReference(a);
      assert.deepEqual(got.A, expected.A);
    });
  }
});

// Zero-dimension edge case: n ties A's order and x's length together, so
// n=0 is fully vacuous. Guards that A comes back byte-for-byte untouched.
test("dsyr zero-dimension (regression)", async (t) => {
  await t.test("n=0", async () => {
    const before = randomFloat64Array(4, -1, 1, 9301);
    const A = Float64Array.from(before);
    const got = await dsyr(
      device,
      "lower",
      0, // n=0
      1.5,
      new Float64Array(0), // x: length n=0
      1,
      A,
      1,
    );
    assert.deepEqual(got.A, before);
  });
});

// Small hand-picked scenarios loaded from edge-cases-column-major.json.
test("dsyr edge cases (column-major)", async (t) => {
  for (const tc of edgeCasesColumnMajor) {
    await t.test(tc.label, async () => {
      const a = {
        uplo: tc.uplo, // which triangle of the symmetric matrix is stored
        n: tc.n, // matrix dimension (n×n)
        alpha: tc.alpha, // scale factor for x*x^T
        x: new Float64Array(tc.x), // input vector
        incx: tc.incx, // stride through x
        A: new Float64Array(tc.A), // matrix, column-major, size n*lda, mutated in place
        lda: tc.lda, // leading dimension (column stride) of A
        layout: tc.layout, // "column-major"
      };
      const got = await dsyr(
        device, // GPU device
        a.uplo, // which triangle of the symmetric matrix is stored
        a.n, // matrix dimension (n×n)
        a.alpha, // scale factor for x*x^T
        a.x, // input vector
        a.incx, // stride through x
        a.A, // matrix, column-major, size n*lda
        a.lda, // leading dimension (column stride) of A
        a.layout, // storage layout
      );
      const expected = stdlibReference(a);
      assert.deepEqual(got.A, expected.A);
    });
  }
});
