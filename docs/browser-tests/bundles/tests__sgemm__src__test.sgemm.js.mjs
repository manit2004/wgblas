import {
  edge_cases_column_major_default,
  edge_cases_default,
  forwardFactor,
} from "./chunk-4DHT3X6Q.mjs";
import { assertIeeeMatch, at, withValues } from "./chunk-VGOUGUHQ.mjs";
import { sgemmReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures, runValidation } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, init, sgemm } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import { randomFloat32Array } from "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/sgemm/src/test.sgemm.js
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
test("sgemm validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) =>
      sgemm(
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
test("sgemm fixtures", async (t) => {
  await runFixtures(
    t,
    "sgemm",
    device,
    NUM_RUNS,
    THRESHOLD,
    fixtureSpecs,
    async (dev, a) =>
      sgemm(
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
    sgemmReference,
    forwardFactor,
  );
});
test("sgemm edge cases", async (t) => {
  for (const tc of edge_cases_default) {
    await t.test(tc.label, async () => {
      const a = {
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
      const got = await sgemm(
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
      const expected = sgemmReference(a);
      assert_default.deepEqual(got.C, expected.C);
    });
  }
});
test("sgemm large-tile path (regression)", async (t) => {
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
          A: randomFloat32Array(aRows * aCols, -1, 1, 0),
          lda,
          B: randomFloat32Array(bRows * bCols, -1, 1, 100),
          ldb,
          beta: 0.5,
          C: randomFloat32Array(M * N, -1, 1, 200),
          ldc: N,
        };
        const got = await sgemm(
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
        const expected = sgemmReference(a);
        const factor = forwardFactor(got, expected, a);
        assert_default.ok(
          factor <= THRESHOLD,
          `transA=${transA}, transB=${transB}: forward factor ${factor} > ${THRESHOLD}`,
        );
      });
    }
  }
});
test("sgemm vec4 transposed-A path, ragged m (regression)", async (t) => {
  const K = 13;
  const up4 = (v) => Math.ceil(v / 4) * 4;
  for (const [M, N] of [
    [150, 70],
    [398, 390],
  ])
    for (const layout of ["row-major", "column-major"])
      for (const transA of ["no-transpose", "transpose"])
        for (const transB of ["no-transpose", "transpose"]) {
          await t.test(`${layout} m=${M} ${transA} ${transB}`, async () => {
            const cm = layout === "column-major";
            const [aR, aC] = transA === "no-transpose" ? [M, K] : [K, M];
            const [bR, bC] = transB === "no-transpose" ? [K, N] : [N, K];
            const lda = up4(cm ? aR : aC);
            const ldb = up4(cm ? bR : bC);
            const ldc = cm ? M : N;
            const a = {
              transA,
              transB,
              m: M,
              n: N,
              k: K,
              alpha: 1.5,
              A: randomFloat32Array((cm ? aC : aR) * lda, -1, 1, 111),
              lda,
              B: randomFloat32Array((cm ? bC : bR) * ldb, -1, 1, 112),
              ldb,
              beta: 0.5,
              C: randomFloat32Array(M * N, -1, 1, 113),
              ldc,
              layout,
            };
            const got = await sgemm(
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
            const factor = forwardFactor(got, sgemmReference(a), a);
            assert_default.ok(
              factor <= THRESHOLD,
              `forward factor ${factor} > ${THRESHOLD}`,
            );
          });
        }
});
test("sgemm zero-dimension (k=0) (regression)", async (t) => {
  await t.test("k=0 collapses to C := beta*C", async () => {
    const M = 4,
      N = 4,
      K = 0;
    const beta = 0.5;
    const a = {
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
      C: randomFloat32Array(M * N, -5, 5, 300),
      ldc: N,
    };
    const cBefore = Float32Array.from(a.C);
    const got = await sgemm(
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
    for (let i = 0; i < cBefore.length; i++) {
      assert_default.equal(
        got.C[i],
        Math.fround(beta * cBefore[i]),
        `element ${i}`,
      );
    }
  });
});
test("sgemm edge cases (column-major)", async (t) => {
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
        A: new Float32Array(tc.A),
        lda: tc.lda,
        B: new Float32Array(tc.B),
        ldb: tc.ldb,
        beta: tc.beta,
        C: new Float32Array(tc.C),
        ldc: tc.ldc,
      };
      const got = await sgemm(
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
      const expected = sgemmReference(a);
      assert_default.deepEqual(got.C, expected.C);
    });
  }
});
test("sgemm alpha = 0 reads neither A nor B (regression)", async (t) => {
  for (const n of [7, 400])
    for (const beta of [0, 0.5])
      await t.test(`n=${n} beta=${beta}`, async () => {
        const a = {
          transA: "no-transpose",
          transB: "no-transpose",
          m: n,
          n,
          k: n,
          alpha: 0,
          A: withValues(randomFloat32Array(n * n, -1, 1, 1), {
            [at(n, 1, 2)]: NaN,
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
        const got = await sgemm(
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
        assertIeeeMatch(got.C, sgemmReference(a).C, "C", 1e-4);
      });
});
