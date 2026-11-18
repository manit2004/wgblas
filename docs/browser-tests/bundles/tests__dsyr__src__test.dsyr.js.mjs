import {
  edge_cases_column_major_default,
  edge_cases_default,
  forwardFactor,
} from "./chunk-XCCK7YMU.mjs";
import {
  all,
  assertBitIdentical,
  fullPrecisionFrom,
  offTriangle,
} from "./chunk-WTAHVNYX.mjs";
import {
  argsInF32Range,
  assertIeeeMatch,
  at,
  saturate,
  values,
  withValues,
} from "./chunk-VGOUGUHQ.mjs";
import { dsyrReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures, runValidation } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, dsyr, init } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import { randomFloat64Array } from "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/dsyr/src/test.dsyr.js
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
var fixtureSpecs = {
  ...validationSpecs,
  n: { ...validationSpecs.n, range: { min: 1, max: 50 } },
};
test("dsyr fixtures", async (t) => {
  await runFixtures(
    t,
    // node:test context
    "dsyr",
    // routine name — used in the diagnostic label
    device,
    // WebGPU device instance
    NUM_RUNS,
    // 100 random inputs
    THRESHOLD,
    // forward error factor threshold
    fixtureSpecs,
    // param specs used to generate random inputs (n capped at 50 for speed)
    async (dev, a) =>
      dsyr(dev, a.uplo, a.n, a.alpha, a.x, a.incx, a.A, a.lda, a.layout),
    // GPU call
    dsyrReference,
    // CPU reference
    forwardFactor,
    // |err| / (eps * forward bound) — see helpers.js
  );
});
test("dsyr edge cases", async (t) => {
  for (const tc of edge_cases_default) {
    await t.test(tc.label, async () => {
      const a = {
        uplo: tc.uplo,
        // which triangle of the symmetric matrix is stored
        n: tc.n,
        // matrix dimension (n×n)
        alpha: tc.alpha,
        // scale factor for x*x^T
        x: new Float64Array(tc.x),
        // input vector
        incx: tc.incx,
        // stride through x
        A: new Float64Array(tc.A),
        // matrix, row-major, size n*lda, mutated in place
        lda: tc.lda,
        // leading dimension (row stride) of A
      };
      const got = await dsyr(
        device,
        // GPU device
        a.uplo,
        // which triangle of the symmetric matrix is stored
        a.n,
        // matrix dimension (n×n)
        a.alpha,
        // scale factor for x*x^T
        a.x,
        // input vector
        a.incx,
        // stride through x
        a.A,
        // matrix, row-major, size n*lda
        a.lda,
        // leading dimension (row stride) of A
      );
      const expected = dsyrReference(a);
      assert_default.deepEqual(got.A, expected.A);
    });
  }
});
test("dsyr zero-dimension (regression)", async (t) => {
  await t.test("n=0", async () => {
    const before2 = randomFloat64Array(4, -1, 1, 9301);
    const A = Float64Array.from(before2);
    const got = await dsyr(
      device,
      "lower",
      0,
      // n=0
      1.5,
      new Float64Array(0),
      // x: length n=0
      1,
      A,
      1,
    );
    assert_default.deepEqual(got.A, before2);
  });
});
test("dsyr multi-chunk rows and packed vectors (regression)", async (t) => {
  for (const [N, inc] of [
    [600, 1],
    [600, 3],
    [1100, 8],
  ])
    for (const layout of ["row-major", "column-major"])
      for (const uplo of ["lower", "upper"]) {
        await t.test(`${layout} ${uplo} n=${N} inc=${inc}`, async () => {
          const lda = N + 3;
          const a = {
            uplo,
            n: N,
            alpha: 1.5,
            x: randomFloat64Array((N - 1) * inc + 1, -1, 1, 211),
            incx: inc,
            A: randomFloat64Array(N * lda, -1, 1, 213),
            lda,
            layout,
          };
          const got = await dsyr(
            device,
            a.uplo,
            a.n,
            a.alpha,
            a.x,
            a.incx,
            a.A,
            a.lda,
            a.layout,
          );
          const factor = forwardFactor(got, dsyrReference(a), a);
          assert_default.ok(
            factor <= THRESHOLD,
            `forward factor ${factor} > ${THRESHOLD}`,
          );
          for (let o = 0; o < N; o++)
            for (let p = N; p < lda; p++)
              assert_default.equal(
                got.A[o * lda + p],
                a.A[o * lda + p],
                `padding element ${o * lda + p} changed`,
              );
        });
      }
});
test("dsyr edge cases (column-major)", async (t) => {
  for (const tc of edge_cases_column_major_default) {
    await t.test(tc.label, async () => {
      const a = {
        uplo: tc.uplo,
        // which triangle of the symmetric matrix is stored
        n: tc.n,
        // matrix dimension (n×n)
        alpha: tc.alpha,
        // scale factor for x*x^T
        x: new Float64Array(tc.x),
        // input vector
        incx: tc.incx,
        // stride through x
        A: new Float64Array(tc.A),
        // matrix, column-major, size n*lda, mutated in place
        lda: tc.lda,
        // leading dimension (column stride) of A
        layout: tc.layout,
        // "column-major"
      };
      const got = await dsyr(
        device,
        // GPU device
        a.uplo,
        // which triangle of the symmetric matrix is stored
        a.n,
        // matrix dimension (n×n)
        a.alpha,
        // scale factor for x*x^T
        a.x,
        // input vector
        a.incx,
        // stride through x
        a.A,
        // matrix, column-major, size n*lda
        a.lda,
        // leading dimension (column stride) of A
        a.layout,
        // storage layout
      );
      const expected = dsyrReference(a);
      assert_default.deepEqual(got.A, expected.A);
    });
  }
});
test("dsyr exactness (regression)", async (t) => {
  const full = fullPrecisionFrom(1010);
  const n = 7;
  await t.test("alpha=0 returns A untouched", async () => {
    const A = full(n * n);
    const want = Float64Array.from(A);
    const got = await dsyr(device, "upper", n, 0, full(n), 1, A, n);
    assert_default.equal(got.A, A);
    assertBitIdentical(got.A, want, all(n * n), "A");
  });
  for (const uplo of ["lower", "upper"])
    await t.test(`the unreferenced triangle (${uplo})`, async () => {
      const A = full(n * n);
      const got = await dsyr(device, uplo, n, 1.5, full(n), 1, A, n);
      assertBitIdentical(got.A, A, offTriangle(n, uplo), "A");
    });
});
test("dsyr IEEE special values (regression)", async () => {
  for (const uplo of ["lower", "upper"])
    for (const n of [7, 300]) {
      const a = {
        uplo,
        n,
        alpha: 1.5,
        x: withValues(values(n, 1), { 2: Infinity, 5: NaN }),
        incx: 1,
        A: values(n * n, 2),
        lda: n,
      };
      const got = await dsyr(
        device,
        a.uplo,
        a.n,
        a.alpha,
        a.x,
        a.incx,
        a.A,
        a.lda,
      );
      assertIeeeMatch(got.A, dsyrReference(a).A, `${uplo} n=${n} A`);
    }
});
test("dsyr f32 exponent range (regression)", async (t) => {
  for (const uplo of ["lower", "upper"])
    for (const n of [7, 300]) {
      await t.test(`${uplo} n=${n}: out-of-range inputs`, async () => {
        const a = {
          uplo,
          n,
          alpha: 1.5,
          x: withValues(values(n, 1), { 2: 1e300 }),
          incx: 1,
          A: withValues(values(n * n, 3), {
            [at(n, 0, n - 1)]: 1e300,
            [at(n, n - 1, 0)]: -1e300,
            [at(n, 5, 5)]: 1e-50,
          }),
          lda: n,
        };
        const got = await dsyr(
          device,
          a.uplo,
          a.n,
          a.alpha,
          a.x,
          a.incx,
          a.A,
          a.lda,
        );
        assertIeeeMatch(got.A, dsyrReference(argsInF32Range(a)).A, "A", 1e-9);
      });
      await t.test(`${uplo} n=${n}: a result past f32's range`, async () => {
        const a = {
          uplo,
          n,
          alpha: 1e10,
          x: withValues(values(n, 1), { 2: 1e15 }),
          incx: 1,
          A: values(n * n, 3),
          lda: n,
        };
        const got = await dsyr(
          device,
          a.uplo,
          a.n,
          a.alpha,
          a.x,
          a.incx,
          a.A,
          a.lda,
        );
        assertIeeeMatch(got.A, saturate(dsyrReference(a).A), "A", 1e-9);
      });
    }
});
test("dsyr zero vector entries skip their row (regression)", async (t) => {
  for (const layout of ["row-major", "column-major"])
    for (const uplo of ["lower", "upper"])
      for (const n of [7, 300])
        await t.test(`${layout} ${uplo} n=${n}`, async () => {
          const inc = 2;
          const len = (n - 1) * inc + 1;
          const x = randomFloat64Array(len, -1, 1, 1);
          const y = randomFloat64Array(len, -1, 1, 2);
          for (const i of [0, 3, 5]) x[i * inc] = 0;
          for (const i of [1, 3, 6]) y[i * inc] = 0;
          x[1 * inc] = Infinity;
          x[6 * inc] = -Infinity;
          y[5 * inc] = NaN;
          const A = randomFloat64Array(n * n, -1, 1, 3);
          const got = await dsyr(
            device,
            uplo,
            n,
            1.5,
            x,
            inc,
            A.slice(),
            n,
            layout,
          );
          assertIeeeMatch(
            got.A,
            dsyrReference({
              uplo,
              n,
              alpha: 1.5,
              x,
              incx: inc,
              A,
              lda: n,
              layout,
            }).A,
            "A",
            1e-12,
          );
        });
});
