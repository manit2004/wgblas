import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, randomFloat64Array } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { dtrsv } from "wgblas/dtrsv";
import {
  argsInF32Range,
  assertIeeeMatch,
  at,
  saturate,
  values,
  withValues,
} from "../../helpers/specials.js";
import { dtrsvReference } from "../../helpers/stdlib.js";
import {
  fullPrecisionFrom,
  assertBitIdentical,
  gaps,
} from "../../helpers/exactness.js";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { backwardResidualFactor } from "../helpers.js";
import edgeCases from "../edge-cases.json" with { type: "json" };
import edgeCasesColumnMajor from "../edge-cases-column-major.json" with { type: "json" };

const NUM_RUNS = 100;
// Forward-error cap, pinned to the high-performance/NVIDIA-calibrated bound
// (see tests/dger/src/test.dger.js) — dtrsv is the first f64 routine to use
// ddDivProtected (block inversion's non-unit-diagonal division), deliberately
// last in the port order since division is where dnrm2 found real DD
// edge-case bugs during the L1 port.
const THRESHOLD = 5;

let device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => {
  cleanup();
});

const nSpec = loadParam("n");
const validationSpecs = {
  device: loadParam("device"),
  uplo: loadParam("uplo"),
  trans: loadParam("trans"),
  diag: loadParam("diag"),
  n: {
    ...nSpec,
    edge: nSpec.edge.filter((e) => e.value !== -1),
    invalid: [
      ...nSpec.invalid,
      { value: -1, error: "n must be non-negative", label: "negative" },
    ],
  },
  // triangular: true keeps buildArb's diagonal well away from 0 — dtrsv divides by it.
  // range is also tightened to [-1,1]: with diag="unit" the diagonal is implicitly 1
  // (the triangular patch above doesn't apply), so an off-diagonal magnitude near the
  // default ±10 compounds across a long dependency chain (n up to 50) and could overflow —
  // same reasoning as strsv's own fixture spec.
  A: {
    ...loadParam("A64"),
    dependsOn: ["n", "lda"],
    triangular: true,
    range: { elementMin: -1.0, elementMax: 1.0 },
  },
  lda: loadParam("lda"),
  x: { ...loadParam("x64"), dependsOn: ["n", "incx"] },
  incx: loadParam("incx"),
  layout: loadParam("layout"),
};

// Cap n for fixtures — validationSpecs allows up to 1000, which makes property tests slow.
const fixtureSpecs = {
  ...validationSpecs,
  n: { ...validationSpecs.n, range: { min: 1, max: 50 } },
};

test("dtrsv validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) =>
      dtrsv(
        a.device,
        a.uplo,
        a.trans,
        a.diag,
        a.n,
        a.A,
        a.lda,
        a.x,
        a.incx,
        a.layout,
      ),
    { device },
  );
});

test("dtrsv fixtures", async (t) => {
  await runFixtures(
    t, // node:test context
    "dtrsv", // routine name
    device, // GPUDevice
    NUM_RUNS, // number of fast-check runs
    THRESHOLD, // max allowed backward-residual factor
    fixtureSpecs, // A's spec has triangular: true — buildArb keeps its diagonal safe
    async (dev, a) =>
      dtrsv(
        dev,
        a.uplo,
        a.trans,
        a.diag,
        a.n,
        a.A,
        a.lda,
        a.x,
        a.incx,
        a.layout,
      ), // GPU impl
    () => ({}), // no CPU reference needed — backwardResidualFactor self-checks against b
    backwardResidualFactor, // error metric: plug GPU x back into op(A)*x and compare to b
  );
});

