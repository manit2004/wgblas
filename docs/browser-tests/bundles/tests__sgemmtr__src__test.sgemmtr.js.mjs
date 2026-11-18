import {
  edge_cases_column_major_default,
  edge_cases_default,
  forwardFactor,
} from "./chunk-2YSEKUC6.mjs";
import { assertIeeeMatch, at, withValues } from "./chunk-VGOUGUHQ.mjs";
import { sgemmtrReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures, runValidation } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, init, sgemmtr } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import { randomFloat32Array } from "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/sgemmtr/src/test.sgemmtr.js
var NUM_RUNS = 100;
var THRESHOLD = 1;
var device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => {
  cleanup();
});
var nSpec = loadParam("n");
var aSpec = loadParam("A");
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
  A: { ...aSpec, ...aSpec["level-3"] },
  lda: ldSpec,
  B: loadParam("B"),
  ldb: ldSpec,
  C: loadParam("C"),
  ldc: ldSpec,
};
test("sgemmtr validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) =>
      sgemmtr(
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
test("sgemmtr fixtures", async (t) => {
  await runFixtures(
    t,
    "sgemmtr",
    device,
    NUM_RUNS,
    THRESHOLD,
    fixtureSpecs,
    async (dev, a) =>
      sgemmtr(
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
    sgemmtrReference,
    forwardFactor,
  );
});
test("sgemmtr edge cases", async (t) => {
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
        A: new Float32Array(tc.A),
        lda: tc.lda,
        B: new Float32Array(tc.B),
        ldb: tc.ldb,
        beta: tc.beta,
        C: new Float32Array(tc.C),
        ldc: tc.ldc,
      };
      const got = await sgemmtr(
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
      const expected = sgemmtrReference(a);
      assert_default.deepEqual(got.C, expected.C);
    });
  }
});
test("sgemmtr large-tile path (regression)", async (t) => {
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
              A: randomFloat32Array(aRows * aCols, -1, 1, 0),
              lda,
              B: randomFloat32Array(bRows * bCols, -1, 1, 100),
              ldb,
              beta: 0.5,
              C: randomFloat32Array(M * N, -1, 1, 200),
              ldc: N,
            };
            const got = await sgemmtr(
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
            const expected = sgemmtrReference(a);
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
test("sgemmtr small-tile skipping and non-square C (regression)", async (t) => {
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
                A: randomFloat32Array(aR * aC, -1, 1, 51),
                lda: cm ? aR : aC,
                B: randomFloat32Array(bR * bC, -1, 1, 52),
                ldb: cm ? bR : bC,
                beta: 0.5,
                C: randomFloat32Array(M * N, -1, 1, 53),
                ldc: cm ? M : N,
              };
              const got = await sgemmtr(
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
              const factor = forwardFactor(got, sgemmtrReference(a), a);
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
test("sgemmtr zero-dimension (k=0) (regression)", async (t) => {
  const M = 4,
    N = 4,
    K = 0;
  const beta = 0.5;
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
        A: new Float32Array(3),
        lda: 1,
        B: new Float32Array(3),
        ldb: 1,
        beta,
        C: randomFloat32Array(M * N, -5, 5, uplo === "lower" ? 300 : 301),
        ldc: N,
      };
      const cBefore = Float32Array.from(a.C);
      const got = await sgemmtr(
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
      for (let row = 0; row < M; row++) {
        for (let col = 0; col < N; col++) {
          const i = row * N + col;
          const inTriangle = uplo === "lower" ? col <= row : col >= row;
          const expected = inTriangle
            ? Math.fround(beta * cBefore[i])
            : cBefore[i];
          assert_default.equal(got.C[i], expected, `row=${row}, col=${col}`);
        }
      }
    });
  }
});
test("sgemmtr edge cases (column-major)", async (t) => {
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
        A: new Float32Array(tc.A),
        lda: tc.lda,
        B: new Float32Array(tc.B),
        ldb: tc.ldb,
        beta: tc.beta,
        C: new Float32Array(tc.C),
        ldc: tc.ldc,
      };
      const got = await sgemmtr(
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
      const expected = sgemmtrReference(a);
      assert_default.deepEqual(got.C, expected.C);
    });
  }
});
test("sgemmtr alpha = 0 reads neither A nor B (regression)", async (t) => {
  for (const uplo of ["lower", "upper"])
    for (const n of [7, 300])
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
            A: withValues(randomFloat32Array(n * n, -1, 1, 1), {
              [at(n, 1, 2)]: NaN,
              [at(n, 3, 0)]: -Infinity,
            }),
            lda: n,
            B: withValues(randomFloat32Array(n * n, -1, 1, 2), {
              [at(n, 2, 3)]: Infinity,
            }),
            ldb: n,
            beta,
            C: withValues(
              randomFloat32Array(n * n, -1, 1, 3),
              beta === 0 ? { [at(n, 4, 4)]: NaN } : {},
            ),
            ldc: n,
          };
          const got = await sgemmtr(
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
          assertIeeeMatch(got.C, sgemmtrReference(a).C, "C", 1e-4);
        });
});
