import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, randomFloat64Array } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { dtrsm } from "wgblas/dtrsm";
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
import { backwardResidualFactor } from "../helpers.js";
import { dtrsmReference as stdlibReference } from "../../helpers/stdlib.js";
import edgeCases from "../edge-cases.json" with { type: "json" };
import edgeCasesColumnMajor from "../edge-cases-column-major.json" with { type: "json" };

const NUM_RUNS = 100;
// dtrsv's threshold: the solve multiplies by each diagonal's reciprocal
// rather than dividing, a rounding the residual bound's coefficient doesn't
// count.
const THRESHOLD = 5;

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
  dtrsm(
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

// The residual factor within THRESHOLD, and B's stride padding untouched.
function assertSolved(got, a, padding = []) {
  const factor = backwardResidualFactor(got, null, a);
  assert.ok(
    factor <= THRESHOLD,
    `backward residual factor ${factor} exceeds threshold ${THRESHOLD}`,
  );
  // Stride padding is never part of the matrix — it must come back as-is.
  assertBitIdentical(got.B, a.B, padding, "B padding");
}

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
  // triangular: true keeps the diagonal away from 0, as for dtrsv. Range
  // tightened to [-0.5,0.5], as for strsm: with diag='unit', off-diagonals
  // near ±1 make the solution grow combinatorially with the order.
  A: {
    ...loadParam("A64"),
    dependsOn: ["m", "n", "lda", "side"],
    triangular: true,
    range: { elementMin: -0.5, elementMax: 0.5 },
  },
  lda: loadParam("ld"),
  B: { ...loadParam("B64"), dependsOn: ["m", "n", "ldb"] },
  ldb: loadParam("ld"),
};

test("dtrsm validation", async (t) => {
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

test("dtrsm fixtures", async (t) => {
  await runFixtures(
    t,
    "dtrsm",
    device,
    NUM_RUNS,
    THRESHOLD,
    fixtureSpecs,
    run,
    stdlibReference,
    backwardResidualFactor,
  );
});

// Small hand-picked scenarios loaded from edge-cases.json: strsm's, plus a
// unit-diagonal case whose ignored diagonal (0.1) has a nonzero Lo half.
test("dtrsm edge cases", async (t) => {
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
      assertSolved(await run(device, a), a);
    });
  }
});

// Small hand-picked scenarios loaded from edge-cases-column-major.json.
test("dtrsm edge cases (column-major)", async (t) => {
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
      assertSolved(await run(device, a), a);
    });
  }
});

// m=0 or n=0 ties directly to B's own shape, so B is written over a vacuous
// region in both cases — the routine must return B completely untouched.
test("dtrsm zero-dimension (regression)", async (t) => {
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

// One random well-conditioned case: off-diagonals of ±1/N and a diagonal of
// 2 keep even unit-diagonal systems tame, B padded by `pad` per stride.
function solveCase({ N, OTHER, pad, layout, side, uplo, transA, diag, seed }) {
  const m = side === "left" ? N : OTHER;
  const n = side === "left" ? OTHER : N;
  const cm = layout === "column-major";
  const LD = (cm ? m : n) + pad;
  const OUTER = cm ? n : m;
  const A = randomFloat64Array(N * N, -1 / N, 1 / N, seed);
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
    B: randomFloat64Array(OUTER * LD, -1, 1, seed + 1),
    ldb: LD,
    layout,
  };
  return { a, padding: ldPadding(OUTER, LD - pad, LD) };
}

// aOrder <= 64 runs the single-dispatch substitution kernel
// (dtrsm_small.wgsl): four right-hand sides per workgroup, a reversed system
// for the effectively-upper cases. Orders 64 (the cap), 37 and 1, with
// otherLen 70 and 7 — not multiples of 4, so the last workgroup is partly
// empty — every side, uplo, trans and layout, padded ldb, alpha=1.5 applied
// on read-in.
test("dtrsm single-block substitution path (regression)", async (t) => {
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
                const { a, padding } = solveCase({
                  N,
                  OTHER,
                  pad: 3,
                  layout,
                  side,
                  uplo,
                  transA,
                  diag,
                  seed: 121,
                });
                assertSolved(await run(device, a), a, padding);
              },
            );
          }
});