// Small hand-picked scenarios (transpose x uplo x diag combos, non-unit stride)
// loaded from edge-cases.json. dtrsv is the first L2 routine using
// ddDivProtected (non-unit-diagonal division), which divide.wgsl's own
// header documents as having much higher low-power/Intel variance than
// mul/add — bit-exact equality against stdlib (what dtrmv/dsymv/dgemv's
// division-free edge cases use) isn't reliable here even for "clean" inputs
// like 10/5. Same backward-residual threshold check the fixtures test uses,
// following dnrm2's own precedent for its ddDivProtected/ddSqrtProtected
// edge cases.
test("dtrsv edge cases", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        uplo: c.uplo, // which triangle of A is stored
        trans: c.trans, // whether to use A or Aᵀ
        diag: c.diag, // unit (diagonal implicitly 1) or non-unit (read from A)
        n: c.n, // matrix dimension (n×n)
        A: new Float64Array(c.A), // matrix, row-major, size n*lda
        lda: c.lda, // leading dimension (row stride) of A
        x: new Float64Array(c.x), // holds b on input, the solution on output
        incx: c.incx, // stride through x
      };
      const { x: got } = await dtrsv(
        device, // GPU device
        a.uplo, // which triangle of A is stored
        a.trans, // whether to use A or Aᵀ
        a.diag, // unit (diagonal implicitly 1) or non-unit (read from A)
        a.n, // matrix dimension (n×n)
        a.A, // matrix, row-major, size n*lda
        a.lda, // leading dimension (row stride) of A
        a.x, // holds b on input, the solution on output
        a.incx, // stride through x
      ); // GPU result
      const factor = backwardResidualFactor({ x: got }, null, a);
      assert.ok(
        factor <= THRESHOLD,
        `${c.label}: backward residual factor ${factor} > ${THRESHOLD}`,
      );
    });
  }
});

// Zero-dimension edge case: dtrsv is in-place on x (no separate y, no
// beta), and n ties A's order and x's length together, so n=0 is fully
// vacuous. Guards that x comes back byte-for-byte untouched.
test("dtrsv zero-dimension (regression)", async (t) => {
  await t.test("n=0", async () => {
    const xBefore = randomFloat64Array(4, -1, 1, 9601);
    const x = Float64Array.from(xBefore);
    const got = await dtrsv(
      device,
      "lower",
      "no-transpose",
      "non-unit",
      0, // n=0
      new Float64Array(0), // A: 0x0 has no elements
      1,
      x,
      1,
    );
    assert.deepEqual(got.x, xBefore);
  });
});

// Fixtures stay within one 64-row block, so neither the few-block
// substitution path past one block nor the inverse path ever runs there. Up
// to 2 blocks (dtrsv.mjs's SUBSTITUTION_MAX_BLOCKS), each diagonal block is
// solved by substitution (dtrsv_small.wgsl, in place on x) and a presolved
// dtrsv_step does only the trailing update: one block at its cap (64), a
// ragged one (37), n=1, two blocks ragged (100) and full (128). 3, 5 and 10
// blocks (150, 300, 600) take the inverse path (dtrsv_small's invert mode,
// one dtrsv_step per block, the final copy into x), ragged last blocks
// included. Every uplo/trans/diag/layout, with strided x whose gaps must
// survive. A is random off the stored triangle too, so reading outside it
// would show; off-diagonals are kept to ±1/n so unit-diagonal systems stay
// well conditioned.
test("dtrsv substitution and inverse paths (regression)", async (t) => {
  for (const N of [64, 37, 1, 100, 128, 150, 300, 600])
    for (const layout of ["row-major", "column-major"])
      for (const uplo of ["lower", "upper"])
        for (const trans of ["no-transpose", "transpose"])
          for (const diag of ["non-unit", "unit"])
            for (const inc of [1, 3]) {
              await t.test(
                `${layout} N=${N} ${uplo} ${trans} ${diag} inc=${inc}`,
                async () => {
                  const A = randomFloat64Array(N * N, -1 / N, 1 / N, 131);
                  for (let i = 0; i < N; i++) A[i * N + i] = 2;
                  const a = {
                    uplo,
                    trans,
                    diag,
                    n: N,
                    A,
                    lda: N,
                    x: randomFloat64Array((N - 1) * inc + 1, -1, 1, 132),
                    incx: inc,
                    layout,
                  };
                  const got = await dtrsv(
                    device,
                    a.uplo,
                    a.trans,
                    a.diag,
                    a.n,
                    a.A,
                    a.lda,
                    a.x,
                    a.incx,
                    a.layout,
                  );
                  const factor = backwardResidualFactor(got, null, a);
                  assert.ok(
                    factor <= THRESHOLD,
                    `backward residual factor ${factor} > ${THRESHOLD}`,
                  );
                  for (let i = 0; i < a.x.length; i++)
                    if (i % inc !== 0)
                      assert.equal(got.x[i], a.x[i], `gap element ${i}`);
                },
              );
            }
});

