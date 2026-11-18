import {
  edge_cases_column_major_default,
  edge_cases_default,
  forwardFactor,
} from "./chunk-4V56NBCY.mjs";
import {
  all,
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
import { dgemvReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures, runValidation } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, dgemv, init } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import { randomFloat64Array } from "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/dgemv/src/test.dgemv.js
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
  trans: loadParam("trans"),
  m: loadParam("m"),
  n: {
    ...nSpec,
    edge: nSpec.edge.filter((e) => e.value !== -1),
    invalid: [
      ...nSpec.invalid,
      { value: -1, error: "n must be non-negative", label: "negative" },
    ],
  },
  alpha: loadParam("alpha64"),
  beta: loadParam("beta64"),
  lda: loadParam("lda"),
  A: loadParam("A64"),
  x: loadParam("x64"),
  incx: loadParam("incx"),
  y: loadParam("y64"),
  incy: loadParam("incy"),
  layout: loadParam("layout"),
};
test("dgemv validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) =>
      dgemv(
        a.device,
        a.trans,
        a.m,
        a.n,
        a.alpha,
        a.A,
        a.lda,
        a.x,
        a.incx,
        a.beta,
        a.y,
        a.incy,
        a.layout,
      ),
    { device },
  );
});
var fixtureSpecs = {
  ...validationSpecs,
  m: { ...validationSpecs.m, range: { min: 1, max: 50 } },
  n: { ...validationSpecs.n, range: { min: 1, max: 50 } },
};
test("dgemv fixtures", async (t) => {
  await runFixtures(
    t,
    // node:test context
    "dgemv",
    // routine name — used in failure labels
    device,
    // GPUDevice from before()
    NUM_RUNS,
    // number of fast-check runs
    THRESHOLD,
    // max allowed forward error factor
    fixtureSpecs,
    // param specs used to generate random inputs (m, n capped at 50 for speed)
    async (dev, a) =>
      dgemv(
        dev,
        a.trans,
        a.m,
        a.n,
        a.alpha,
        a.A,
        a.lda,
        a.x,
        a.incx,
        a.beta,
        a.y,
        a.incy,
        a.layout,
      ),
    // GPU impl
    dgemvReference,
    // CPU reference
    forwardFactor,
    // error metric: max |err| / (eps * per-element bound) across output
  );
});
test("dgemv edge cases", async (t) => {
  for (const tc of edge_cases_default) {
    await t.test(tc.label, async () => {
      const a = {
        trans: tc.trans,
        // whether to use A or Aᵀ
        m: tc.m,
        // rows of A
        n: tc.n,
        // columns of A
        alpha: tc.alpha,
        // scale factor for A·x
        A: new Float64Array(tc.A),
        // matrix, row-major, size m*lda
        lda: tc.lda,
        // leading dimension (row stride) of A
        x: new Float64Array(tc.x),
        // input vector
        incx: tc.incx,
        // stride through x
        beta: tc.beta,
        // scale factor applied to existing y before accumulating
        y: new Float64Array(tc.y),
        // input/output vector
        incy: tc.incy,
        // stride through y
      };
      const got = await dgemv(
        device,
        // GPU device
        a.trans,
        // whether to use A or Aᵀ
        a.m,
        // rows of A
        a.n,
        // columns of A
        a.alpha,
        // scale factor for A·x
        a.A,
        // matrix, row-major, size m*lda
        a.lda,
        // leading dimension (row stride) of A
        a.x,
        // input vector
        a.incx,
        // stride through x
        a.beta,
        // scale factor applied to existing y before accumulating
        a.y,
        // input/output vector
        a.incy,
        // stride through y
      );
      const expected = dgemvReference(a);
      assert_default.deepEqual(got.y, expected.y);
    });
  }
});
test("dgemv zero-dimension (regression)", async (t) => {
  await t.test("no-transpose, n=0 (contraction dim zero, m>0)", async () => {
    const yBefore = randomFloat64Array(4, -1, 1, 9001);
    const y = Float64Array.from(yBefore);
    const got = await dgemv(
      device,
      "no-transpose",
      4,
      // m>0
      0,
      // n=0 — contraction dimension for no-transpose
      1.5,
      new Float64Array(0),
      // A: m*0 has no elements
      1,
      new Float64Array(0),
      // x: length n=0
      1,
      0.5,
      // beta != 0, != 1
      y,
      1,
    );
    assert_default.deepEqual(got.y, yBefore);
  });
  await t.test("transpose, m=0 (contraction dim zero, n>0)", async () => {
    const yBefore = randomFloat64Array(4, -1, 1, 9002);
    const y = Float64Array.from(yBefore);
    const got = await dgemv(
      device,
      "transpose",
      0,
      // m=0 — contraction dimension for transpose
      4,
      // n>0
      1.5,
      new Float64Array(0),
      // A: 0*n has no elements
      1,
      new Float64Array(0),
      // x: length m=0
      1,
      0.5,
      // beta != 0, != 1
      y,
      1,
    );
    assert_default.deepEqual(got.y, yBefore);
  });
});
test("dgemv split-K transpose (regression)", async (t) => {
  for (const [trans, layout, K, N, inc, beta] of [
    ["transpose", "row-major", 600, 70, 1, 0.75],
    ["transpose", "row-major", 600, 70, 3, 0.75],
    ["transpose", "row-major", 600, 70, 1, 0],
    ["no-transpose", "column-major", 600, 70, 2, 0.75],
    ["transpose", "row-major", 256, 70, 1, 0.75],
    ["transpose", "row-major", 257, 130, 1, 0.75],
  ]) {
    await t.test(
      `${trans} ${layout} K=${K} N=${N} inc=${inc} beta=${beta}`,
      async () => {
        const isNoTrans = trans === "no-transpose";
        const m = isNoTrans ? N : K;
        const n = isNoTrans ? K : N;
        const lda = (layout === "row-major" ? n : m) + 3;
        const outer = layout === "row-major" ? m : n;
        const y = randomFloat64Array((N - 1) * inc + 1, -1, 1, 307);
        if (beta === 0) for (let i = 0; i < N; i++) y[i * inc] = NaN;
        const a = {
          trans,
          m,
          n,
          alpha: 1.5,
          A: randomFloat64Array(outer * lda, -1, 1, 301),
          lda,
          x: randomFloat64Array((K - 1) * inc + 1, -1, 1, 303),
          incx: inc,
          beta,
          y,
          incy: inc,
          layout,
        };
        const got = await dgemv(
          device,
          a.trans,
          a.m,
          a.n,
          a.alpha,
          a.A,
          a.lda,
          a.x,
          a.incx,
          a.beta,
          a.y,
          a.incy,
          a.layout,
        );
        const aRef = beta === 0 ? { ...a, y: new Float64Array(y.length) } : a;
        const factor = forwardFactor(got, dgemvReference(aRef), aRef);
        assert_default.ok(
          factor <= THRESHOLD,
          `forward factor ${factor} > ${THRESHOLD}`,
        );
        for (let i = 0; i < y.length; i++)
          if (i % inc !== 0)
            assert_default.equal(got.y[i], y[i], `y gap element ${i} changed`);
      },
    );
  }
});
test("dgemv long rows, no-transpose (regression)", async (t) => {
  for (const [n, m, inc, beta] of [
    [600, 70, 1, 0.75],
    [600, 70, 2, 0.75],
    [600, 70, 1, 0],
    [256, 33, 1, 0.75],
    [319, 33, 3, 0.75],
  ]) {
    await t.test(`n=${n} m=${m} inc=${inc} beta=${beta}`, async () => {
      const lda = n + 3;
      const y = randomFloat64Array((m - 1) * inc + 1, -1, 1, 317);
      if (beta === 0) for (let i = 0; i < m; i++) y[i * inc] = NaN;
      const a = {
        trans: "no-transpose",
        m,
        n,
        alpha: 1.5,
        A: randomFloat64Array(m * lda, -1, 1, 311),
        lda,
        x: randomFloat64Array((n - 1) * inc + 1, -1, 1, 313),
        incx: inc,
        beta,
        y,
        incy: inc,
        layout: "row-major",
      };
      const got = await dgemv(
        device,
        a.trans,
        a.m,
        a.n,
        a.alpha,
        a.A,
        a.lda,
        a.x,
        a.incx,
        a.beta,
        a.y,
        a.incy,
        a.layout,
      );
      const aRef = beta === 0 ? { ...a, y: new Float64Array(y.length) } : a;
      const factor = forwardFactor(got, dgemvReference(aRef), aRef);
      assert_default.ok(
        factor <= THRESHOLD,
        `forward factor ${factor} > ${THRESHOLD}`,
      );
      for (let i = 0; i < y.length; i++)
        if (i % inc !== 0)
          assert_default.equal(got.y[i], y[i], `y gap element ${i} changed`);
    });
  }
});
test("dgemv edge cases (column-major)", async (t) => {
  for (const tc of edge_cases_column_major_default) {
    await t.test(tc.label, async () => {
      const a = {
        trans: tc.trans,
        // whether to use A or Aᵀ
        m: tc.m,
        // rows of A
        n: tc.n,
        // columns of A
        alpha: tc.alpha,
        // scale factor for A·x
        A: new Float64Array(tc.A),
        // matrix, column-major, size n*lda
        lda: tc.lda,
        // leading dimension (column stride) of A
        x: new Float64Array(tc.x),
        // input vector
        incx: tc.incx,
        // stride through x
        beta: tc.beta,
        // scale factor applied to existing y before accumulating
        y: new Float64Array(tc.y),
        // input/output vector
        incy: tc.incy,
        // stride through y
        layout: tc.layout,
        // "column-major"
      };
      const got = await dgemv(
        device,
        // GPU device
        a.trans,
        // whether to use A or Aᵀ
        a.m,
        // rows of A
        a.n,
        // columns of A
        a.alpha,
        // scale factor for A·x
        a.A,
        // matrix, column-major, size n*lda
        a.lda,
        // leading dimension (column stride) of A
        a.x,
        // input vector
        a.incx,
        // stride through x
        a.beta,
        // scale factor applied to existing y before accumulating
        a.y,
        // input/output vector
        a.incy,
        // stride through y
        a.layout,
        // storage layout
      );
      const expected = dgemvReference(a);
      assert_default.deepEqual(got.y, expected.y);
    });
  }
});
test("dgemv exactness (regression)", async (t) => {
  const full = fullPrecisionFrom(960);
  const n = 5;
  for (const trans of ["no-transpose", "transpose"])
    await t.test(`alpha=0, beta=1 returns y untouched (${trans})`, async () => {
      const y = full(n);
      const want = Float64Array.from(y);
      const got = await dgemv(
        device,
        trans,
        n,
        n,
        0,
        full(n * n),
        n,
        full(n),
        1,
        1,
        y,
        1,
      );
      assert_default.equal(got.y, y);
      assertBitIdentical(got.y, want, all(n), "y");
    });
  for (const beta of [0, 0.5])
    await t.test(`stride gaps in y (beta=${beta})`, async () => {
      const y = full(13);
      const got = await dgemv(
        device,
        "no-transpose",
        n,
        n,
        1.5,
        full(n * n),
        n,
        full(13),
        3,
        beta,
        y,
        3,
      );
      assertBitIdentical(got.y, y, gaps(n, 3), "y");
    });
});
test("dgemv IEEE special values (regression)", async (t) => {
  for (const trans of ["no-transpose", "transpose"])
    for (const n of [7, 300])
      await t.test(`${trans} n=${n}`, async () => {
        const a = {
          trans,
          m: n,
          n,
          alpha: 1.5,
          A: withValues(values(n * n, 1), {
            [at(n, 1, 2)]: Infinity,
            [at(n, 3, 4)]: NaN,
          }),
          lda: n,
          x: withValues(values(n, 2), { 5: -Infinity }),
          incx: 1,
          beta: 0,
          y: withValues(values(n, 3), { 0: NaN, 6: Infinity }),
          incy: 1,
        };
        const got = await dgemv(
          device,
          a.trans,
          a.m,
          a.n,
          a.alpha,
          a.A,
          a.lda,
          a.x,
          a.incx,
          a.beta,
          a.y,
          a.incy,
        );
        const want = dgemvReference({ ...a, y: new Float64Array(n) });
        assertIeeeMatch(got.y, want.y, "y");
      });
});
test("dgemv f32 exponent range (regression)", async (t) => {
  for (const trans of ["no-transpose", "transpose"])
    for (const n of [7, 300]) {
      await t.test(`${trans} n=${n}: out-of-range inputs`, async () => {
        const a = {
          trans,
          m: n,
          n,
          alpha: 1.5,
          A: withValues(values(n * n, 1), {
            [at(n, 1, 2)]: 1e300,
            [at(n, 3, 4)]: 1e-50,
          }),
          lda: n,
          x: withValues(values(n, 2), { 6: 1e-50 }),
          incx: 1,
          beta: 0.5,
          y: withValues(values(n, 3), { 0: -1e300 }),
          incy: 1,
        };
        const got = await dgemv(
          device,
          a.trans,
          a.m,
          a.n,
          a.alpha,
          a.A,
          a.lda,
          a.x,
          a.incx,
          a.beta,
          a.y,
          a.incy,
        );
        assertIeeeMatch(got.y, dgemvReference(argsInF32Range(a)).y, "y", 1e-9);
      });
      await t.test(`${trans} n=${n}: a result past f32's range`, async () => {
        const a = {
          trans,
          m: n,
          n,
          alpha: 1e10,
          A: values(n * n, 1),
          lda: n,
          x: withValues(values(n, 2), { 5: 1e30 }),
          incx: 1,
          beta: 0.5,
          y: values(n, 3),
          incy: 1,
        };
        const got = await dgemv(
          device,
          a.trans,
          a.m,
          a.n,
          a.alpha,
          a.A,
          a.lda,
          a.x,
          a.incx,
          a.beta,
          a.y,
          a.incy,
        );
        assertIeeeMatch(got.y, saturate(dgemvReference(a).y), "y", 1e-9);
      });
    }
});
test("dgemv alpha = 0 reads neither A nor x (regression)", async (t) => {
  for (const trans of ["no-transpose", "transpose"])
    for (const n of [7, 300])
      for (const beta of [0, 0.5])
        await t.test(`${trans} n=${n} beta=${beta}`, async () => {
          const a = {
            trans,
            m: n,
            n,
            alpha: 0,
            A: withValues(randomFloat64Array(n * n, -1, 1, 1), {
              [at(n, 1, 2)]: NaN,
              [at(n, 3, 4)]: Infinity,
            }),
            lda: n,
            x: withValues(randomFloat64Array(n, -1, 1, 2), { 5: -Infinity }),
            incx: 1,
            beta,
            y: withValues(
              randomFloat64Array(n, -1, 1, 3),
              beta === 0 ? { 0: NaN } : {},
            ),
            incy: 1,
          };
          const got = await dgemv(
            device,
            a.trans,
            a.m,
            a.n,
            a.alpha,
            a.A,
            a.lda,
            a.x,
            a.incx,
            a.beta,
            a.y,
            a.incy,
          );
          assertIeeeMatch(got.y, dgemvReference(a).y, "y", 1e-9);
        });
});
test("dgemv zero x entries skip their column (regression)", async (t) => {
  for (const layout of ["row-major", "column-major"])
    for (const trans of ["no-transpose", "transpose"])
      for (const n of [7, 300])
        await t.test(`${layout} ${trans} n=${n}`, async () => {
          const A = withValues(randomFloat64Array(n * n, -1, 1, 1), {
            [at(n, 1, 2)]: Infinity,
            [at(n, 2, 1)]: -Infinity,
            [at(n, 4, 0)]: NaN,
            [at(n, 0, 4)]: Infinity,
          });
          const x = withValues(randomFloat64Array(n, -1, 1, 2), { 1: 0, 4: 0 });
          const a = {
            trans,
            m: n,
            n,
            alpha: 1.5,
            A,
            lda: n,
            x,
            incx: 1,
            beta: 0.5,
            y: randomFloat64Array(n, -1, 1, 3),
            incy: 1,
            layout,
          };
          const got = await dgemv(
            device,
            a.trans,
            a.m,
            a.n,
            a.alpha,
            a.A,
            a.lda,
            a.x,
            a.incx,
            a.beta,
            a.y,
            a.incy,
            a.layout,
          );
          assertIeeeMatch(got.y, dgemvReference(a).y, "y", 1e-9);
        });
});
