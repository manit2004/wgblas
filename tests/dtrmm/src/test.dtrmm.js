import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, randomFloat64Array } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { dtrmm } from "wgblas/dtrmm";
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
import { dtrmmReference as stdlibReference } from "../../helpers/stdlib.js";
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
// 13-argument call in one place. `a.layout` undefined → the default row-major.
const run = (dev, a) =>
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

const nSpec = loadParam("n");
const validationSpecs = {
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

// Cap m/n for fixtures — validationSpecs allows up to 200x1000 matrices which
// makes property tests prohibitively slow. Keep validation coverage wide, fixtures fast.
const fixtureSpecs = {
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
    stdlibReference,
    forwardFactor,
  );
});

// Small hand-picked scenarios loaded from edge-cases.json (strmm's, plus a
// unit-diagonal case whose ignored diagonal has a nonzero Lo half, and
// alpha=2 / alpha=0 cases). All small integers — exact through the DD split,
// and dtrmm has no division, so bit-exact equality holds over the whole of B.
test("dtrmm edge cases", async (t) => {
  for (const tc of edgeCases) {
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
      assert.deepEqual(got.B, stdlibReference(a).B);
    });
  }
});

// m=0 or n=0 ties directly to B's own shape, so B is written over a vacuous
// region in both cases — the routine must return B completely untouched.
// runEdgeCases (see tests/helpers/validation.js) only asserts that calls
// don't throw, so this test checks B comes back as the same array, bit for
// bit.
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
      assert.equal(got.B, B);
      assertBitIdentical(got.B, bBefore, all(16), "B");
    });
});

// Fixtures cap m/n at 20 (one tile), so dtrmm's multi-tile grid and vec4
// loads only run here: aOrder=150 spans several tiles with ldb % 4 != 0
// (scalar loads); 400 with a 4-aligned ldb (vec4 loads). Every
// side/uplo/trans/layout pairing, since each lands the triangle on a
// different gemm operand and orientation. OTHER is a multiple of 4 so every
// N=400 side/layout pairing keeps ldb aligned.
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
                const factor = forwardFactor(got, stdlibReference(a), a);
                assert.ok(
                  factor <= THRESHOLD,
                  `forward factor ${factor} > ${THRESHOLD}`,
                );
                // Stride padding is never part of the matrix — it must come back as-is.
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

// Small hand-picked scenarios loaded from edge-cases-column-major.json.
test("dtrmm edge cases (column-major)", async (t) => {
  for (const tc of edgeCasesColumnMajor) {
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
      assert.deepEqual(got.B, stdlibReference(a).B);
    });
  }
});

// Values the routine leaves alone come back bit-identical (see
// tests/helpers/exactness.js): full-precision inputs, which the (hi, lo)
// split would round if they went through a GPU round trip. The input array
// itself is never mutated — the result is a new array.
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
      assert.notEqual(got.B, B);
      assertBitIdentical(got.B, B, ldPadding(m, n, ldb), "B");
      assertBitIdentical(B, bBefore, all(m * ldb), "input B");
    });
});

// ±Infinity and NaN reach the outputs as in real f64 (stdlib): no Inf turned
// into NaN by a double-double error term (see tests/helpers/specials.js).
test("dtrmm IEEE special values (regression)", async (t) => {
  for (const side of ["left", "right"])
    for (const uplo of ["lower", "upper"])
      for (const transA of ["no-transpose", "transpose"])
        for (const n of [7, 150])
          await t.test(`${side} ${uplo} ${transA} n=${n}`, async () => {
            // Inf and NaN in A's stored triangle propagate.
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
            assertIeeeMatch(got.B, stdlibReference(a).B, "B");
          });
  // A's other triangle is never read, nor its diagonal when diag='unit', so
  // NaN there can't reach B.
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
          assertIeeeMatch(got.B, stdlibReference(a).B, "B", 1e-12);
          assert.ok(got.B.every(Number.isFinite), "NaN leaked into B");
        },
      );
});

// Double-double has f64's precision but f32's exponent range (its leading
// part is an f32): a double beyond ±3.4e38 reads as ±Infinity, one below
// f32's range as 0, and a result past it overflows to ±Infinity — where real
// f64 stays finite. Pinned against stdlib on the inputs as double-double sees
// them (tests/helpers/specials.js), so a change in that behaviour shows.
test("dtrmm f32 exponent range (regression)", async (t) => {
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
        assertIeeeMatch(got.B, stdlibReference(argsInF32Range(a)).B, "B", 1e-9);
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
        assertIeeeMatch(got.B, saturate(stdlibReference(a).B), "B", 1e-9);
      });
    }
});

// alpha = 0: reference BLAS (and stdlib) sets B to 0 without reading A or B,
// so NaN or ±Infinity there can't reach it.
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
        assertIeeeMatch(got.B, stdlibReference(a).B, "B", 1e-9);
      });
});
