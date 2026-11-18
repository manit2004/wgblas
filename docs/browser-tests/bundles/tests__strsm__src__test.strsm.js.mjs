import {
  backwardResidualFactor,
  edge_cases_column_major_default,
  edge_cases_default,
} from "./chunk-HJJO5K67.mjs";
import { assertIeeeMatch, at } from "./chunk-VGOUGUHQ.mjs";
import { strsmReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures, runValidation } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, init, strsm } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import {
  randomFloat32Array,
  randomTriangularFloat32Array,
} from "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import { BLOCK_SIZE } from "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/strsm/src/test.strsm.js
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
  side: loadParam("side"),
  uplo: loadParam("uplo"),
  transA: loadParam("trans"),
  diag: loadParam("diag"),
  layout: loadParam("layout"),
  m: { ...loadParam("m"), baseline: 2 },
  n: {
    ...nSpec,
    baseline: 2,
    edge: nSpec.edge.filter((e) => e.value !== -1),
    invalid: [
      ...nSpec.invalid,
      { value: -1, error: "must be non-negative", label: "negative" },
    ],
  },
  alpha: loadParam("alpha"),
  // triangular: true keeps the diagonal away from 0, like strsv. Range
  // tightened to [-0.5,0.5]: with diag='unit', entries near ±1 can make a
  // block's explicit inverse grow combinatorially (strsm's own technique).
  A: {
    ...loadParam("A"),
    dependsOn: ["m", "n", "lda", "side"],
    triangular: true,
    range: { elementMin: -0.5, elementMax: 0.5 },
  },
  lda: loadParam("ld"),
  B: { ...loadParam("B"), dependsOn: ["m", "n", "ldb"] },
  ldb: loadParam("ld"),
};
test("strsm validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) =>
      strsm(
        a.device,
        a.side,
        a.uplo,
        a.transA,
        a.diag,
        a.m,
        a.n,
        a.alpha,
        a.A,
        a.lda,
        a.B,
        a.ldb,
        a.layout,
      ),
    { device },
  );
});
var fixtureSpecs = {
  ...validationSpecs,
  m: { ...validationSpecs.m, range: { min: 1, max: 20 } },
  n: { ...validationSpecs.n, range: { min: 1, max: 20 } },
};
test("strsm fixtures", async (t) => {
  await runFixtures(
    t,
    "strsm",
    device,
    NUM_RUNS,
    THRESHOLD,
    fixtureSpecs,
    async (dev, a) =>
      strsm(
        dev,
        a.side,
        a.uplo,
        a.transA,
        a.diag,
        a.m,
        a.n,
        a.alpha,
        a.A,
        a.lda,
        a.B,
        a.ldb,
        a.layout,
      ),
    strsmReference,
    backwardResidualFactor,
  );
});
test("strsm edge cases", async (t) => {
  for (const tc of edge_cases_default) {
    await t.test(tc.label, async () => {
      const a = {
        side: tc.side,
        uplo: tc.uplo,
        transA: tc.transA,
        diag: tc.diag,
        m: tc.m,
        n: tc.n,
        alpha: tc.alpha,
        A: new Float32Array(tc.A),
        lda: tc.lda,
        B: new Float32Array(tc.B),
        ldb: tc.ldb,
      };
      const got = await strsm(
        device,
        a.side,
        a.uplo,
        a.transA,
        a.diag,
        a.m,
        a.n,
        a.alpha,
        a.A,
        a.lda,
        a.B,
        a.ldb,
      );
      const expected = strsmReference(a);
      const factor = backwardResidualFactor(got, expected, a);
      assert_default.ok(
        factor <= THRESHOLD,
        `backward residual factor ${factor} exceeds threshold ${THRESHOLD}`,
      );
    });
  }
});
test("strsm NaN/Inf semantics", async (t) => {
  await t.test("alpha=0 \u2014 poisoned B becomes a literal zero", async () => {
    const A = new Float32Array([1, 0, 1, 1]);
    const B = new Float32Array([Infinity, NaN, 3, 4]);
    const got = await strsm(
      device,
      "left",
      "lower",
      "no-transpose",
      "non-unit",
      2,
      2,
      0,
      A,
      2,
      B,
      2,
    );
    assert_default.deepEqual(got.B, new Float32Array([0, 0, 0, 0]));
  });
});
test("strsm zero-dimension (regression)", async (t) => {
  await t.test("m=0", async () => {
    const a = {
      side: "left",
      uplo: "lower",
      transA: "no-transpose",
      diag: "non-unit",
      m: 0,
      n: 4,
      alpha: 1.5,
      A: new Float32Array(0),
      lda: 1,
      B: randomFloat32Array(16, -5, 5, 300),
      ldb: 4,
    };
    const bBefore = Float32Array.from(a.B);
    const got = await strsm(
      device,
      a.side,
      a.uplo,
      a.transA,
      a.diag,
      a.m,
      a.n,
      a.alpha,
      a.A,
      a.lda,
      a.B,
      a.ldb,
    );
    assert_default.deepEqual(got.B, bBefore);
  });
  await t.test("n=0", async () => {
    const a = {
      side: "left",
      uplo: "lower",
      transA: "no-transpose",
      diag: "non-unit",
      m: 4,
      n: 0,
      alpha: 1.5,
      A: new Float32Array(0),
      lda: 1,
      B: randomFloat32Array(16, -5, 5, 301),
      ldb: 4,
    };
    const bBefore = Float32Array.from(a.B);
    const got = await strsm(
      device,
      a.side,
      a.uplo,
      a.transA,
      a.diag,
      a.m,
      a.n,
      a.alpha,
      a.A,
      a.lda,
      a.B,
      a.ldb,
    );
    assert_default.deepEqual(got.B, bBefore);
  });
});
test("strsm single-block substitution path (regression)", async (t) => {
  for (const [N, OTHER] of [
    [64, 70],
    [37, 7],
    [1, 7],
  ])
    for (const layout of ["row-major", "column-major"])
      for (const side of ["left", "right"])
        for (const uplo of ["lower", "upper"])
          for (const transA of ["no-transpose", "transpose"]) {
            const diag = uplo === "upper" ? "unit" : "non-unit";
            await t.test(
              `${layout} N=${N} ${side} ${uplo} ${transA} ${diag}`,
              async () => {
                const m = side === "left" ? N : OTHER;
                const n = side === "left" ? OTHER : N;
                const cm = layout === "column-major";
                const pad = 3;
                const LD = (cm ? m : n) + pad;
                const OUTER = cm ? n : m;
                const A = randomFloat32Array(N * N, -1 / N, 1 / N, 121);
                for (let i = 0; i < N; i++) A[i * N + i] = 2;
                const a = {
                  side,
                  uplo,
                  transA,
                  diag,
                  m,
                  n,
                  alpha: 1.5,
                  A,
                  lda: N,
                  B: randomFloat32Array(OUTER * LD, -1, 1, 122),
                  ldb: LD,
                  layout,
                };
                const got = await strsm(
                  device,
                  a.side,
                  a.uplo,
                  a.transA,
                  a.diag,
                  a.m,
                  a.n,
                  a.alpha,
                  a.A,
                  a.lda,
                  a.B,
                  a.ldb,
                  a.layout,
                );
                const factor = backwardResidualFactor(got, null, a);
                assert_default.ok(
                  factor <= THRESHOLD,
                  `backward residual factor ${factor} exceeds threshold ${THRESHOLD}`,
                );
                for (let o = 0; o < OUTER; o++)
                  for (let p = LD - pad; p < LD; p++)
                    assert_default.equal(
                      got.B[o * LD + p],
                      a.B[o * LD + p],
                      `padding element ${o * LD + p} changed`,
                    );
              },
            );
          }
});
test("strsm many-block in-place paths (regression)", async (t) => {
  for (const [N, OTHER, pad] of [
    [150, 70, 1],
    [600, 200, 4],
  ])
    for (const layout of ["row-major", "column-major"])
      for (const side of ["left", "right"])
        for (const uplo of ["lower", "upper"])
          for (const transA of ["no-transpose", "transpose"]) {
            const diag = transA === "transpose" ? "unit" : "non-unit";
            await t.test(
              `${layout} N=${N} ${side} ${uplo} ${transA} ${diag}`,
              async () => {
                const m = side === "left" ? N : OTHER;
                const n = side === "left" ? OTHER : N;
                const cm = layout === "column-major";
                const LD = (cm ? m : n) + pad;
                const OUTER = cm ? n : m;
                const A = randomFloat32Array(N * N, -1 / N, 1 / N, 101);
                for (let i = 0; i < N; i++) A[i * N + i] = 2;
                const a = {
                  side,
                  uplo,
                  transA,
                  diag,
                  m,
                  n,
                  alpha: 1.5,
                  A,
                  lda: N,
                  B: randomFloat32Array(OUTER * LD, -1, 1, 102),
                  ldb: LD,
                  layout,
                };
                const got = await strsm(
                  device,
                  a.side,
                  a.uplo,
                  a.transA,
                  a.diag,
                  a.m,
                  a.n,
                  a.alpha,
                  a.A,
                  a.lda,
                  a.B,
                  a.ldb,
                  a.layout,
                );
                const factor = backwardResidualFactor(got, null, a);
                assert_default.ok(
                  factor <= THRESHOLD,
                  `backward residual factor ${factor} exceeds threshold ${THRESHOLD}`,
                );
                for (let o = 0; o < OUTER; o++)
                  for (let p = LD - pad; p < LD; p++)
                    assert_default.equal(
                      got.B[o * LD + p],
                      a.B[o * LD + p],
                      `padding element ${o * LD + p} changed`,
                    );
              },
            );
          }
});
test("strsm edge cases (column-major)", async (t) => {
  for (const tc of edge_cases_column_major_default) {
    await t.test(tc.label, async () => {
      const a = {
        layout: tc.layout,
        side: tc.side,
        uplo: tc.uplo,
        transA: tc.transA,
        diag: tc.diag,
        m: tc.m,
        n: tc.n,
        alpha: tc.alpha,
        A: new Float32Array(tc.A),
        lda: tc.lda,
        B: new Float32Array(tc.B),
        ldb: tc.ldb,
      };
      const got = await strsm(
        device,
        a.side,
        a.uplo,
        a.transA,
        a.diag,
        a.m,
        a.n,
        a.alpha,
        a.A,
        a.lda,
        a.B,
        a.ldb,
        a.layout,
      );
      const expected = strsmReference(a);
      const factor = backwardResidualFactor(got, expected, a);
      assert_default.ok(
        factor <= THRESHOLD,
        `backward residual factor ${factor} exceeds threshold ${THRESHOLD}`,
      );
    });
  }
});
test("strsm exercises more than one block (aOrder > BLOCK_SIZE)", async (t) => {
  const aOrder = BLOCK_SIZE + 6;
  const otherLen = 5;
  for (const [side, uplo] of [
    ["left", "lower"],
    ["left", "upper"],
    ["right", "lower"],
  ]) {
    await t.test(`side='${side}', uplo='${uplo}'`, async () => {
      const m = side === "left" ? aOrder : otherLen;
      const n = side === "left" ? otherLen : aOrder;
      const A = randomTriangularFloat32Array(aOrder, aOrder, uplo, -0.5, 0.5);
      const B = randomFloat32Array(m * n, -1, 1);
      const a = {
        side,
        uplo,
        transA: "no-transpose",
        diag: "non-unit",
        m,
        n,
        alpha: 1,
        A,
        lda: aOrder,
        B,
        ldb: n,
      };
      const got = await strsm(
        device,
        a.side,
        a.uplo,
        a.transA,
        a.diag,
        a.m,
        a.n,
        a.alpha,
        a.A,
        a.lda,
        a.B,
        a.ldb,
      );
      const factor = backwardResidualFactor(got, null, a);
      assert_default.ok(
        factor <= THRESHOLD,
        `backward residual factor ${factor} exceeds threshold ${THRESHOLD}`,
      );
    });
  }
});
test("strsm IEEE special values (regression)", async (t) => {
  const n = 5;
  for (const uplo of ["lower", "upper"])
    for (const transA of ["no-transpose", "transpose"])
      for (const m of [7, 600])
        for (const [label, setup] of [
          ["Infinity early in B", (A, B) => (B[at(n, 1, 2)] = Infinity)],
          [
            "Infinity mid-B",
            (A, B) => (B[at(n, Math.floor(m / 2), 0)] = Infinity),
          ],
          ["Infinity late in B", (A, B) => (B[at(n, m - 2, 4)] = -Infinity)],
          [
            "Infinity in A",
            (A) =>
              (A[uplo === "lower" ? at(m, m - 1, 2) : at(m, 2, m - 1)] =
                Infinity),
          ],
        ])
          await t.test(`${uplo} ${transA} m=${m}: ${label}`, async () => {
            const A = randomFloat32Array(m * m, -1, 1, 1);
            for (let i = 0; i < m; i++) A[at(m, i, i)] += m + 4;
            A[uplo === "lower" ? at(m, 1, 4) : at(m, 4, 1)] = NaN;
            const B = randomFloat32Array(m * n, -1, 1, 2);
            setup(A, B);
            const a = {
              side: "left",
              uplo,
              transA,
              diag: "non-unit",
              m,
              n,
              alpha: 1,
              A,
              lda: m,
              B: B.slice(),
              ldb: n,
            };
            const got = await strsm(
              device,
              a.side,
              a.uplo,
              a.transA,
              a.diag,
              a.m,
              a.n,
              a.alpha,
              a.A,
              a.lda,
              B.slice(),
              a.ldb,
            );
            assertIeeeMatch(got.B, strsmReference(a).B, "B", 1e-4);
          });
});
