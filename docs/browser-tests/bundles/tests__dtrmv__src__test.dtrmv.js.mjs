import {
  edge_cases_column_major_default,
  edge_cases_default,
  forwardFactor,
} from "./chunk-6QQ3OM5N.mjs";
import {
  assertBitIdentical,
  fullPrecisionFrom,
  gaps,
} from "./chunk-WTAHVNYX.mjs";
import {
  argsInF32Range,
  assertIeeeMatch,
  at,
  saturate,
  values,
  withValues,
} from "./chunk-VGOUGUHQ.mjs";
import { dtrmvReference } from "./chunk-3I5F4OKA.mjs";
import {
  loadParam,
  makeVec,
  runFixtures,
  runValidation,
} from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, dtrmv, init } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import { randomFloat64Array } from "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/dtrmv/src/test.dtrmv.js
var NUM_RUNS = 100;
var THRESHOLD = 5;
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
  A: { ...loadParam("A64"), dependsOn: ["n", "lda"] },
  lda: loadParam("lda"),
  x: { ...loadParam("x64"), dependsOn: ["n", "incx"] },
  incx: loadParam("incx"),
  y: { ...loadParam("y64"), dependsOn: ["n", "incy"] },
  incy: loadParam("incy"),
  layout: loadParam("layout"),
};
var fixtureSpecs = {
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
    t,
    // node:test context
    "dtrmv",
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
      ),
    // GPU impl
    dtrmvReference,
    // CPU reference — stdlib solves in place on x, remapped into wgblas's y shape
    forwardFactor,
    // error metric: max |err| / (eps * per-element bound) across output
  );
});
test("dtrmv edge cases", async (t) => {
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
        A: new Float64Array(c.A),
        // matrix, row-major, size n*lda
        lda: c.lda,
        // leading dimension (row stride) of A
        x: new Float64Array(c.x),
        // input vector
        incx: c.incx,
        // stride through x
        y: makeVec(c.n, c.incy, 99, Float64Array),
        // output vector — only y[i*incy] for i in [0,n) is written
        incy: c.incy,
        // stride through y
      };
      const { y: got } = await dtrmv(
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
      const { y: expected } = dtrmvReference(a);
      assert_default.deepEqual(got, expected);
    });
  }
});
test("dtrmv zero-dimension (regression)", async (t) => {
  await t.test("n=0", async () => {
    const yBefore = randomFloat64Array(4, -1, 1, 9501);
    const y = Float64Array.from(yBefore);
    const got = await dtrmv(
      device,
      "lower",
      "no-transpose",
      "non-unit",
      0,
      // n=0
      new Float64Array(0),
      // A: 0x0 has no elements
      1,
      new Float64Array(0),
      // x: length n=0
      1,
      y,
      1,
    );
    assert_default.deepEqual(got.y, yBefore);
  });
});
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
              const factor = forwardFactor(got, dtrmvReference(a), a);
              assert_default.ok(
                factor <= THRESHOLD,
                `forward factor ${factor} > ${THRESHOLD}`,
              );
              for (let i = 0; i < a.y.length; i++)
                if (i % inc !== 0)
                  assert_default.equal(
                    got.y[i],
                    a.y[i],
                    `y gap element ${i} changed`,
                  );
            },
          );
        }
});
test("dtrmv edge cases (column-major)", async (t) => {
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
        A: new Float64Array(c.A),
        // matrix, column-major, size n*lda
        lda: c.lda,
        // leading dimension (column stride) of A
        x: new Float64Array(c.x),
        // input vector
        incx: c.incx,
        // stride through x
        y: makeVec(c.n, c.incy, 99, Float64Array),
        // output vector — only y[i*incy] for i in [0,n) is written
        incy: c.incy,
        // stride through y
        layout: c.layout,
        // "column-major"
      };
      const { y: got } = await dtrmv(
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
      const { y: expected } = dtrmvReference(a);
      assert_default.deepEqual(got, expected);
    });
  }
});
test("dtrmv exactness (regression)", async () => {
  const full = fullPrecisionFrom(980);
  const y = full(13);
  const got = await dtrmv(
    device,
    "lower",
    "no-transpose",
    "non-unit",
    5,
    full(25),
    5,
    full(13),
    3,
    y,
    3,
  );
  assertBitIdentical(got.y, y, gaps(5, 3), "y stride gaps");
});
test("dtrmv IEEE special values (regression)", async (t) => {
  for (const uplo of ["lower", "upper"])
    for (const n of [7, 300])
      await t.test(`${uplo} n=${n}`, async () => {
        const [r, c] = uplo === "lower" ? [4, 1] : [1, 4];
        const a = {
          uplo,
          trans: "no-transpose",
          diag: "non-unit",
          n,
          A: withValues(values(n * n, 1), {
            [at(n, r, c)]: Infinity,
            [at(n, c, r)]: NaN,
          }),
          lda: n,
          x: values(n, 2),
          incx: 1,
          y: values(n, 3),
          incy: 1,
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
        );
        assertIeeeMatch(got.y, dtrmvReference(a).y, "y");
      });
});
test("dtrmv f32 exponent range (regression)", async (t) => {
  for (const uplo of ["lower", "upper"])
    for (const n of [7, 300])
      await t.test(`${uplo} n=${n}`, async () => {
        const [r, c] = uplo === "lower" ? [4, 1] : [1, 4];
        const a = {
          uplo,
          trans: "no-transpose",
          diag: "non-unit",
          n,
          A: withValues(values(n * n, 1), {
            [at(n, r, c)]: 1e300,
            [at(n, c, r)]: -1e300,
            [at(n, 5, 5)]: 1e-50,
          }),
          lda: n,
          x: values(n, 2),
          incx: 1,
          y: values(n, 3),
          incy: 1,
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
        );
        assertIeeeMatch(
          got.y,
          saturate(dtrmvReference(argsInF32Range(a)).y),
          "y",
        );
      });
});
test("dtrmv zero x entries skip their column (regression)", async (t) => {
  for (const layout of ["row-major", "column-major"])
    for (const uplo of ["lower", "upper"])
      for (const trans of ["no-transpose", "transpose"])
        for (const n of [7, 300])
          await t.test(`${layout} ${uplo} ${trans} n=${n}`, async () => {
            const A = randomFloat64Array(n * n, -1, 1, 1);
            for (const [i, j] of [
              [3, 1],
              [1, 3],
              [n - 1, 0],
              [0, n - 1],
            ])
              A[at(n, i, j)] = Infinity;
            A[at(n, 1, 1)] = NaN;
            const x = withValues(randomFloat64Array(n, -1, 1, 2), {
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
              y: randomFloat64Array(n, -1, 1, 3),
              incy: 1,
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
            assertIeeeMatch(got.y, dtrmvReference(a).y, "y", 1e-9);
          });
});
