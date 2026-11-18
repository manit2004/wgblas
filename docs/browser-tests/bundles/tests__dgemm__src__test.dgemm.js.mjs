import {
  edge_cases_column_major_default,
  edge_cases_default,
  forwardFactor,
} from "./chunk-4EBF4GYY.mjs";
import {
  all,
  assertBitIdentical,
  fullPrecisionFrom,
  ldPadding,
} from "./chunk-WTAHVNYX.mjs";
import {
  argsInF32Range,
  assertIeeeMatch,
  at,
  saturate,
  values,
  withValues,
} from "./chunk-VGOUGUHQ.mjs";
import { dgemmReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures, runValidation } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, dgemm, init } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import { randomFloat64Array } from "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/dgemm/src/test.dgemm.js
var NUM_RUNS = 100;
var THRESHOLD = 1;
var device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => {
  cleanup();
});
var A64 = loadParam("A64");
var aLevel3 = A64["level-3"];
var aSpec = {
  ...A64,
  dependsOn: aLevel3.dependsOn,
  edge: aLevel3.edge,
  invalid: [
    ...aLevel3.invalid.map((entry) => ({
      ...entry,
      error:
        typeof entry.error === "string"
          ? entry.error.replace("Float32Array", "Float64Array")
          : entry.error,
    })),
    ...A64.invalid.filter((entry) => entry.scenario === "wrongDtypeGpuMatrix"),
  ],
};
var nSpec = loadParam("n");
var ldSpec = loadParam("ld");
var validationSpecs = {
  device: loadParam("device"),
  transA: loadParam("trans"),
  transB: loadParam("trans"),
  layout: loadParam("layout"),
  m: { ...loadParam("m"), baseline: 2 },
  n: {
    ...nSpec,
    baseline: 2,
    edge: nSpec.edge.filter((e) => e.value !== -1),
    invalid: [
      ...nSpec.invalid,
      {
        value: -1,
        error: "m, n, and k must be non-negative",
        label: "negative",
      },
    ],
  },
  k: loadParam("k"),
  alpha: loadParam("alpha"),
  beta: loadParam("beta"),
  A: aSpec,
  lda: ldSpec,
  B: loadParam("B64"),
  ldb: ldSpec,
  C: loadParam("C64"),
  ldc: ldSpec,
};
test("dgemm validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) =>
      dgemm(
        a.device,
        a.transA,
        a.transB,
        a.m,
        a.n,
        a.k,
        a.alpha,
        a.A,
        a.lda,
        a.B,
        a.ldb,
        a.beta,
        a.C,
        a.ldc,
        a.layout,
      ),
    { device },
  );
});
var fixtureSpecs = {
  ...validationSpecs,
  m: { ...validationSpecs.m, range: { min: 1, max: 20 } },
  n: { ...validationSpecs.n, range: { min: 1, max: 20 } },
  k: { ...validationSpecs.k, range: { min: 1, max: 20 } },
};
test("dgemm fixtures", async (t) => {
  await runFixtures(
    t,
    "dgemm",
    device,
    NUM_RUNS,
    THRESHOLD,
    fixtureSpecs,
    async (dev, a) =>
      dgemm(
        dev,
        a.transA,
        a.transB,
        a.m,
        a.n,
        a.k,
        a.alpha,
        a.A,
        a.lda,
        a.B,
        a.ldb,
        a.beta,
        a.C,
        a.ldc,
        a.layout,
      ),
    dgemmReference,
    forwardFactor,
  );
});
test("dgemm edge cases", async (t) => {
  for (const tc of edge_cases_default) {
    await t.test(tc.label, async () => {
      const a = {
        transA: tc.transA,
        transB: tc.transB,
        m: tc.m,
        n: tc.n,
        k: tc.k,
        alpha: tc.alpha,
        A: new Float64Array(tc.A),
        lda: tc.lda,
        B: new Float64Array(tc.B),
        ldb: tc.ldb,
        beta: tc.beta,
        C: new Float64Array(tc.C),
        ldc: tc.ldc,
      };
      const got = await dgemm(
        device,
        a.transA,
        a.transB,
        a.m,
        a.n,
        a.k,
        a.alpha,
        a.A,
        a.lda,
        a.B,
        a.ldb,
        a.beta,
        a.C,
        a.ldc,
      );
      const expected = dgemmReference(a);
      assert_default.deepEqual(got.C, expected.C);
    });
  }
});
test("dgemm large-n path (regression)", async (t) => {
  const M = 400,
    N = 400,
    K = 8;
  for (const transA of ["no-transpose", "transpose"]) {
    for (const transB of ["no-transpose", "transpose"]) {
      await t.test(`transA=${transA}, transB=${transB}`, async () => {
        const [aRows, aCols] = transA === "no-transpose" ? [M, K] : [K, M];
        const lda = aCols;
        const [bRows, bCols] = transB === "no-transpose" ? [K, N] : [N, K];
        const ldb = bCols;
        const a = {
          transA,
          transB,
          m: M,
          n: N,
          k: K,
          alpha: 1.5,
          A: randomFloat64Array(aRows * aCols, -1, 1, 0),
          lda,
          B: randomFloat64Array(bRows * bCols, -1, 1, 100),
          ldb,
          beta: 0.5,
          C: randomFloat64Array(M * N, -1, 1, 200),
          ldc: N,
        };
        const got = await dgemm(
          device,
          a.transA,
          a.transB,
          a.m,
          a.n,
          a.k,
          a.alpha,
          a.A,
          a.lda,
          a.B,
          a.ldb,
          a.beta,
          a.C,
          a.ldc,
        );
        const expected = dgemmReference(a);
        const factor = forwardFactor(got, expected, a);
        assert_default.ok(
          factor <= THRESHOLD,
          `transA=${transA}, transB=${transB}: forward factor ${factor} > ${THRESHOLD}`,
        );
      });
    }
  }
});
test("dgemm zero-dimension (k=0) (regression)", async (t) => {
  await t.test("k=0 collapses to C := beta*C", async () => {
    const M = 4,
      N = 4,
      K = 0;
    const a = {
      transA: "no-transpose",
      transB: "transpose",
      m: M,
      n: N,
      k: K,
      alpha: 1.5,
      A: new Float64Array(3),
      lda: 1,
      B: new Float64Array(3),
      ldb: 1,
      beta: 0.5,
      C: randomFloat64Array(M * N, -5, 5, 300),
      ldc: N,
    };
    const got = await dgemm(
      device,
      a.transA,
      a.transB,
      a.m,
      a.n,
      a.k,
      a.alpha,
      a.A,
      a.lda,
      a.B,
      a.ldb,
      a.beta,
      a.C,
      a.ldc,
    );
    const factor = forwardFactor(got, dgemmReference(a), a);
    assert_default.ok(
      factor <= THRESHOLD,
      `forward factor ${factor} > ${THRESHOLD}`,
    );
  });
});
test("dgemm edge cases (column-major)", async (t) => {
  for (const tc of edge_cases_column_major_default) {
    await t.test(tc.label, async () => {
      const a = {
        layout: tc.layout,
        transA: tc.transA,
        transB: tc.transB,
        m: tc.m,
        n: tc.n,
        k: tc.k,
        alpha: tc.alpha,
        A: new Float64Array(tc.A),
        lda: tc.lda,
        B: new Float64Array(tc.B),
        ldb: tc.ldb,
        beta: tc.beta,
        C: new Float64Array(tc.C),
        ldc: tc.ldc,
      };
      const got = await dgemm(
        device,
        a.transA,
        a.transB,
        a.m,
        a.n,
        a.k,
        a.alpha,
        a.A,
        a.lda,
        a.B,
        a.ldb,
        a.beta,
        a.C,
        a.ldc,
        a.layout,
      );
      const expected = dgemmReference(a);
      assert_default.deepEqual(got.C, expected.C);
    });
  }
});
test("dgemm exactness (regression)", async (t) => {
  const full = fullPrecisionFrom(1030);
  const n = 6;
  for (const [label, alpha, k] of [
    ["alpha=0", 0, n],
    ["k=0", 1.5, 0],
  ])
    await t.test(`${label}, beta=1 returns C untouched`, async () => {
      const A = k === 0 ? new Float64Array(n) : full(n * k);
      const B = k === 0 ? new Float64Array(1) : full(k * n);
      const C = full(n * n);
      const want = Float64Array.from(C);
      const got = await dgemm(
        device,
        "no-transpose",
        "no-transpose",
        n,
        n,
        k,
        alpha,
        A,
        Math.max(k, 1),
        B,
        n,
        1,
        C,
        n,
      );
      assert_default.equal(got.C, C);
      assertBitIdentical(got.C, want, all(n * n), "C");
    });
  await t.test("ldc padding", async () => {
    const [m, k, ldc] = [4, 2, n + 3];
    const C = full(m * ldc);
    const got = await dgemm(
      device,
      "no-transpose",
      "no-transpose",
      m,
      n,
      k,
      1.5,
      full(m * k),
      k,
      full(k * n),
      n,
      0.5,
      C,
      ldc,
    );
    assertBitIdentical(got.C, C, ldPadding(m, n, ldc), "C");
  });
});
test("dgemm IEEE special values (regression)", async () => {
  for (const n of [7, 150]) {
    const a = {
      transA: "no-transpose",
      transB: "no-transpose",
      m: n,
      n,
      k: n,
      alpha: 1.5,
      A: withValues(values(n * n, 1), { [at(n, 1, 2)]: Infinity }),
      lda: n,
      B: withValues(values(n * n, 2), { [at(n, 3, 4)]: NaN }),
      ldb: n,
      beta: 0,
      C: withValues(values(n * n, 3), { 0: NaN, 5: Infinity }),
      ldc: n,
    };
    const got = await dgemm(
      device,
      a.transA,
      a.transB,
      a.m,
      a.n,
      a.k,
      a.alpha,
      a.A,
      a.lda,
      a.B,
      a.ldb,
      a.beta,
      a.C,
      a.ldc,
    );
    const want = dgemmReference({ ...a, C: new Float64Array(n * n) });
    assertIeeeMatch(got.C, want.C, `n=${n} C`);
  }
});
test("dgemm f32 exponent range (regression)", async (t) => {
  for (const n of [7, 150]) {
    await t.test(`n=${n}: out-of-range inputs`, async () => {
      const a = {
        transA: "no-transpose",
        transB: "no-transpose",
        m: n,
        n,
        k: n,
        alpha: 1.5,
        A: withValues(values(n * n, 1), {
          [at(n, 4, 2)]: 1e300,
          [at(n, 5, 5)]: 1e-50,
        }),
        lda: n,
        B: withValues(values(n * n, 2), { [at(n, 5, 1)]: -1e-50 }),
        ldb: n,
        beta: 0.5,
        C: withValues(values(n * n, 3), { [at(n, 6, 6)]: -1e300 }),
        ldc: n,
      };
      const got = await dgemm(
        device,
        a.transA,
        a.transB,
        a.m,
        a.n,
        a.k,
        a.alpha,
        a.A,
        a.lda,
        a.B,
        a.ldb,
        a.beta,
        a.C,
        a.ldc,
      );
      assertIeeeMatch(got.C, dgemmReference(argsInF32Range(a)).C, "C", 1e-9);
    });
    await t.test(`n=${n}: a result past f32's range`, async () => {
      const a = {
        transA: "no-transpose",
        transB: "no-transpose",
        m: n,
        n,
        k: n,
        alpha: 10,
        A: withValues(values(n * n, 1), { [at(n, 3, 3)]: 3e38 }),
        lda: n,
        B: withValues(values(n * n, 2), { [at(n, 5, 1)]: -1e-50 }),
        ldb: n,
        beta: 0.5,
        C: values(n * n, 3),
        ldc: n,
      };
      const got = await dgemm(
        device,
        a.transA,
        a.transB,
        a.m,
        a.n,
        a.k,
        a.alpha,
        a.A,
        a.lda,
        a.B,
        a.ldb,
        a.beta,
        a.C,
        a.ldc,
      );
      assertIeeeMatch(got.C, saturate(dgemmReference(a).C), "C", 1e-9);
    });
  }
});
test("dgemm alpha = 0 reads neither A nor B (regression)", async (t) => {
  for (const n of [7, 150])
    for (const beta of [0, 0.5])
      await t.test(`n=${n} beta=${beta}`, async () => {
        const a = {
          transA: "no-transpose",
          transB: "no-transpose",
          m: n,
          n,
          k: n,
          alpha: 0,
          A: withValues(randomFloat64Array(n * n, -1, 1, 1), {
            [at(n, 1, 2)]: NaN,
          }),
          lda: n,
          B: withValues(randomFloat64Array(n * n, -1, 1, 2), {
            [at(n, 2, 3)]: Infinity,
          }),
          ldb: n,
          beta,
          C: withValues(
            randomFloat64Array(n * n, -1, 1, 3),
            beta === 0 ? { [at(n, 4, 4)]: NaN } : {},
          ),
          ldc: n,
        };
        const got = await dgemm(
          device,
          a.transA,
          a.transB,
          a.m,
          a.n,
          a.k,
          a.alpha,
          a.A,
          a.lda,
          a.B,
          a.ldb,
          a.beta,
          a.C,
          a.ldc,
        );
        assertIeeeMatch(got.C, dgemmReference(a).C, "C", 1e-9);
      });
});
