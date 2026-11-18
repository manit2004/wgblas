import {
  edge_cases_column_major_default,
  edge_cases_default,
  forwardFactor,
} from "./chunk-BQKXD52D.mjs";
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
import { dgemmtrReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures, runValidation } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, dgemmtr, init } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import { randomFloat64Array } from "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/dgemmtr/src/test.dgemmtr.js
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
  uplo: loadParam("uplo"),
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
test("dgemmtr validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) =>
      dgemmtr(
        a.device,
        a.uplo,
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
test("dgemmtr fixtures", async (t) => {
  await runFixtures(
    t,
    "dgemmtr",
    device,
    NUM_RUNS,
    THRESHOLD,
    fixtureSpecs,
    async (dev, a) =>
      dgemmtr(
        dev,
        a.uplo,
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
    dgemmtrReference,
    forwardFactor,
  );
});
test("dgemmtr edge cases", async (t) => {
  for (const tc of edge_cases_default) {
    await t.test(tc.label, async () => {
      const a = {
        uplo: tc.uplo,
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
      const got = await dgemmtr(
        device,
        a.uplo,
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
      const expected = dgemmtrReference(a);
      assert_default.deepEqual(got.C, expected.C);
    });
  }
});
test("dgemmtr large-n path (regression)", async (t) => {
  const M = 400,
    N = 400,
    K = 8;
  for (const uplo of ["lower", "upper"]) {
    for (const transA of ["no-transpose", "transpose"]) {
      for (const transB of ["no-transpose", "transpose"]) {
        await t.test(
          `uplo=${uplo}, transA=${transA}, transB=${transB}`,
          async () => {
            const [aRows, aCols] = transA === "no-transpose" ? [M, K] : [K, M];
            const lda = aCols;
            const [bRows, bCols] = transB === "no-transpose" ? [K, N] : [N, K];
            const ldb = bCols;
            const a = {
              uplo,
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
            const got = await dgemmtr(
              device,
              a.uplo,
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
            const expected = dgemmtrReference(a);
            const factor = forwardFactor(got, expected, a);
            assert_default.ok(
              factor <= THRESHOLD,
              `uplo=${uplo}, transA=${transA}, transB=${transB}: forward factor ${factor} > ${THRESHOLD}`,
            );
          },
        );
      }
    }
  }
});
test("dgemmtr small-tile skipping and non-square C (regression)", async (t) => {
  const K = 9;
  for (const layout of ["row-major", "column-major"])
    for (const [M, N] of [
      [100, 100],
      [150, 70],
      [70, 150],
    ])
      for (const uplo of ["lower", "upper"])
        for (const transA of ["no-transpose", "transpose"])
          for (const transB of ["no-transpose", "transpose"]) {
            const label = `${layout} ${M}x${N} uplo=${uplo} transA=${transA} transB=${transB}`;
            await t.test(label, async () => {
              const cm = layout === "column-major";
              const [aR, aC] = transA === "no-transpose" ? [M, K] : [K, M];
              const [bR, bC] = transB === "no-transpose" ? [K, N] : [N, K];
              const a = {
                layout,
                uplo,
                transA,
                transB,
                m: M,
                n: N,
                k: K,
                alpha: 1.5,
                A: randomFloat64Array(aR * aC, -1, 1, 51),
                lda: cm ? aR : aC,
                B: randomFloat64Array(bR * bC, -1, 1, 52),
                ldb: cm ? bR : bC,
                beta: 0.5,
                C: randomFloat64Array(M * N, -1, 1, 53),
                ldc: cm ? M : N,
              };
              const got = await dgemmtr(
                device,
                a.uplo,
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
              const factor = forwardFactor(got, dgemmtrReference(a), a);
              assert_default.ok(
                factor <= THRESHOLD,
                `forward factor ${factor} > ${THRESHOLD}`,
              );
              for (let i = 0; i < M; i++)
                for (let j = 0; j < N; j++) {
                  const inTri = uplo === "lower" ? j <= i : j >= i;
                  if (inTri) continue;
                  const idx = cm ? j * a.ldc + i : i * a.ldc + j;
                  assert_default.equal(
                    got.C[idx],
                    a.C[idx],
                    `C(${i},${j}) outside the triangle changed`,
                  );
                }
            });
          }
});
test("dgemmtr zero-dimension (k=0) (regression)", async (t) => {
  const M = 4,
    N = 4,
    K = 0;
  for (const uplo of ["lower", "upper"]) {
    await t.test(`uplo=${uplo}`, async () => {
      const a = {
        uplo,
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
        C: randomFloat64Array(M * N, -5, 5, uplo === "lower" ? 300 : 301),
        ldc: N,
      };
      const got = await dgemmtr(
        device,
        a.uplo,
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
      const factor = forwardFactor(got, dgemmtrReference(a), a);
      assert_default.ok(
        factor <= THRESHOLD,
        `forward factor ${factor} > ${THRESHOLD}`,
      );
      for (let row = 0; row < M; row++)
        for (let col = 0; col < N; col++) {
          const inTriangle = uplo === "lower" ? col <= row : col >= row;
          if (inTriangle) continue;
          const i = row * N + col;
          assert_default.equal(got.C[i], a.C[i], `row=${row}, col=${col}`);
        }
    });
  }
});
test("dgemmtr edge cases (column-major)", async (t) => {
  for (const tc of edge_cases_column_major_default) {
    await t.test(tc.label, async () => {
      const a = {
        layout: tc.layout,
        uplo: tc.uplo,
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
      const got = await dgemmtr(
        device,
        a.uplo,
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
      const expected = dgemmtrReference(a);
      assert_default.deepEqual(got.C, expected.C);
    });
  }
});
test("dgemmtr exactness (regression)", async (t) => {
  const full = fullPrecisionFrom(1040);
  const n = 7;
  for (const [label, alpha, k] of [
    ["alpha=0", 0, 3],
    ["k=0", 1.5, 0],
  ])
    await t.test(`${label}, beta=1 returns C untouched`, async () => {
      const A = k === 0 ? new Float64Array(n) : full(n * k);
      const B = k === 0 ? new Float64Array(1) : full(k * n);
      const C = full(n * n);
      const want = Float64Array.from(C);
      const got = await dgemmtr(
        device,
        "upper",
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
  for (const uplo of ["lower", "upper"])
    await t.test(`the unreferenced triangle (${uplo})`, async () => {
      const C = full(n * n);
      const got = await dgemmtr(
        device,
        uplo,
        "no-transpose",
        "transpose",
        n,
        n,
        3,
        1.5,
        full(n * 3),
        3,
        full(n * 3),
        3,
        0.5,
        C,
        n,
      );
      assertBitIdentical(got.C, C, offTriangle(n, uplo), "C");
    });
});
test("dgemmtr IEEE special values (regression)", async () => {
  for (const uplo of ["lower", "upper"])
    for (const n of [7, 150]) {
      const a = {
        uplo,
        transA: "no-transpose",
        transB: "no-transpose",
        m: n,
        n,
        k: n,
        alpha: 1.5,
        A: withValues(values(n * n, 1), { [at(n, 4, 2)]: Infinity }),
        lda: n,
        B: withValues(values(n * n, 2), { [at(n, 3, 1)]: NaN }),
        ldb: n,
        beta: 0,
        C: withValues(values(n * n, 3), {
          [at(n, 2, 2)]: NaN,
          [at(n, 0, n - 1)]: NaN,
          [at(n, n - 1, 0)]: Infinity,
        }),
        ldc: n,
      };
      const got = await dgemmtr(
        device,
        a.uplo,
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
      const C0 = Float64Array.from(a.C);
      for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++)
          if (uplo === "lower" ? j <= i : j >= i) C0[at(n, i, j)] = 0;
      assertIeeeMatch(
        got.C,
        dgemmtrReference({ ...a, C: C0 }).C,
        `${uplo} n=${n} C`,
      );
    }
});
test("dgemmtr f32 exponent range (regression)", async (t) => {
  for (const uplo of ["lower", "upper"])
    for (const n of [7, 150]) {
      await t.test(`${uplo} n=${n}: out-of-range inputs`, async () => {
        const a = {
          uplo,
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
          B: values(n * n, 2),
          ldb: n,
          beta: 0.5,
          C: withValues(values(n * n, 3), {
            [at(n, 0, n - 1)]: 1e300,
            [at(n, n - 1, 0)]: -1e300,
          }),
          ldc: n,
        };
        const got = await dgemmtr(
          device,
          a.uplo,
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
        assertIeeeMatch(
          got.C,
          dgemmtrReference(argsInF32Range(a)).C,
          "C",
          1e-9,
        );
      });
      await t.test(`${uplo} n=${n}: a result past f32's range`, async () => {
        const a = {
          uplo,
          transA: "no-transpose",
          transB: "no-transpose",
          m: n,
          n,
          k: n,
          alpha: 10,
          A: withValues(values(n * n, 1), { [at(n, 3, 3)]: 3e38 }),
          lda: n,
          B: values(n * n, 2),
          ldb: n,
          beta: 0.5,
          C: values(n * n, 3),
          ldc: n,
        };
        const got = await dgemmtr(
          device,
          a.uplo,
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
        assertIeeeMatch(got.C, saturate(dgemmtrReference(a).C), "C", 1e-9);
      });
    }
});
test("dgemmtr alpha = 0 reads neither A nor B (regression)", async (t) => {
  for (const uplo of ["lower", "upper"])
    for (const n of [7, 150])
      for (const beta of [0, 0.5])
        await t.test(`${uplo} n=${n} beta=${beta}`, async () => {
          const a = {
            uplo,
            transA: "no-transpose",
            transB: "no-transpose",
            m: n,
            n,
            k: n,
            alpha: 0,
            A: withValues(randomFloat64Array(n * n, -1, 1, 1), {
              [at(n, 1, 2)]: NaN,
              [at(n, 3, 0)]: -Infinity,
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
          const got = await dgemmtr(
            device,
            a.uplo,
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
          assertIeeeMatch(got.C, dgemmtrReference(a).C, "C", 1e-9);
        });
});
