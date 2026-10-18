import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, randomFloat32Array } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { sgemm } from "wgblas/sgemm";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { forwardFactor } from "../helpers.js";
import { sgemmReference as stdlibReference } from "../../helpers/stdlib.js";
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

// Cap m/n/k for fixtures — validationSpecs allows up to 200×1000 matrices which
// makes property tests prohibitively slow. Keep validation coverage wide, fixtures fast.
const fixtureSpecs = {
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
    stdlibReference,
    forwardFactor,
  );
});

// Small hand-picked scenarios loaded from edge-cases.json. Expected output is
// computed live from stdlib, not hardcoded.
test("sgemm edge cases", async (t) => {
  for (const tc of edgeCases) {
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
      const expected = stdlibReference(a);
      assert.deepEqual(got.C, expected.C);
    });
  }
});

// The large-tile kernel (sgemm_large.wgsl) only gets selected when
// ceil(n/64)*ceil(m/64) >= LARGE_TILE_WORKGROUP_THRESHOLD (36, see
// constants.mjs) — every fixture above caps m/n/k at 20 and every
// edge-cases.json entry is <=3x3, so that path has never actually run in
// CI. 400x400 (7*7=49 workgroups) clears the threshold with margin and,
// being 400 rather than an exact multiple of 64, also exercises the large
// kernel's own edge-tile OOB masking, not just full tiles. One case per
// transA/transB combo, since each takes a genuinely different load path
// (transposed A is staged k-major in workgroup memory, for instance).
test("sgemm large-tile path (regression)", async (t) => {
  const M = 400,
    N = 400,
    K = 8;

  for (const transA of ["no-transpose", "transpose"]) {
    for (const transB of ["no-transpose", "transpose"]) {
      await t.test(`transA=${transA}, transB=${transB}`, async () => {
        // op(A) is M×K (no-transpose) or K×M (transpose); dense lda = its own column count.
        const [aRows, aCols] = transA === "no-transpose" ? [M, K] : [K, M];
        const lda = aCols;
        // op(B) is K×N (no-transpose) or N×K (transpose); dense ldb = its own column count.
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
        const expected = stdlibReference(a);
        const factor = forwardFactor(got, expected, a);
        assert.ok(
          factor <= THRESHOLD,
          `transA=${transA}, transB=${transB}: forward factor ${factor} > ${THRESHOLD}`,
        );
      });
    }
  }
});

// Transposed A (and column-major no-transpose A, which runs as transposed
// in the row-major kernel frame) reads op(A) along m with vec4 loads and
// stages it k-major. Masking those vec4s along m only matters when m isn't a
// multiple of 4 — 400 above is. m=150 (small kernel, several tiles) and
// m=398 (large kernel) with lda rounded up to a multiple of 4 keep the vec4
// path on while the last vec4 of every column straddles the m edge; k=13
// also leaves a partial k tile.
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
            const factor = forwardFactor(got, stdlibReference(a), a);
            assert.ok(
              factor <= THRESHOLD,
              `forward factor ${factor} > ${THRESHOLD}`,
            );
          });
        }
});

// k=0 (with m,n>0) makes the matrix product term vanish entirely, so the
// whole operation should collapse to C := beta*C. runEdgeCases (see
// tests/helpers/validation.js) only asserts that calls don't throw, so an
// implementation that skips applying beta to C when k=0 (or scribbles on C
// before an early return) would still pass every existing case — this test
// checks the actual output values against a bit-exact CPU computation.
test("sgemm zero-dimension (k=0) (regression)", async (t) => {
  await t.test("k=0 collapses to C := beta*C", async () => {
    const M = 4,
      N = 4,
      K = 0;
    const beta = 0.5;
    // transA='no-transpose' stores A as M x K (each of its M rows has 0
    // elements) and transB='transpose' stores B as N x K (each of its N rows
    // has 0 elements) — both non-empty buffers (WebGPU rejects a zero-byte
    // storage binding), per sgemm.mjs's own length validation, with lda/ldb
    // at their K=0 minimum of 1.
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
      assert.equal(got.C[i], Math.fround(beta * cBefore[i]), `element ${i}`);
    }
  });
});

// Small hand-picked scenarios loaded from edge-cases-column-major.json.
test("sgemm edge cases (column-major)", async (t) => {
  for (const tc of edgeCasesColumnMajor) {
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
      const expected = stdlibReference(a);
      assert.deepEqual(got.C, expected.C);
    });
  }
});
