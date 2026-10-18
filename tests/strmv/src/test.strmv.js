import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, randomFloat32Array } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { strmv } from "wgblas/strmv";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures, makeVec } from "../../helpers/fixtures.js";
import { forwardFactor } from "../helpers.js";
import { strmvReference as stdlibReference } from "../../helpers/stdlib.js";
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
  A: { ...loadParam("A"), dependsOn: ["n", "lda"] },
  lda: loadParam("lda"),
  x: { ...loadParam("x"), dependsOn: ["n", "incx"] },
  incx: loadParam("incx"),
  y: { ...loadParam("y"), dependsOn: ["n", "incy"] },
  incy: loadParam("incy"),
  layout: loadParam("layout"),
};

// Cap n for fixtures — validationSpecs allows up to 1000, which makes property tests slow.
const fixtureSpecs = {
  ...validationSpecs,
  n: { ...validationSpecs.n, range: { min: 1, max: 50 } },
};

test("strmv validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) =>
      strmv(
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

test("strmv fixtures", async (t) => {
  await runFixtures(
    t, // node:test context
    "strmv", // routine name
    device, // GPUDevice
    NUM_RUNS, // number of fast-check runs
    THRESHOLD, // max allowed forward error factor
    fixtureSpecs, // param specs used to generate random inputs (n capped at 50 for speed)
    async (dev, a) =>
      strmv(
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
// loaded from edge-cases.json. Expected output is computed live from stdlib —
test("strmv edge cases", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        uplo: c.uplo, // which triangle of A is stored
        trans: c.trans, // whether to use A or Aᵀ
        diag: c.diag, // unit (diagonal implicitly 1) or non-unit (read from A)
        n: c.n, // matrix dimension (n×n)
        A: new Float32Array(c.A), // matrix, row-major, size n*lda
        lda: c.lda, // leading dimension (row stride) of A
        x: new Float32Array(c.x), // input vector
        incx: c.incx, // stride through x
        y: makeVec(c.n, c.incy), // output vector — only y[i*incy] for i in [0,n) is written
        incy: c.incy, // stride through y
      };
      const { y: got } = await strmv(
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

// Zero-dimension edge case: strmv is out-of-place (result goes into y),
// and n ties A's order and x's/y's lengths together, so n=0 is fully
// vacuous. Guards that y comes back byte-for-byte untouched.
test("strmv zero-dimension (regression)", async (t) => {
  await t.test("n=0", async () => {
    const yBefore = randomFloat32Array(4, -1, 1, 9501);
    const y = Float32Array.from(yBefore);
    const got = await strmv(
      device,
      "lower",
      "no-transpose",
      "non-unit",
      0, // n=0
      new Float32Array(0), // A: 0x0 has no elements
      1,
      new Float32Array(0), // x: length n=0
      1,
      y,
      1,
    );
    assert.deepEqual(got.y, yBefore);
  });
});

// Fixtures cap n at 50 and edge cases are tiny, so neither reaches the
// transpose kernel's multi-chunk path (strmv_t + reduce_partials, n > 256)
// or a partially-filled last column tile. n=600 gives 3 row chunks and a
// 24-wide last tile. Every uplo/trans/diag combo, both layouts, plus
// non-unit strides.
test("strmv large-n paths (regression)", async (t) => {
  const N = 600;
  for (const layout of ["row-major", "column-major"])
    for (const uplo of ["lower", "upper"])
      for (const trans of ["no-transpose", "transpose"])
        for (const diag of ["non-unit", "unit"])
          for (const inc of [1, 3]) {
            await t.test(
              `${layout} ${uplo} ${trans} ${diag} inc=${inc}`,
              async () => {
                const a = {
                  uplo,
                  trans,
                  diag,
                  n: N,
                  A: randomFloat32Array(N * N, -1, 1, 11),
                  lda: N,
                  x: randomFloat32Array((N - 1) * inc + 1, -1, 1, 12),
                  incx: inc,
                  y: makeVec(N, inc),
                  incy: inc,
                  layout,
                };
                const got = await strmv(
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
              },
            );
          }
});

// Small hand-picked scenarios loaded from edge-cases-column-major.json.
test("strmv edge cases (column-major)", async (t) => {
  for (const c of edgeCasesColumnMajor) {
    await t.test(c.label, async () => {
      const a = {
        uplo: c.uplo, // which triangle of A is stored
        trans: c.trans, // whether to use A or Aᵀ
        diag: c.diag, // unit (diagonal implicitly 1) or non-unit (read from A)
        n: c.n, // matrix dimension (n×n)
        A: new Float32Array(c.A), // matrix, column-major, size n*lda
        lda: c.lda, // leading dimension (column stride) of A
        x: new Float32Array(c.x), // input vector
        incx: c.incx, // stride through x
        y: makeVec(c.n, c.incy), // output vector — only y[i*incy] for i in [0,n) is written
        incy: c.incy, // stride through y
        layout: c.layout, // "column-major"
      };
      const { y: got } = await strmv(
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
