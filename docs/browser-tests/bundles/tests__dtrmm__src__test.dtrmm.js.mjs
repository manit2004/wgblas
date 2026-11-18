import {
  edge_cases_column_major_default,
  edge_cases_default,
  forwardFactor,
} from "./chunk-M7XP3T5N.mjs";
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
import { dtrmmReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures, runValidation } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, dtrmm, init } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import { randomFloat64Array } from "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/dtrmm/src/test.dtrmm.js
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
  dtrmm(
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
  );
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
  A: { ...loadParam("A64"), dependsOn: ["m", "n", "lda", "side"] },
  lda: loadParam("ld"),
  B: { ...loadParam("B64"), dependsOn: ["m", "n", "ldb"] },
  ldb: loadParam("ld"),
};
test("dtrmm validation", async (t) => {
  await runValidation(t, validationSpecs, (a) => run(a.device, a), {
    device,
  });
});
var fixtureSpecs = {
  ...validationSpecs,
  m: { ...validationSpecs.m, range: { min: 1, max: 20 } },
  n: { ...validationSpecs.n, range: { min: 1, max: 20 } },
};
test("dtrmm fixtures", async (t) => {
  await runFixtures(
    t,
    "dtrmm",
    device,
    NUM_RUNS,
    THRESHOLD,
    fixtureSpecs,
    run,
    dtrmmReference,
    forwardFactor,
  );
});
test("dtrmm edge cases", async (t) => {
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
        A: new Float64Array(tc.A),
        lda: tc.lda,
        B: new Float64Array(tc.B),
        ldb: tc.ldb,
      };
      const got = await run(device, a);
      assert_default.deepEqual(got.B, dtrmmReference(a).B);
    });
  }
});
test("dtrmm zero-dimension (regression)", async (t) => {
  for (const [m, n] of [
    [0, 4],
    [4, 0],
  ])
    await t.test(`m=${m}, n=${n}`, async () => {
      const B = randomFloat64Array(16, -5, 5, 300 + m);
      const bBefore = Float64Array.from(B);
      const got = await run(device, {
        side: "left",
        uplo: "lower",
        transA: "no-transpose",
        diag: "non-unit",
        m,
        n,
        alpha: 1.5,
        A: new Float64Array(0),
        lda: 1,
        B,
        ldb: 4,
      });
      assert_default.equal(got.B, B);
      assertBitIdentical(got.B, bBefore, all(16), "B");
    });
});
test("dtrmm multi-tile path (regression)", async (t) => {
  const OTHER = 72;
  for (const [N, pad] of [
    [150, 1],
    [400, 4],
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
                const a = {
                  side,
                  uplo,
                  transA,
                  diag,
                  m,
                  n,
                  alpha: 1.5,
                  A: randomFloat64Array(N * N, -1, 1, 81),
                  lda: N,
                  B: randomFloat64Array(OUTER * LD, -1, 1, 82),
                  ldb: LD,
                  layout,
                };
                const got = await run(device, a);
                const factor = forwardFactor(got, dtrmmReference(a), a);
                assert_default.ok(
                  factor <= THRESHOLD,
                  `forward factor ${factor} > ${THRESHOLD}`,
                );
                assertBitIdentical(
                  got.B,
                  a.B,
                  ldPadding(OUTER, LD - pad, LD),
                  "B padding",
                );
              },
            );
          }
});
test("dtrmm edge cases (column-major)", async (t) => {
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
        A: new Float64Array(tc.A),
        lda: tc.lda,
        B: new Float64Array(tc.B),
        ldb: tc.ldb,
      };
      const got = await run(device, a);
      assert_default.deepEqual(got.B, dtrmmReference(a).B);
    });
  }
});
test("dtrmm exactness (regression)", async (t) => {
  const full = fullPrecisionFrom(1080);
  const n = 6;
  for (const side of ["left", "right"])
    await t.test(`ldb padding (${side})`, async () => {
      const [m, ldb] = [4, n + 3];
      const aOrder = side === "left" ? m : n;
      const B = full(m * ldb);
      const bBefore = Float64Array.from(B);
      const got = await run(device, {
        side,
        uplo: "upper",
        transA: "no-transpose",
        diag: "non-unit",
        m,
        n,
        alpha: 1.5,
        A: full(aOrder * aOrder),
        lda: aOrder,
        B,
        ldb,
      });
      assert_default.notEqual(got.B, B);
      assertBitIdentical(got.B, B, ldPadding(m, n, ldb), "B");
      assertBitIdentical(B, bBefore, all(m * ldb), "input B");
    });
});
test("dtrmm B storage length (regression)", async (t) => {
  const A = new Float64Array([2, 0, 3, 4]);
  const cases = [
    ["minimal storage, no last-stride padding", [1, 2, 99, 3, 4], 3],
    ["trailing elements past the matrix", [1, 2, 3, 4, 7, 8], 2],
  ];
  for (const [label, data, ldb] of cases)
    await t.test(label, async () => {
      const B = new Float64Array(data);
      const a = {
        side: "left",
        uplo: "lower",
        transA: "no-transpose",
        diag: "non-unit",
        m: 2,
        n: 2,
        alpha: 1,
        A,
        lda: 2,
        B,
        ldb,
      };
      const got = await run(device, a);
      assert_default.equal(got.B.length, B.length);
      assert_default.deepEqual(
        got.B,
        dtrmmReference(a).B.subarray(0, B.length),
      );
    });
});
test("dtrmm IEEE special values (regression)", async (t) => {
  for (const side of ["left", "right"])
    for (const uplo of ["lower", "upper"])
      for (const transA of ["no-transpose", "transpose"])
        for (const n of [7, 150])
          await t.test(`${side} ${uplo} ${transA} n=${n}`, async () => {
            const stored = uplo === "lower" ? [4, 2] : [2, 4];
            const storedNaN = uplo === "lower" ? [6, 1] : [1, 6];
            const a = {
              side,
              uplo,
              transA,
              diag: "non-unit",
              m: n,
              n,
              alpha: 1.5,
              A: withValues(values(n * n, 1), {
                [at(n, ...stored)]: Infinity,
                [at(n, ...storedNaN)]: NaN,
              }),
              lda: n,
              B: values(n * n, 2),
              ldb: n,
            };
            const got = await run(device, a);
            assertIeeeMatch(got.B, dtrmmReference(a).B, "B");
          });
  for (const uplo of ["lower", "upper"])
    for (const transA of ["no-transpose", "transpose"])
      await t.test(
        `${uplo} ${transA}: the unstored triangle and unit diagonal are not read`,
        async () => {
          const n = 7;
          const unstored = uplo === "lower" ? [1, 5] : [5, 1];
          const a = {
            side: "left",
            uplo,
            transA,
            diag: "unit",
            m: n,
            n,
            alpha: 1.5,
            A: withValues(values(n * n, 4), {
              [at(n, ...unstored)]: NaN,
              [at(n, 3, 3)]: NaN,
            }),
            lda: n,
            B: values(n * n, 5),
            ldb: n,
          };
          const got = await run(device, a);
          assertIeeeMatch(got.B, dtrmmReference(a).B, "B", 1e-12);
          assert_default.ok(got.B.every(Number.isFinite), "NaN leaked into B");
        },
      );
});
test("dtrmm f32 exponent range (regression)", async (t) => {
  for (const side of ["left", "right"])
    for (const n of [7, 150]) {
      await t.test(`${side} n=${n}: out-of-range inputs`, async () => {
        const a = {
          side,
          uplo: "lower",
          transA: "no-transpose",
          diag: "non-unit",
          m: n,
          n,
          alpha: 1.5,
          A: withValues(values(n * n, 1), {
            [at(n, 4, 2)]: 1e300,
            [at(n, 5, 5)]: 1e-50,
          }),
          lda: n,
          B: withValues(values(n * n, 2), { [at(n, 0, n - 1)]: -1e300 }),
          ldb: n,
        };
        const got = await run(device, a);
        assertIeeeMatch(got.B, dtrmmReference(argsInF32Range(a)).B, "B", 1e-9);
      });
      await t.test(`${side} n=${n}: a result past f32's range`, async () => {
        const a = {
          side,
          uplo: "lower",
          transA: "no-transpose",
          diag: "non-unit",
          m: n,
          n,
          alpha: 10,
          A: withValues(values(n * n, 1), { [at(n, 3, 3)]: 3e38 }),
          lda: n,
          B: values(n * n, 2),
          ldb: n,
        };
        const got = await run(device, a);
        assertIeeeMatch(got.B, saturate(dtrmmReference(a).B), "B", 1e-9);
      });
    }
});
test("dtrmm alpha = 0 reads neither A nor B (regression)", async (t) => {
  for (const side of ["left", "right"])
    for (const n of [7, 150])
      await t.test(`${side} n=${n}`, async () => {
        const a = {
          side,
          uplo: "lower",
          transA: "no-transpose",
          diag: "non-unit",
          m: n,
          n,
          alpha: 0,
          A: withValues(randomFloat64Array(n * n, -1, 1, 1), {
            [at(n, 3, 1)]: NaN,
          }),
          lda: n,
          B: withValues(randomFloat64Array(n * n, -1, 1, 2), {
            [at(n, 2, 3)]: Infinity,
            [at(n, 0, 0)]: NaN,
          }),
          ldb: n,
        };
        const got = await run(device, a);
        assertIeeeMatch(got.B, dtrmmReference(a).B, "B", 1e-9);
      });
});
