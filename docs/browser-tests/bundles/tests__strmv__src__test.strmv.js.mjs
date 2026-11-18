import {
  edge_cases_column_major_default,
  edge_cases_default,
  forwardFactor,
} from "./chunk-TCV5MO5S.mjs";
import { assertIeeeMatch, at, withValues } from "./chunk-VGOUGUHQ.mjs";
import { strmvReference } from "./chunk-3I5F4OKA.mjs";
import {
  loadParam,
  makeVec,
  runFixtures,
  runValidation,
} from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, init, strmv } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import { randomFloat32Array } from "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/strmv/src/test.strmv.js
var NUM_RUNS = 100;
var THRESHOLD = 2;
var device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => {
  cleanup();
});
var nSpec = loadParam("n");
var validationSpecs = {
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
var fixtureSpecs = {
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
    t,
    // node:test context
    "strmv",
    // routine name
    device,
    // GPUDevice
    NUM_RUNS,
    // number of fast-check runs
    THRESHOLD,
    // max allowed forward error factor
    fixtureSpecs,
    // param specs used to generate random inputs (n capped at 50 for speed)
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
      ),
    // GPU impl
    strmvReference,
    // CPU reference — stdlib solves in place on x, remapped into wgblas's y shape
    forwardFactor,
    // error metric: max |err| / (eps * per-element bound) across output
  );
});
test("strmv edge cases", async (t) => {
  for (const c of edge_cases_default) {
    await t.test(c.label, async () => {
      const a = {
        uplo: c.uplo,
        // which triangle of A is stored
        trans: c.trans,
        // whether to use A or Aᵀ
        diag: c.diag,
        // unit (diagonal implicitly 1) or non-unit (read from A)
        n: c.n,
        // matrix dimension (n×n)
        A: new Float32Array(c.A),
        // matrix, row-major, size n*lda
        lda: c.lda,
        // leading dimension (row stride) of A
        x: new Float32Array(c.x),
        // input vector
        incx: c.incx,
        // stride through x
        y: makeVec(c.n, c.incy),
        // output vector — only y[i*incy] for i in [0,n) is written
        incy: c.incy,
        // stride through y
      };
      const { y: got } = await strmv(
        device,
        // GPU device
        a.uplo,
        // which triangle of A is stored
        a.trans,
        // whether to use A or Aᵀ
        a.diag,
        // unit (diagonal implicitly 1) or non-unit (read from A)
        a.n,
        // matrix dimension (n×n)
        a.A,
        // matrix, row-major, size n*lda
        a.lda,
        // leading dimension (row stride) of A
        a.x,
        // input vector
        a.incx,
        // stride through x
        a.y,
        // output vector
        a.incy,
        // stride through y
      );
      const { y: expected } = strmvReference(a);
      assert_default.deepEqual(got, expected);
    });
  }
});
test("strmv zero-dimension (regression)", async (t) => {
  await t.test("n=0", async () => {
    const yBefore = randomFloat32Array(4, -1, 1, 9501);
    const y = Float32Array.from(yBefore);
    const got = await strmv(
      device,
      "lower",
      "no-transpose",
      "non-unit",
      0,
      // n=0
      new Float32Array(0),
      // A: 0x0 has no elements
      1,
      new Float32Array(0),
      // x: length n=0
      1,
      y,
      1,
    );
    assert_default.deepEqual(got.y, yBefore);
  });
});
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
                const factor = forwardFactor(got, strmvReference(a), a);
                assert_default.ok(
                  factor <= THRESHOLD,
                  `forward factor ${factor} > ${THRESHOLD}`,
                );
              },
            );
          }
});
test("strmv edge cases (column-major)", async (t) => {
  for (const c of edge_cases_column_major_default) {
    await t.test(c.label, async () => {
      const a = {
        uplo: c.uplo,
        // which triangle of A is stored
        trans: c.trans,
        // whether to use A or Aᵀ
        diag: c.diag,
        // unit (diagonal implicitly 1) or non-unit (read from A)
        n: c.n,
        // matrix dimension (n×n)
        A: new Float32Array(c.A),
        // matrix, column-major, size n*lda
        lda: c.lda,
        // leading dimension (column stride) of A
        x: new Float32Array(c.x),
        // input vector
        incx: c.incx,
        // stride through x
        y: makeVec(c.n, c.incy),
        // output vector — only y[i*incy] for i in [0,n) is written
        incy: c.incy,
        // stride through y
        layout: c.layout,
        // "column-major"
      };
      const { y: got } = await strmv(
        device,
        // GPU device
        a.uplo,
        // which triangle of A is stored
        a.trans,
        // whether to use A or Aᵀ
        a.diag,
        // unit (diagonal implicitly 1) or non-unit (read from A)
        a.n,
        // matrix dimension (n×n)
        a.A,
        // matrix, column-major, size n*lda
        a.lda,
        // leading dimension (column stride) of A
        a.x,
        // input vector
        a.incx,
        // stride through x
        a.y,
        // output vector
        a.incy,
        // stride through y
        a.layout,
        // storage layout
      );
      const { y: expected } = strmvReference(a);
      assert_default.deepEqual(got, expected);
    });
  }
});
test("strmv zero x entries skip their column (regression)", async (t) => {
  for (const layout of ["row-major", "column-major"])
    for (const uplo of ["lower", "upper"])
      for (const trans of ["no-transpose", "transpose"])
        for (const n of [7, 300])
          await t.test(`${layout} ${uplo} ${trans} n=${n}`, async () => {
            const A = randomFloat32Array(n * n, -1, 1, 1);
            for (const [i, j] of [
              [3, 1],
              [1, 3],
              [n - 1, 0],
              [0, n - 1],
            ])
              A[at(n, i, j)] = Infinity;
            A[at(n, 1, 1)] = NaN;
            const x = withValues(randomFloat32Array(n, -1, 1, 2), {
              1: 0,
              [n - 1]: 0,
            });
            const a = {
              uplo,
              trans,
              diag: "non-unit",
              n,
              A,
              lda: n,
              x,
              incx: 1,
              y: randomFloat32Array(n, -1, 1, 3),
              incy: 1,
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
            assertIeeeMatch(got.y, strmvReference(a).y, "y", 1e-4);
          });
});
