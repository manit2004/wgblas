import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, randomFloat32Array } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { strsv } from "wgblas/strsv";
import { assertIeeeMatch, at, withValues } from "../../helpers/specials.js";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { strsvReference as stdlibReference } from "../../helpers/stdlib.js";
import { backwardResidualFactor } from "../helpers.js";
import edgeCases from "../edge-cases.json" with { type: "json" };
import edgeCasesColumnMajor from "../edge-cases-column-major.json" with { type: "json" };

const NUM_RUNS = 100;
const THRESHOLD = 3;

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
  // triangular: true keeps buildArb's diagonal well away from 0 — strsv divides by it.
  // range is also tightened to [-1,1]: with diag="unit" the diagonal is implicitly 1
  // (the triangular patch above doesn't apply), so an off-diagonal magnitude near the
  // default ±10 compounds across a long dependency chain (n up to 50) and overflows
  // float32 to Infinity/NaN — a pathological fixture, not a real accuracy bug.
  A: {
    ...loadParam("A"),
    dependsOn: ["n", "lda"],
    triangular: true,
    range: { elementMin: -1.0, elementMax: 1.0 },
  },
  lda: loadParam("lda"),
  x: { ...loadParam("x"), dependsOn: ["n", "incx"] },
  incx: loadParam("incx"),
  layout: loadParam("layout"),
};

// Cap n for fixtures — validationSpecs allows up to 1000, which makes property tests slow.
const fixtureSpecs = {
  ...validationSpecs,
  n: { ...validationSpecs.n, range: { min: 1, max: 50 } },
};