// Fixtures cap m/n at 20, so the blocked solve — solve a 64-row block, then
// the trailing update (gather, dgemm_small, scatter) — only runs here:
// aOrder=150 is three blocks, the last 22 rows; 192 is three full ones, with
// a 4-aligned ldb (vec4 loads in the update). Every side/uplo/trans/layout
// pairing, since each lands the blocks on a different axis of B and A, and
// half of them solve backward. alpha=1.5 goes in through the first block's
// solve and the first update's beta.
test("dtrsm blocked solve (regression)", async (t) => {
  for (const [N, OTHER, pad] of [
    [150, 9, 1],
    [192, 8, 4],
  ])
    for (const layout of ["row-major", "column-major"])
      for (const side of ["left", "right"])
        for (const uplo of ["lower", "upper"])
          for (const transA of ["no-transpose", "transpose"]) {
            const diag = transA === "transpose" ? "unit" : "non-unit";
            await t.test(
              `${layout} N=${N} ${side} ${uplo} ${transA} ${diag}`,
              async () => {
                const { a, padding } = solveCase({
                  N,
                  OTHER,
                  pad,
                  layout,
                  side,
                  uplo,
                  transA,
                  diag,
                  seed: 101,
                });
                assertSolved(await run(device, a), a, padding);
              },
            );
          }
});

// A backward solve takes the blocks last first, and when the order isn't a
// multiple of 64 that block is short — so the update after it covers every
// row but a few. The update's packed buffers were sized for "all rows but
// 64", and WebGPU drops out-of-bounds writes silently, so every full block's
// rows came back wrong. Orders 70 (64 + 6) and 150 (64 + 64 + 22), every
// backward case.
test("dtrsm backward solve, short first block (regression)", async (t) => {
  for (const N of [70, 150])
    for (const layout of ["row-major", "column-major"])
      for (const [side, uplo, transA] of [
        ["left", "upper", "no-transpose"],
        ["left", "lower", "transpose"],
        ["right", "lower", "no-transpose"],
        ["right", "upper", "transpose"],
      ])
        await t.test(`${layout} N=${N} ${side} ${uplo} ${transA}`, async () => {
          const { a, padding } = solveCase({
            N,
            OTHER: 3,
            pad: 0,
            layout,
            side,
            uplo,
            transA,
            diag: "non-unit",
            seed: 141,
          });
          assertSolved(await run(device, a), a, padding);
        });
});

// Values the routine leaves alone come back bit-identical (see
// tests/helpers/exactness.js): full-precision inputs, which the (hi, lo)
// split would round if they went through a GPU round trip. The input array
// itself is never mutated — the result is a new array.
test("dtrsm exactness (regression)", async (t) => {
  const full = fullPrecisionFrom(1180);
  const n = 6;
  for (const side of ["left", "right"])
    await t.test(`ldb padding (${side})`, async () => {
      const [m, ldb] = [4, n + 3];
      const aOrder = side === "left" ? m : n;
      const A = full(aOrder * aOrder);
      for (let i = 0; i < aOrder; i++) A[i * aOrder + i] += 3; // well away from 0
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
        A,
        lda: aOrder,
        B,
        ldb,
      });
      assert.notEqual(got.B, B);
      assertBitIdentical(got.B, B, ldPadding(m, n, ldb), "B");
      assertBitIdentical(B, bBefore, all(m * ldb), "input B");
    });
});

// The result keeps B's exact storage length: B may stop short of a full last
// stride ((m-1)*ldb + n elements) or run past the matrix, and neither the
// length nor anything outside the m x n region may change. Dyadic values, so
// the solve is exact and the comparison can be too.
test("dtrsm B storage length (regression)", async (t) => {
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
      assert.equal(got.B.length, B.length);
      assert.deepEqual(got.B, stdlibReference(a).B.subarray(0, B.length));
    });
});