// Small hand-picked scenarios loaded from edge-cases-column-major.json.
test("dtrsv edge cases (column-major)", async (t) => {
  for (const c of edgeCasesColumnMajor) {
    await t.test(c.label, async () => {
      const a = {
        uplo: c.uplo, // which triangle of A is stored
        trans: c.trans, // whether to use A or Aᵀ
        diag: c.diag, // unit (diagonal implicitly 1) or non-unit (read from A)
        n: c.n, // matrix dimension (n×n)
        A: new Float64Array(c.A), // matrix, column-major, size n*lda
        lda: c.lda, // leading dimension (column stride) of A
        x: new Float64Array(c.x), // holds b on input, the solution on output
        incx: c.incx, // stride through x
        layout: c.layout, // "column-major"
      };
      const { x: got } = await dtrsv(
        device, // GPU device
        a.uplo, // which triangle of A is stored
        a.trans, // whether to use A or Aᵀ
        a.diag, // unit (diagonal implicitly 1) or non-unit (read from A)
        a.n, // matrix dimension (n×n)
        a.A, // matrix, column-major, size n*lda
        a.lda, // leading dimension (column stride) of A
        a.x, // holds b on input, the solution on output
        a.incx, // stride through x
        a.layout, // storage layout
      ); // GPU result
      const factor = backwardResidualFactor({ x: got }, null, a);
      assert.ok(
        factor <= THRESHOLD,
        `${c.label}: backward residual factor ${factor} > ${THRESHOLD}`,
      );
    });
  }
});

// Values the routine leaves alone come back bit-identical (see
// tests/helpers/exactness.js): full-precision inputs, which the (hi, lo)
// split would round if they went through a GPU round trip.
test("dtrsv exactness (regression)", async () => {
  const full = fullPrecisionFrom(990);
  const n = 5;
  // Diagonally dominant, so the solve stays well conditioned.
  const A = full(n * n);
  for (let i = 0; i < n; i++) A[i * n + i] += n + 4;
  const x = full(13);
  const got = await dtrsv(
    device,
    "upper",
    "no-transpose",
    "non-unit",
    n,
    A,
    n,
    x,
    3,
  );
  assertBitIdentical(got.x, x, gaps(n, 3), "x stride gaps");
});

// Host-array calls put ±Infinity and NaN exactly where stdlib does, at any
// size: with a non-finite value in b or A's referenced triangle they take the
// substitution path (util/finite.mjs), since applying a block's inverse can
// leave ±Infinity where substitution's Inf - Inf gives NaN. Covers an
// Infinity at the start, middle and end of b, Infinity in A's referenced
// triangle (a diagonal and an off-diagonal block), and NaN in the
// unreferenced triangle (never read). n = 300 is past the inverse threshold.
test("dtrsv IEEE special values (regression)", async (t) => {
  for (const uplo of ["lower", "upper"])
    for (const trans of ["no-transpose", "transpose"])
      for (const n of [7, 300])
        for (const [label, setup] of [
          ["Infinity early in b", (A, x) => (x[1] = Infinity)],
          ["Infinity mid-b", (A, x) => (x[Math.floor(n / 2)] = Infinity)],
          ["Infinity late in b", (A, x) => (x[n - 2] = -Infinity)],
          [
            "Infinity in A",
            (A) =>
              (A[uplo === "lower" ? at(n, n - 1, 2) : at(n, 2, n - 1)] =
                Infinity),
          ],
          [
            "Infinity in A near the diagonal",
            (A) => (A[uplo === "lower" ? at(n, 5, 4) : at(n, 4, 5)] = Infinity),
          ],
        ])
          await t.test(`${uplo} ${trans} n=${n}: ${label}`, async () => {
            const A = randomFloat64Array(n * n, -1, 1, 1);
            for (let i = 0; i < n; i++) A[at(n, i, i)] += n + 4;
            A[uplo === "lower" ? at(n, 1, 4) : at(n, 4, 1)] = NaN;
            const x = randomFloat64Array(n, -1, 1, 2);
            setup(A, x);
            const a = {
              uplo,
              trans,
              diag: "non-unit",
              n,
              A,
              lda: n,
              x,
              incx: 1,
            };
            const got = await dtrsv(
              device,
              a.uplo,
              a.trans,
              a.diag,
              a.n,
              a.A,
              a.lda,
              x.slice(),
              a.incx,
            );
            assertIeeeMatch(got.x, dtrsvReference(a).x, "x", 1e-9);
          });
});