test("strsv validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) =>
      strsv(
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

test("strsv fixtures", async (t) => {
  await runFixtures(
    t, // node:test context
    "strsv", // routine name
    device, // GPUDevice
    NUM_RUNS, // number of fast-check runs
    THRESHOLD, // max allowed backward-residual factor
    fixtureSpecs, // A's spec has triangular: true — buildArb keeps its diagonal safe
    async (dev, a) =>
      strsv(
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
// loaded from edge-cases.json. Expected output is computed live from stdlib.
test("strsv edge cases", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        uplo: c.uplo, // which triangle of A is stored
        trans: c.trans, // whether to use A or Aᵀ
        diag: c.diag, // unit (diagonal implicitly 1) or non-unit (read from A)
        n: c.n, // matrix dimension (n×n)
        A: new Float32Array(c.A), // matrix, row-major, size n*lda
        lda: c.lda, // leading dimension (row stride) of A
        x: new Float32Array(c.x), // holds b on input, the solution on output
        incx: c.incx, // stride through x
      };
      const { x: got } = await strsv(
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
      const { x: expected } = stdlibReference(a); // stdlib result
      assert.deepEqual(got, expected);
    });
  }
});

// Zero-dimension edge case: strsv is in-place on x (no separate y, no
// beta), and n ties A's order and x's length together, so n=0 is fully
// vacuous. Guards that x comes back byte-for-byte untouched.
test("strsv zero-dimension (regression)", async (t) => {
  await t.test("n=0", async () => {
    const xBefore = randomFloat32Array(4, -1, 1, 9601);
    const x = Float32Array.from(xBefore);
    const got = await strsv(
      device,
      "lower",
      "no-transpose",
      "non-unit",
      0, // n=0
      new Float32Array(0), // A: 0x0 has no elements
      1,
      x,
      1,
    );
    assert.deepEqual(got.x, xBefore);
  });
});

// Up to 2 blocks (strsv.mjs's SUBSTITUTION_MAX_BLOCKS), each diagonal block
// is solved by substitution (strsm_small.wgsl, in place on x) and a
// presolved strsv_step does only the trailing update; one block is a single
// dispatch. Fixtures stop at n=50, so this pins the substitution cases — one
// block at its cap (64), a ragged last 4-row chunk (37), n=1, and two blocks
// with a ragged last block (100) and at the block cap (128) — next to 3 and 5
// blocks (150, 300), which take the inverse path, so both sides of the switch
// run with ragged last blocks. Every uplo/trans/diag/layout, with strided x
// whose gaps must survive.
test("strsv few-block substitution path (regression)", async (t) => {
  for (const N of [64, 37, 1, 100, 128, 150, 300])
    for (const layout of ["row-major", "column-major"])
      for (const uplo of ["lower", "upper"])
        for (const trans of ["no-transpose", "transpose"])
          for (const diag of ["non-unit", "unit"])
            for (const inc of [1, 3]) {
              await t.test(
                `${layout} N=${N} ${uplo} ${trans} ${diag} inc=${inc}`,
                async () => {
                  const A = randomFloat32Array(N * N, -1 / N, 1 / N, 131);
                  for (let i = 0; i < N; i++) A[i * N + i] = 2;
                  const a = {
                    uplo,
                    trans,
                    diag,
                    n: N,
                    A,
                    lda: N,
                    x: randomFloat32Array((N - 1) * inc + 1, -1, 1, 132),
                    incx: inc,
                    layout,
                  };
                  const got = await strsv(
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
// Fixtures cap n at 50 — one 64-row block — so the multi-block path never
// runs there: the fused per-block step (strsv_step.wgsl), its cross-
// workgroup handoff through `sol`, and the final copy into a strided x.
// n=600 is 10 blocks, the last 24 rows. Off-diagonals are kept to ±1/n so
// unit-diagonal systems stay well conditioned at this size.
test("strsv multi-block path (regression)", async (t) => {
  const N = 600;
  for (const layout of ["row-major", "column-major"])
    for (const uplo of ["lower", "upper"])
      for (const trans of ["no-transpose", "transpose"])
        for (const diag of ["non-unit", "unit"])
          for (const inc of [1, 3]) {
            await t.test(
              `${layout} ${uplo} ${trans} ${diag} inc=${inc}`,
              async () => {
                const A = randomFloat32Array(N * N, -1 / N, 1 / N, 41);
                for (let i = 0; i < N; i++) A[i * N + i] = 2;
                const a = {
                  uplo,
                  trans,
                  diag,
                  n: N,
                  A,
                  lda: N,
                  x: randomFloat32Array((N - 1) * inc + 1, -1, 1, 42),
                  incx: inc,
                  layout,
                };
                const got = await strsv(
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
                // Stride gaps must come back untouched.
                for (let i = 0; i < a.x.length; i++)
                  if (i % inc !== 0)
                    assert.equal(got.x[i], a.x[i], `gap element ${i}`);
              },
            );
          }
});

test("strsv edge cases (column-major)", async (t) => {
  for (const c of edgeCasesColumnMajor) {
    await t.test(c.label, async () => {
      const a = {
        uplo: c.uplo, // which triangle of A is stored
        trans: c.trans, // whether to use A or Aᵀ
        diag: c.diag, // unit (diagonal implicitly 1) or non-unit (read from A)
        n: c.n, // matrix dimension (n×n)
        A: new Float32Array(c.A), // matrix, column-major, size n*lda
        lda: c.lda, // leading dimension (column stride) of A
        x: new Float32Array(c.x), // holds b on input, the solution on output
        incx: c.incx, // stride through x
        layout: c.layout, // "column-major"
      };
      const { x: got } = await strsv(
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
      const { x: expected } = stdlibReference(a); // stdlib result
      assert.deepEqual(got, expected);
    });
  }
});

// Host-array calls put ±Infinity and NaN exactly where stdlib does, at any
// size: with a non-finite value in b or A's referenced triangle they take the
// substitution path (util/finite.mjs), since applying a block's inverse can
// leave ±Infinity where substitution's Inf - Inf gives NaN. Covers an
// Infinity at the start, middle and end of b, Infinity in A's referenced
// triangle (a diagonal and an off-diagonal block), and NaN in the
// unreferenced triangle (never read). n = 300 is past the inverse threshold.
test("strsv IEEE special values (regression)", async (t) => {
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
            const A = randomFloat32Array(n * n, -1, 1, 1);
            for (let i = 0; i < n; i++) A[at(n, i, i)] += n + 4;
            A[uplo === "lower" ? at(n, 1, 4) : at(n, 4, 1)] = NaN;
            const x = randomFloat32Array(n, -1, 1, 2);
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
            const got = await strsv(
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
            assertIeeeMatch(got.x, stdlibReference(a).x, "x", 1e-4);
          });
});

// Reference BLAS (and stdlib) runs a transposed solve column by column: an
// unknown that is 0 before its division stays 0 (a NaN diagonal there
// doesn't matter) and its column's updates are skipped, so 0 · Infinity and
// 0 · NaN never happen; the other form takes them. n = 300 takes the
// substitution path, which non-finite host data always does.
test("strsv zero unknowns skip their column (regression)", async (t) => {
  for (const layout of ["row-major", "column-major"])
    for (const uplo of ["lower", "upper"])
      for (const trans of ["no-transpose", "transpose"])
        for (const n of [7, 300])
          await t.test(`${layout} ${uplo} ${trans} n=${n}`, async () => {
            const at2 = (i, j) =>
              layout === "row-major" ? at(n, i, j) : at(n, j, i);
            const A = randomFloat32Array(n * n, -1, 1, 1);
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
            const x = withValues(randomFloat32Array(n, -1, 1, 2), {
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
            const got = await strsv(
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
            assertIeeeMatch(got.x, stdlibReference(a).x, "x", 1e-4);
          });
});