// ±Infinity and NaN reach the outputs as in real f64 (the substitution
// reference): no Inf turned into NaN by a double-double error term (see
// tests/helpers/specials.js). Infinity early, mid and late along the
// triangular dimension of B, Infinity in A's referenced triangle, and NaN in
// the unreferenced one (never read); m = 7 is one block, 150 three.
test("dtrsm IEEE special values (regression)", async (t) => {
  const n = 5;
  for (const uplo of ["lower", "upper"])
    for (const transA of ["no-transpose", "transpose"])
      for (const m of [7, 150])
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
            const A = randomFloat64Array(m * m, -1, 1, 1);
            for (let i = 0; i < m; i++) A[at(m, i, i)] += m + 4;
            A[uplo === "lower" ? at(m, 1, 4) : at(m, 4, 1)] = NaN;
            const B = randomFloat64Array(m * n, -1, 1, 2);
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
              B,
              ldb: n,
            };
            const got = await run(device, a);
            assertIeeeMatch(got.B, stdlibReference(a).B, "B", 1e-9);
          });
  // A's other triangle is never read, nor its diagonal when diag='unit', so
  // NaN there can't reach B.
  for (const uplo of ["lower", "upper"])
    for (const transA of ["no-transpose", "transpose"])
      await t.test(
        `${uplo} ${transA}: the unstored triangle and unit diagonal are not read`,
        async () => {
          const n7 = 7;
          const unstored = uplo === "lower" ? [1, 5] : [5, 1];
          const a = {
            side: "left",
            uplo,
            transA,
            diag: "unit",
            m: n7,
            n: n7,
            alpha: 1.5,
            A: withValues(randomFloat64Array(n7 * n7, -0.2, 0.2, 4), {
              [at(n7, ...unstored)]: NaN,
              [at(n7, 3, 3)]: NaN,
            }),
            lda: n7,
            B: values(n7 * n7, 5),
            ldb: n7,
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
// f64 stays finite. Pinned against the reference on the inputs as
// double-double sees them (tests/helpers/specials.js), so a change in that
// behaviour shows.
test("dtrsm f32 exponent range (regression)", async (t) => {
  // Out-of-range inputs and an overflowing result are separate cases: an
  // intermediate past f32's range is already Infinity here where f64 still
  // holds it, so mixed with another Infinity it can give NaN where f64
  // doesn't.
  for (const side of ["left", "right"])
    for (const n of [7, 150]) {
      // Diagonal 4 keeps the solve tame; the out-of-range entries sit in the
      // stored triangle (1e300, read as Infinity) and in B (-1e300).
      const tame = () => {
        const A = randomFloat64Array(n * n, -0.1, 0.1, 1);
        for (let i = 0; i < n; i++) A[at(n, i, i)] = 4;
        return A;
      };
      await t.test(`${side} n=${n}: out-of-range inputs`, async () => {
        const a = {
          side,
          uplo: "lower",
          transA: "no-transpose",
          diag: "non-unit",
          m: n,
          n,
          alpha: 1.5,
          A: withValues(tame(), { [at(n, 4, 2)]: 1e300, [at(n, 5, 1)]: 1e-50 }),
          lda: n,
          B: withValues(values(n * n, 2), { [at(n, 0, n - 1)]: -1e300 }),
          ldb: n,
        };
        const got = await run(device, a);
        assertIeeeMatch(got.B, stdlibReference(argsInF32Range(a)).B, "B", 1e-9);
      });
      // The last unknowns solved — the last row (side='left', solving
      // forward) or the first column ('right', backward) — over a diagonal
      // of 1e-37 (a normal f32) with a right-hand side of 1e3: alpha·b/a
      // = 1e41, past f32's range, while every other unknown stays ordinary.
      // Nothing depends on them, so the overflow reaches no other result —
      // where it would, f64 still holds the huge value and later
      // subtractions cancel it, while double-double has Infinity already.
      await t.test(`${side} n=${n}: a result past f32's range`, async () => {
        const last = side === "left" ? n - 1 : 0;
        const big = {};
        for (let k = 0; k < n; k++)
          big[side === "left" ? at(n, last, k) : at(n, k, last)] = 1e3;
        const a = {
          side,
          uplo: "lower",
          transA: "no-transpose",
          diag: "non-unit",
          m: n,
          n,
          alpha: 10,
          A: withValues(tame(), { [at(n, last, last)]: 1e-37 }),
          lda: n,
          B: withValues(values(n * n, 2), big),
          ldb: n,
        };
        const got = await run(device, a);
        assertIeeeMatch(got.B, saturate(stdlibReference(a).B), "B", 1e-9);
      });
    }
});

// alpha = 0: reference BLAS (and stdlib) sets B to 0 without reading A or B,
// so NaN or ±Infinity there can't reach it.
test("dtrsm alpha = 0 reads neither A nor B (regression)", async (t) => {
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