// Double-double has f64's precision but f32's exponent range (its leading
// part is an f32): a double beyond ±3.4e38 reads as ±Infinity, one below
// f32's range as 0, and a result past it overflows to ±Infinity — where real
// f64 stays finite. Pinned against stdlib on the inputs as double-double sees
// them (tests/helpers/specials.js), so a change in that behaviour shows.
test("dtrsv f32 exponent range (regression)", async (t) => {
  // 1e300 in b reads as Infinity — and, like a real Infinity, takes the
  // substitution path at n = 300 (util/finite.mjs) to match stdlib; 1e300 in
  // the unreferenced triangle is never read.
  for (const uplo of ["lower", "upper"])
    for (const n of [7, 300])
      await t.test(`${uplo} n=${n}`, async () => {
        const A = values(n * n, 1);
        for (let i = 0; i < n; i++) A[at(n, i, i)] += n + 4;
        const [r, c] = uplo === "lower" ? [1, 4] : [4, 1];
        const a = {
          uplo,
          trans: "no-transpose",
          diag: "non-unit",
          n,
          A: withValues(A, { [at(n, r, c)]: 1e300, [at(n, c, r)]: 1e-50 }),
          lda: n,
          x: withValues(values(n, 2), { [Math.floor(n / 2)]: 1e300, 2: 1e-50 }),
          incx: 1,
        };
        const got = await dtrsv(
          device,
          a.uplo,
          a.trans,
          a.diag,
          a.n,
          a.A,
          a.lda,
          a.x,
          a.incx,
        );
        assertIeeeMatch(
          got.x,
          saturate(dtrsvReference(argsInF32Range(a)).x),
          "x",
          1e-9,
        );
      });
});

// Reference BLAS (and stdlib) runs a transposed solve column by column: an
// unknown that is 0 before its division stays 0 (a NaN diagonal there
// doesn't matter) and its column's updates are skipped, so 0 · Infinity and
// 0 · NaN never happen; the other form takes them. n = 300 takes the
// substitution path, which non-finite host data always does.
test("dtrsv zero unknowns skip their column (regression)", async (t) => {
  for (const layout of ["row-major", "column-major"])
    for (const uplo of ["lower", "upper"])
      for (const trans of ["no-transpose", "transpose"])
        for (const n of [7, 300])
          await t.test(`${layout} ${uplo} ${trans} n=${n}`, async () => {
            const at2 = (i, j) =>
              layout === "row-major" ? at(n, i, j) : at(n, j, i);
            const A = randomFloat64Array(n * n, -1, 1, 1);
            for (let i = 0; i < n; i++) A[at(n, i, i)] += n + 4;
            // The first unknown solved is 0 (b = 0 there), its diagonal NaN,
            // and the entry it multiplies further on Infinity.
            const forward = (uplo === "lower") === (trans === "no-transpose");
            const first = forward ? 0 : n - 1;
            const later = forward ? 3 : n - 4;
            A[at2(first, first)] = NaN;
            A[
              trans === "no-transpose" ? at2(later, first) : at2(first, later)
            ] = Infinity;
            const x = withValues(randomFloat64Array(n, -1, 1, 2), {
              [first]: 0,
            });
            const a = {
              uplo,
              trans,
              diag: "non-unit",
              n,
              A,
              lda: n,
              x,
              incx: 1,
              layout,
            };
            const got = await dtrsv(
              device,
              a.uplo,
              a.trans,
              a.diag,
              a.n,
              a.A,
              a.lda,
              x.slice(),
              a.incx,
              a.layout,
            );
            assertIeeeMatch(got.x, dtrsvReference(a).x, "x", 1e-9);
          });
});
