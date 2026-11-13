import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, randomFloat64Array } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { dsymm } from "wgblas/dsymm";
import {
  argsInF32Range,
  assertIeeeMatch,
  at,
  saturate,
  values,
  withValues,
} from "../../helpers/specials.js";
import {
  fullPrecisionFrom,
  assertBitIdentical,
  all,
  ldPadding,
} from "../../helpers/exactness.js";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { forwardFactor } from "../helpers.js";
import { dsymmReference as stdlibReference } from "../../helpers/stdlib.js";
import edgeCases from "../edge-cases.json" with { type: "json" };
import edgeCasesColumnMajor from "../edge-cases-column-major.json" with { type: "json" };

const NUM_RUNS = 100;
const THRESHOLD = 1;

let device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => {
  cleanup();
});

// Every call below passes the same argument object, so one helper keeps the
// 14-argument call in one place. `a.layout` undefined → the default row-major.
const run = (dev, a) =>
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

const nSpec = loadParam("n");
const validationSpecs = {
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

// Cap m/n for fixtures — validationSpecs allows up to 200x1000 matrices which
// makes property tests prohibitively slow. Keep validation coverage wide, fixtures fast.
const fixtureSpecs = {
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
    stdlibReference,
    forwardFactor,
  );
});

// Small hand-picked scenarios loaded from edge-cases.json (ssymm's, plus an
// alpha=2, beta=3 case). All small integers — exact through the DD split, and
// dsymm has no division, so bit-exact equality holds over the whole of C.
test("dsymm edge cases", async (t) => {
  for (const tc of edgeCases) {
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
      assert.deepEqual(got.C, stdlibReference(a).C);
    });
  }
});

// m=0 or n=0 ties directly to C's own shape, so the touched region is
// vacuous in both cases — the routine must return C completely untouched,
// not scaled by beta over zero elements. runEdgeCases (see
// tests/helpers/validation.js) only asserts that calls don't throw, so this
// test checks C comes back as the same array, bit for bit.
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
      assert.equal(got.C, C);
      assertBitIdentical(got.C, cBefore, all(16), "C");
    });
});

// Fixtures cap m/n at 20 (one tile), so dsymm's multi-tile grid and vec4
// loads only run here: aOrder=150 spans several tiles with ld % 4 != 0
// (scalar loads); 400 with 4-aligned strides (vec4 loads). OTHER is a
// multiple of 4 so every N=400 side/layout pairing keeps ld aligned.
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
            const factor = forwardFactor(got, stdlibReference(a), a);
            assert.ok(
              factor <= THRESHOLD,
              `forward factor ${factor} > ${THRESHOLD}`,
            );
            // Stride padding is never part of the matrix — it must come back as-is.
            assertBitIdentical(
              got.C,
              a.C,
              ldPadding(OUTER, LD - pad, LD),
              "C padding",
            );
          });
        }
});

// Small hand-picked scenarios loaded from edge-cases-column-major.json.
test("dsymm edge cases (column-major)", async (t) => {
  for (const tc of edgeCasesColumnMajor) {
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
      assert.deepEqual(got.C, stdlibReference(a).C);
    });
  }
});

// Values the routine leaves alone come back bit-identical (see
// tests/helpers/exactness.js): full-precision inputs, which the (hi, lo)
// split would round if they went through a GPU round trip.
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
    assert.equal(got.C, C);
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

// ±Infinity and NaN reach the outputs as in real f64 (stdlib): no Inf turned
// into NaN by a double-double error term (see tests/helpers/specials.js).
test("dsymm IEEE special values (regression)", async (t) => {
  for (const side of ["left", "right"])
    for (const uplo of ["lower", "upper"])
      for (const n of [7, 150])
        await t.test(`${side} ${uplo} n=${n}`, async () => {
          // Inf in A's stored triangle and NaN in B propagate; beta = 0 must
          // ignore the NaN/Inf in C.
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
          const C0 = new Float64Array(n * n); // what beta = 0 makes of C
          assertIeeeMatch(got.C, stdlibReference({ ...a, C: C0 }).C, "C");
        });
  // A's other triangle is never read (it's implied by symmetry), so NaN
  // there can't reach C.
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
      assertIeeeMatch(got.C, stdlibReference(a).C, "C", 1e-12);
      assert.ok(got.C.every(Number.isFinite), "NaN leaked into C");
    });
});

// Double-double has f64's precision but f32's exponent range (its leading
// part is an f32): a double beyond ±3.4e38 reads as ±Infinity, one below
// f32's range as 0, and a result past it overflows to ±Infinity — where real
// f64 stays finite. Pinned against stdlib on the inputs as double-double sees
// them (tests/helpers/specials.js), so a change in that behaviour shows.
test("dsymm f32 exponent range (regression)", async (t) => {
  // Out-of-range inputs and an overflowing result are separate cases: an
  // intermediate past f32's range is already Infinity here where f64 still
  // holds it, so mixed with another Infinity it can give NaN where f64
  // doesn't.
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
        assertIeeeMatch(got.C, stdlibReference(argsInF32Range(a)).C, "C", 1e-9);
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
        assertIeeeMatch(got.C, saturate(stdlibReference(a).C), "C", 1e-9);
      });
    }
});

// alpha = 0: reference BLAS (and stdlib) scales the output by beta without
// reading the other operands, so NaN or ±Infinity there can't reach it — and
// beta = 0 clears it, NaN included.
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
          assertIeeeMatch(got.C, stdlibReference(a).C, "C", 1e-9);
        });
});
