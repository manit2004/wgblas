import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, randomFloat64Array } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { dtrmv } from "wgblas/dtrmv";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures, makeVec } from "../../helpers/fixtures.js";
import { forwardFactor } from "../helpers.js";
import { dtrmvReference as stdlibReference } from "../../helpers/stdlib.js";
import edgeCases from "../edge-cases.json" with { type: "json" };
import edgeCasesColumnMajor from "../edge-cases-column-major.json" with { type: "json" };

const NUM_RUNS = 100;
// Forward-error cap, pinned to the high-performance/NVIDIA-calibrated bound
// (see tests/dger/src/test.dger.js) — dtrmv does the same full DD tree
// reduction per row as dsymv/dgemv (over a triangular range), so like the
// other arithmetic f64 routines this is not expected to clear on the
// low-power/Intel backend.
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

test("dtrmv validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) =>
      dtrmv(
        a.device,
        a.uplo,
        a.trans,
        a.diag,
        a.n,
        a.A,
        a.lda,
        a.x,
        a.incx,
        a.y,
        a.incy,
        a.layout,
      ),
    { device },
  );
});

test("dtrmv fixtures", async (t) => {
  await runFixtures(
    t, // node:test context
    "dtrmv", // routine name
    device, // GPUDevice
    NUM_RUNS, // number of fast-check runs
    THRESHOLD, // max allowed forward error factor
    fixtureSpecs, // param specs used to generate random inputs (n capped at 50 for speed)
    async (dev, a) =>
      dtrmv(
        dev,
        a.uplo,
        a.trans,
        a.diag,
        a.n,
        a.A,
        a.lda,
        a.x,
        a.incx,
        a.y,
        a.incy,
        a.layout,
      ), // GPU impl
    stdlibReference, // CPU reference — stdlib solves in place on x, remapped into wgblas's y shape
    forwardFactor, // error metric: max |err| / (eps * per-element bound) across output
  );
});

// Small hand-picked scenarios (transpose x uplo x diag combos, non-unit strides)
// loaded from edge-cases.json. Expected output is computed live from stdlib.
test("dtrmv edge cases", async (t) => {
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
      const { y: got } = await dtrmv(
        device, // GPU device
        a.uplo, // which triangle of A is stored
        a.trans, // whether to use A or Aᵀ
        a.diag, // unit (diagonal implicitly 1) or non-unit (read from A)
        a.n, // matrix dimension (n×n)
        a.A, // matrix, row-major, size n*lda
        a.lda, // leading dimension (row stride) of A
        a.x, // input vector
        a.incx, // stride through x
        a.y, // output vector
        a.incy, // stride through y
      ); // GPU result
      const { y: expected } = stdlibReference(a); // stdlib result
      assert.deepEqual(got, expected);
    });
  }
});

// Zero-dimension edge case: dtrmv is out-of-place (result goes into y),
// and n ties A's order and x's/y's lengths together, so n=0 is fully
// vacuous. Guards that y comes back byte-for-byte untouched.
test("dtrmv zero-dimension (regression)", async (t) => {
  await t.test("n=0", async () => {
    const yBefore = randomFloat64Array(4, -1, 1, 9501);
    const y = Float64Array.from(yBefore);
    const got = await dtrmv(
      device,
      "lower",
      "no-transpose",
      "non-unit",
      0, // n=0
      new Float64Array(0), // A: 0x0 has no elements
      1,
      new Float64Array(0), // x: length n=0
      1,
      y,
      1,
    );
    assert.deepEqual(got.y, yBefore);
  });
});

// Fixtures stay below COLUMN_KERNEL_MIN_N (512) and worthPackingDD's
// threshold, so the column kernel's split-K path (row-major transpose,
// column-major no-transpose) and packed x never run there. n=600 gives ten
// SPLITK_CHUNK_ROWS_DD (64) chunks with a remainder-only last one, n=577 a
// one-row last chunk; n=1100 at stride 8 packs x first (both kernels). A is random off
// the stored triangle too, so reading outside it would show.
test("dtrmv split-K and packed x (regression)", async (t) => {
  for (const [N, inc] of [
    [600, 1],
    [600, 3],
    [577, 1],
    [1100, 8],
  ])
    for (const layout of ["row-major", "column-major"])
      for (const trans of ["no-transpose", "transpose"])
        for (const uplo of ["lower", "upper"]) {
          const diag = (N + inc) % 2 === 0 ? "non-unit" : "unit";
          await t.test(
            `${layout} ${trans} ${uplo} ${diag} n=${N} inc=${inc}`,
            async () => {
              const lda = N + 3;
              const a = {
                uplo,
                trans,
                diag,
                n: N,
                A: randomFloat64Array(N * lda, -1, 1, 401),
                lda,
                x: randomFloat64Array((N - 1) * inc + 1, -1, 1, 403),
                incx: inc,
                y: makeVec(N, inc, 99, Float64Array),
                incy: inc,
                layout,
              };
              const got = await dtrmv(
                device,
                a.uplo,
                a.trans,
                a.diag,
                a.n,
                a.A,
                a.lda,
                a.x,
                a.incx,
                a.y,
                a.incy,
                a.layout,
              );
              const factor = forwardFactor(got, stdlibReference(a), a);
              assert.ok(
                factor <= THRESHOLD,
                `forward factor ${factor} > ${THRESHOLD}`,
              );
              for (let i = 0; i < a.y.length; i++)
                if (i % inc !== 0)
                  assert.equal(got.y[i], a.y[i], `y gap element ${i} changed`);
            },
          );
        }
});

// Small hand-picked scenarios loaded from edge-cases-column-major.json.
test("dtrmv edge cases (column-major)", async (t) => {
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
      const { y: got } = await dtrmv(
        device, // GPU device
        a.uplo, // which triangle of A is stored
        a.trans, // whether to use A or Aᵀ
        a.diag, // unit (diagonal implicitly 1) or non-unit (read from A)
        a.n, // matrix dimension (n×n)
        a.A, // matrix, column-major, size n*lda
        a.lda, // leading dimension (column stride) of A
        a.x, // input vector
        a.incx, // stride through x
        a.y, // output vector
        a.incy, // stride through y
        a.layout, // storage layout
      ); // GPU result
      const { y: expected } = stdlibReference(a); // stdlib result
      assert.deepEqual(got, expected);
    });
  }
});
