import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, randomFloat32Array } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { sgemmtr } from "wgblas/sgemmtr";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { forwardFactor } from "../helpers.js";
import { sgemmtrReference as stdlibReference } from "../../helpers/stdlib.js";
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

const nSpec = loadParam("n");
const aSpec = loadParam("A");
const ldSpec = loadParam("ld");
const validationSpecs = {
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

// Cap m/n/k for fixtures — validationSpecs allows up to 200×1000 matrices which
// makes property tests prohibitively slow. Keep validation coverage wide, fixtures fast.
const fixtureSpecs = {
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
    stdlibReference,
    forwardFactor,
  );
});

// Small hand-picked scenarios loaded from edge-cases.json. Expected output is
// computed live from stdlib, not hardcoded.
test("sgemmtr edge cases", async (t) => {
  for (const tc of edgeCases) {
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
      const expected = stdlibReference(a);
      assert.deepEqual(got.C, expected.C);
    });
  }
});

// sgemmtr shares sgemm's exact large-tile selection formula
// (ceil(n/64)*ceil(m/64) >= LARGE_TILE_WORKGROUP_THRESHOLD) and has the same
// gap — see sgemm's own "large-tile path (regression)" test for the full
// rationale. C must be square here (a triangle only makes sense for one),
// and both uplo values get their own case since the triangle boundary
// masking differs between them, not just the dense-vs-transpose load paths.
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
            const expected = stdlibReference(a);
            const factor = forwardFactor(got, expected, a);
            assert.ok(
              factor <= THRESHOLD,
              `uplo=${uplo}, transA=${transA}, transB=${transB}: forward factor ${factor} > ${THRESHOLD}`,
            );
          },
        );
      }
    }
  }
});

// k=0 (with m,n>0) makes the matrix product term vanish entirely, so within
// the uplo triangle C should collapse to beta*C, and the opposite triangle
// must stay byte-identical (sgemmtr only reads/writes the named triangle).
// runEdgeCases (see tests/helpers/validation.js) only asserts that calls
// don't throw, so an implementation that skips applying beta within the
// triangle when k=0, or that touches the untouched triangle, would still
// pass every existing case — this test checks actual per-element values.
// sgemmtr runs on sgemm's kernels and skips tiles wholly outside the
// triangle. The large-tile test above covers that for the 64-tile kernel;
// fixtures (n <= 20) never span more than one 32-tile, so this covers the
// small kernel's skipping, plus non-square C (the triangle of an m×n grid),
// in both layouts (column-major flips uplo internally). forwardFactor only
// checks the requested triangle, so the other one is also asserted to come
// back byte-identical — that's where a wrong skip or mask would write.
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
              // Stored shapes: op(A) is M×K, op(B) is K×N; column-major swaps rows/cols.
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
              const factor = forwardFactor(got, stdlibReference(a), a);
              assert.ok(
                factor <= THRESHOLD,
                `forward factor ${factor} > ${THRESHOLD}`,
              );
              for (let i = 0; i < M; i++)
                for (let j = 0; j < N; j++) {
                  const inTri = uplo === "lower" ? j <= i : j >= i;
                  if (inTri) continue;
                  const idx = cm ? j * a.ldc + i : i * a.ldc + j;
                  assert.equal(
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
      // transA='no-transpose' stores A as M x K (each of its M rows has 0
      // elements) and transB='transpose' stores B as N x K (each of its N
      // rows has 0 elements) — both non-empty buffers (WebGPU rejects a
      // zero-byte storage binding), per sgemmtr.mjs's own length validation,
      // with lda/ldb at their K=0 minimum of 1.
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
          assert.equal(got.C[i], expected, `row=${row}, col=${col}`);
        }
      }
    });
  }
});

// Small hand-picked scenarios loaded from edge-cases-column-major.json.
test("sgemmtr edge cases (column-major)", async (t) => {
  for (const tc of edgeCasesColumnMajor) {
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
      const expected = stdlibReference(a);
      assert.deepEqual(got.C, expected.C);
    });
  }
});
