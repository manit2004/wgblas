import {
  edge_cases_column_major_default,
  edge_cases_default,
  forwardFactor,
} from "./chunk-7RN367H6.mjs";
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
import { dsymmReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures, runValidation } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, dsymm, init } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import { randomFloat64Array } from "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/dsymm/src/test.dsymm.js
var NUM_RUNS = 100;
var THRESHOLD = 1;
var device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => {
  cleanup();
});
var run = (dev, a) =>
  dsymm(
    dev,
    a.side,
    a.uplo,
    a.m,
    a.n,
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
var nSpec = loadParam("n");
var validationSpecs = {
  device: loadParam("device"),
  side: loadParam("side"),
  uplo: loadParam("uplo"),
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
  beta: loadParam("beta"),
  A: { ...loadParam("A64"), dependsOn: ["m", "n", "lda", "side"] },
  lda: loadParam("ld"),
  B: { ...loadParam("B64"), dependsOn: ["m", "n", "ldb"] },
  ldb: loadParam("ld"),
  C: loadParam("C64"),
  ldc: loadParam("ld"),
};
test("dsymm validation", async (t) => {
  await runValidation(t, validationSpecs, (a) => run(a.device, a), {
    device,
  });
});
var fixtureSpecs = {
  ...validationSpecs,
  m: { ...validationSpecs.m, range: { min: 1, max: 20 } },
  n: { ...validationSpecs.n, range: { min: 1, max: 20 } },
};
test("dsymm fixtures", async (t) => {
  await runFixtures(
    t,
    "dsymm",
    device,
    NUM_RUNS,
    THRESHOLD,
    fixtureSpecs,
    run,
    dsymmReference,
    forwardFactor,
  );
});
test("dsymm edge cases", async (t) => {
  for (const tc of edge_cases_default) {
    await t.test(tc.label, async () => {
      const a = {
        side: tc.side,
        uplo: tc.uplo,
        m: tc.m,
        n: tc.n,
        alpha: tc.alpha,
        A: new Float64Array(tc.A),
        lda: tc.lda,
        B: new Float64Array(tc.B),
        ldb: tc.ldb,
        beta: tc.beta,
        C: new Float64Array(tc.C),
        ldc: tc.ldc,
      };
      const got = await run(device, a);
      assert_default.deepEqual(got.C, dsymmReference(a).C);
    });
  }
});
test("dsymm zero-dimension (regression)", async (t) => {
  for (const [m, n] of [
    [0, 4],
    [4, 0],
  ])
    await t.test(`m=${m}, n=${n}`, async () => {
      const C = randomFloat64Array(16, -5, 5, 300 + m);
      const cBefore = Float64Array.from(C);
      const got = await run(device, {
        side: "left",
        uplo: "lower",
        m,
        n,
        alpha: 1.5,
        A: new Float64Array(0),
        lda: 1,
        B: new Float64Array(0),
        ldb: 1,
        beta: 0.5,
        C,
        ldc: 4,
      });
      assert_default.equal(got.C, C);
      assertBitIdentical(got.C, cBefore, all(16), "C");
    });
});
test("dsymm multi-tile path (regression)", async (t) => {
  const OTHER = 72;
  for (const [N, pad] of [
    [150, 1],
    [400, 4],
  ])
    for (const layout of ["row-major", "column-major"])
      for (const side of ["left", "right"])
        for (const uplo of ["lower", "upper"]) {
          await t.test(`${layout} N=${N} ${side} ${uplo}`, async () => {
            const m = side === "left" ? N : OTHER;
            const n = side === "left" ? OTHER : N;
            const cm = layout === "column-major";
            const LD = (cm ? m : n) + pad;
            const OUTER = cm ? n : m;
            const a = {
              side,
              uplo,
              m,
              n,
              alpha: 1.5,
              A: randomFloat64Array(N * N, -1, 1, 91),
              lda: N,
              B: randomFloat64Array(OUTER * LD, -1, 1, 92),
              ldb: LD,
              beta: 0.5,
              C: randomFloat64Array(OUTER * LD, -1, 1, 93),
              ldc: LD,
              layout,
            };
            const got = await run(device, a);
            const factor = forwardFactor(got, dsymmReference(a), a);
            assert_default.ok(
              factor <= THRESHOLD,
              `forward factor ${factor} > ${THRESHOLD}`,
            );
            assertBitIdentical(
              got.C,
              a.C,
              ldPadding(OUTER, LD - pad, LD),
              "C padding",
            );
          });
        }
});
test("dsymm edge cases (column-major)", async (t) => {
  for (const tc of edge_cases_column_major_default) {
    await t.test(tc.label, async () => {
      const a = {
        layout: tc.layout,
        side: tc.side,
        uplo: tc.uplo,
        m: tc.m,
        n: tc.n,
        alpha: tc.alpha,
        A: new Float64Array(tc.A),
        lda: tc.lda,
        B: new Float64Array(tc.B),
        ldb: tc.ldb,
        beta: tc.beta,
        C: new Float64Array(tc.C),
        ldc: tc.ldc,
      };
      const got = await run(device, a);
      assert_default.deepEqual(got.C, dsymmReference(a).C);
    });
  }
});
test("dsymm exactness (regression)", async (t) => {
  const full = fullPrecisionFrom(1070);
  const n = 6;
  await t.test("alpha=0, beta=1 returns C untouched", async () => {
    const C = full(n * n);
    const want = Float64Array.from(C);
    const got = await run(device, {
      side: "left",
      uplo: "lower",
      m: n,
      n,
      alpha: 0,
      A: full(n * n),
      lda: n,
      B: full(n * n),
      ldb: n,
      beta: 1,
      C,
      ldc: n,
    });
    assert_default.equal(got.C, C);
    assertBitIdentical(got.C, want, all(n * n), "C");
  });
  for (const side of ["left", "right"])
    await t.test(`ldc padding (${side})`, async () => {
      const [m, ldc] = [4, n + 3];
      const aOrder = side === "left" ? m : n;
      const C = full(m * ldc);
      const got = await run(device, {
        side,
        uplo: "upper",
        m,
        n,
        alpha: 1.5,
        A: full(aOrder * aOrder),
        lda: aOrder,
        B: full(m * n),
        ldb: n,
        beta: 0.5,
        C,
        ldc,
      });
      assertBitIdentical(got.C, C, ldPadding(m, n, ldc), "C");
    });
});
test("dsymm IEEE special values (regression)", async (t) => {
  for (const side of ["left", "right"])
    for (const uplo of ["lower", "upper"])
      for (const n of [7, 150])
        await t.test(`${side} ${uplo} n=${n}`, async () => {
          const stored = uplo === "lower" ? [4, 2] : [2, 4];
          const a = {
            side,
            uplo,
            m: n,
            n,
            alpha: 1.5,
            A: withValues(values(n * n, 1), { [at(n, ...stored)]: Infinity }),
            lda: n,
            B: withValues(values(n * n, 2), { [at(n, 3, 1)]: NaN }),
            ldb: n,
            beta: 0,
            C: withValues(values(n * n, 3), {
              [at(n, 2, 2)]: NaN,
              [at(n, n - 1, 0)]: Infinity,
            }),
            ldc: n,
          };
          const got = await run(device, a);
          const C0 = new Float64Array(n * n);
          assertIeeeMatch(got.C, dsymmReference({ ...a, C: C0 }).C, "C");
        });
  for (const uplo of ["lower", "upper"])
    await t.test(`${uplo}: the unstored triangle is not read`, async () => {
      const n = 7;
      const unstored = uplo === "lower" ? [1, 5] : [5, 1];
      const a = {
        side: "left",
        uplo,
        m: n,
        n,
        alpha: 1.5,
        A: withValues(values(n * n, 4), { [at(n, ...unstored)]: NaN }),
        lda: n,
        B: values(n * n, 5),
        ldb: n,
        beta: 0.5,
        C: values(n * n, 6),
        ldc: n,
      };
      const got = await run(device, a);
      assertIeeeMatch(got.C, dsymmReference(a).C, "C", 1e-12);
      assert_default.ok(got.C.every(Number.isFinite), "NaN leaked into C");
    });
});
test("dsymm f32 exponent range (regression)", async (t) => {
  for (const side of ["left", "right"])
    for (const n of [7, 150]) {
      await t.test(`${side} n=${n}: out-of-range inputs`, async () => {
        const a = {
          side,
          uplo: "lower",
          m: n,
          n,
          alpha: 1.5,
          A: withValues(values(n * n, 1), {
            [at(n, 4, 2)]: 1e300,
            [at(n, 5, 5)]: 1e-50,
          }),
          lda: n,
          B: values(n * n, 2),
          ldb: n,
          beta: 0.5,
          C: withValues(values(n * n, 3), { [at(n, 0, n - 1)]: -1e300 }),
          ldc: n,
        };
        const got = await run(device, a);
        assertIeeeMatch(got.C, dsymmReference(argsInF32Range(a)).C, "C", 1e-9);
      });
      await t.test(`${side} n=${n}: a result past f32's range`, async () => {
        const a = {
          side,
          uplo: "lower",
          m: n,
          n,
          alpha: 10,
          A: withValues(values(n * n, 1), { [at(n, 3, 3)]: 3e38 }),
          lda: n,
          B: values(n * n, 2),
          ldb: n,
          beta: 0.5,
          C: values(n * n, 3),
          ldc: n,
        };
        const got = await run(device, a);
        assertIeeeMatch(got.C, saturate(dsymmReference(a).C), "C", 1e-9);
      });
    }
});
test("dsymm alpha = 0 reads neither A nor B (regression)", async (t) => {
  for (const side of ["left", "right"])
    for (const n of [7, 150])
      for (const beta of [0, 0.5])
        await t.test(`${side} n=${n} beta=${beta}`, async () => {
          const a = {
            side,
            uplo: "lower",
            m: n,
            n,
            alpha: 0,
            A: withValues(randomFloat64Array(n * n, -1, 1, 1), {
              [at(n, 3, 1)]: NaN,
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
          const got = await run(device, a);
          assertIeeeMatch(got.C, dsymmReference(a).C, "C", 1e-9);
        });
});
