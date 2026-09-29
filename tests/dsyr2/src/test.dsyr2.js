import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, randomFloat64Array } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { dsyr2 } from "wgblas/dsyr2";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { forwardFactor } from "../helpers.js";
import { dsyr2Reference as stdlibReference } from "../../helpers/stdlib.js";
import edgeCases from "../edge-cases.json" with { type: "json" };
import edgeCasesColumnMajor from "../edge-cases-column-major.json" with { type: "json" };

const NUM_RUNS = 100;
// Forward-error cap, pinned to the high-performance/NVIDIA-calibrated bound
// (see tests/dger/src/test.dger.js) — dsyr2 does real double-double
// arithmetic (two mul + two add per element), so like the other arithmetic
// f64 routines this is not expected to clear on the low-power/Intel backend.
const THRESHOLD = 5;

let device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => {
  cleanup();
});

// n: negative throws (not a noop) — move n=-1 from edge to invalid, matching ssyr2.
// x/y: depend only on n (no trans/m) — override the default trans/m/n-based dependsOn.
// A: depends on n/lda only (square, no separate m) — matches dsyr's A override.
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
  y: { ...loadParam("y64"), dependsOn: ["n", "incy"] },
  incy: loadParam("incy"),
  A: { ...loadParam("A64"), dependsOn: ["n", "lda"] },
  lda: loadParam("lda"),
  layout: loadParam("layout"),
};

test("dsyr2 validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) =>
      dsyr2(
        a.device,
        a.uplo,
        a.n,
        a.alpha,
        a.x,
        a.incx,
        a.y,
        a.incy,
        a.A,
        a.lda,
        a.layout,
      ),
    { device },
  );
});

// Cap n: validationSpecs allows up to 1000 but n×n matrices at that size make property tests slow.
const fixtureSpecs = {
  ...validationSpecs,
  n: { ...validationSpecs.n, range: { min: 1, max: 50 } },
};

test("dsyr2 fixtures", async (t) => {
  await runFixtures(
    t, // node:test context
    "dsyr2", // routine name — used in the diagnostic label
    device, // WebGPU device instance
    NUM_RUNS, // 100 random inputs
    THRESHOLD, // forward error factor threshold
    fixtureSpecs, // param specs used to generate random inputs (n capped at 50 for speed)
    async (dev, a) =>
      dsyr2(
        dev,
        a.uplo,
        a.n,
        a.alpha,
        a.x,
        a.incx,
        a.y,
        a.incy,
        a.A,
        a.lda,
        a.layout,
      ), // GPU call
    stdlibReference, // CPU reference
    forwardFactor, // |err| / (eps * forward bound) — see helpers.js
  );
});

// Small hand-picked scenarios loaded from edge-cases.json. Expected output is
// computed live from stdlib, not hardcoded.
test("dsyr2 edge cases", async (t) => {
  for (const tc of edgeCases) {
    await t.test(tc.label, async () => {
      const a = {
        uplo: tc.uplo, // which triangle of the symmetric matrix is stored
        n: tc.n, // matrix dimension (n×n)
        alpha: tc.alpha, // scale factor for x*y^T + y*x^T
        x: new Float64Array(tc.x), // input vector
        incx: tc.incx, // stride through x
        y: new Float64Array(tc.y), // input vector
        incy: tc.incy, // stride through y
        A: new Float64Array(tc.A), // matrix, row-major, size n*lda, mutated in place
        lda: tc.lda, // leading dimension (row stride) of A
      };
      const got = await dsyr2(
        device, // GPU device
        a.uplo, // which triangle of the symmetric matrix is stored
        a.n, // matrix dimension (n×n)
        a.alpha, // scale factor for x*y^T + y*x^T
        a.x, // input vector
        a.incx, // stride through x
        a.y, // input vector
        a.incy, // stride through y
        a.A, // matrix, row-major, size n*lda
        a.lda, // leading dimension (row stride) of A
      );
      const expected = stdlibReference(a);
      assert.deepEqual(got.A, expected.A);
    });
  }
});

// Zero-dimension edge case: n ties A's order and x's/y's lengths together,
// so n=0 is fully vacuous. Guards that A comes back byte-for-byte
// untouched.
test("dsyr2 zero-dimension (regression)", async (t) => {
  await t.test("n=0", async () => {
    const before = randomFloat64Array(4, -1, 1, 9401);
    const A = Float64Array.from(before);
    const got = await dsyr2(
      device,
      "lower",
      0, // n=0
      1.5,
      new Float64Array(0), // x: length n=0
      1,
      new Float64Array(0), // y: length n=0
      1,
      A,
      1,
    );
    assert.deepEqual(got.A, before);
  });
});

// Small hand-picked scenarios loaded from edge-cases-column-major.json.
test("dsyr2 edge cases (column-major)", async (t) => {
  for (const tc of edgeCasesColumnMajor) {
    await t.test(tc.label, async () => {
      const a = {
        uplo: tc.uplo, // which triangle of the symmetric matrix is stored
        n: tc.n, // matrix dimension (n×n)
        alpha: tc.alpha, // scale factor for x*y^T + y*x^T
        x: new Float64Array(tc.x), // input vector
        incx: tc.incx, // stride through x
        y: new Float64Array(tc.y), // input vector
        incy: tc.incy, // stride through y
        A: new Float64Array(tc.A), // matrix, column-major, size n*lda, mutated in place
        lda: tc.lda, // leading dimension (column stride) of A
        layout: tc.layout, // "column-major"
      };
      const got = await dsyr2(
        device, // GPU device
        a.uplo, // which triangle of the symmetric matrix is stored
        a.n, // matrix dimension (n×n)
        a.alpha, // scale factor for x*y^T + y*x^T
        a.x, // input vector
        a.incx, // stride through x
        a.y, // input vector
        a.incy, // stride through y
        a.A, // matrix, column-major, size n*lda
        a.lda, // leading dimension (column stride) of A
        a.layout, // storage layout
      );
      const expected = stdlibReference(a);
      assert.deepEqual(got.A, expected.A);
    });
  }
});
