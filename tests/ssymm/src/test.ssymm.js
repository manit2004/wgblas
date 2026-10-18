import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, randomFloat32Array } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { ssymm } from "wgblas/ssymm";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { forwardFactor } from "../helpers.js";
import { ssymmReference as stdlibReference } from "../../helpers/stdlib.js";
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
  A: { ...loadParam("A"), dependsOn: ["m", "n", "lda", "side"] },
  lda: loadParam("ld"),
  B: { ...loadParam("B"), dependsOn: ["m", "n", "ldb"] },
  ldb: loadParam("ld"),
  C: loadParam("C"),
  ldc: loadParam("ld"),
};

test("ssymm validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) =>
      ssymm(
        a.device,
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
      ),
    { device },
  );
});

// Cap m/n for fixtures — validationSpecs allows up to 200x1000 matrices which
// makes property tests prohibitively slow. Keep validation coverage wide, fixtures fast.
const fixtureSpecs = {
  ...validationSpecs,
  m: { ...validationSpecs.m, range: { min: 1, max: 20 } },
  n: { ...validationSpecs.n, range: { min: 1, max: 20 } },
};

test("ssymm fixtures", async (t) => {
  await runFixtures(
    t,
    "ssymm",
    device,
    NUM_RUNS,
    THRESHOLD,
    fixtureSpecs,
    async (dev, a) =>
      ssymm(
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
      ),
    stdlibReference,
    forwardFactor,
  );
});

// Small hand-picked scenarios loaded from edge-cases.json. Expected output is
// computed live from stdlibReference, not hardcoded.
test("ssymm edge cases", async (t) => {
  for (const tc of edgeCases) {
    await t.test(tc.label, async () => {
      const a = {
        side: tc.side,
        uplo: tc.uplo,
        m: tc.m,
        n: tc.n,
        alpha: tc.alpha,
        A: new Float32Array(tc.A),
        lda: tc.lda,
        B: new Float32Array(tc.B),
        ldb: tc.ldb,
        beta: tc.beta,
        C: new Float32Array(tc.C),
        ldc: tc.ldc,
      };
      const got = await ssymm(
        device,
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
      );
      const expected = stdlibReference(a);
      assert.deepEqual(got.C, expected.C);
    });
  }
});

// m=0 or n=0 ties directly to C's own shape, so the touched region is
// vacuous in both cases — the routine must return C completely untouched,
// not scaled by beta over zero elements (nothing distinguishes those here).
// runEdgeCases (see tests/helpers/validation.js) only asserts that calls
// don't throw, so an implementation that scribbles on C (e.g. via its
// symmetrize/gemm passes) before or instead of returning early would still
// pass every existing case — this test checks C comes back byte-identical.
test("ssymm zero-dimension (regression)", async (t) => {
  await t.test("m=0", async () => {
    const a = {
      side: "left",
      uplo: "lower",
      m: 0,
      n: 4,
      alpha: 1.5,
      A: new Float32Array(0),
      lda: 1,
      B: new Float32Array(0),
      ldb: 1,
      beta: 0.5,
      C: randomFloat32Array(16, -5, 5, 300),
      ldc: 4,
    };
    const cBefore = Float32Array.from(a.C);
    const got = await ssymm(
      device,
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
    );
    assert.deepEqual(got.C, cBefore);
  });

  await t.test("n=0", async () => {
    const a = {
      side: "left",
      uplo: "lower",
      m: 4,
      n: 0,
      alpha: 1.5,
      A: new Float32Array(0),
      lda: 1,
      B: new Float32Array(0),
      ldb: 1,
      beta: 0.5,
      C: randomFloat32Array(16, -5, 5, 301),
      ldc: 4,
    };
    const cBefore = Float32Array.from(a.C);
    const got = await ssymm(
      device,
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
    );
    assert.deepEqual(got.C, cBefore);
  });
});

// Small hand-picked scenarios loaded from edge-cases-column-major.json.
// Fixtures cap m/n at 20 (one tile), so ssymm's vec4 loads and multi-tile
// grid only run here: aOrder=150 spans several small tiles with ld % 4 != 0
// (scalar loads); 400 runs the large kernel with 4-aligned strides (vec4).
test("ssymm multi-tile path (regression)", async (t) => {
  const OTHER = 70;
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
              A: randomFloat32Array(N * N, -1, 1, 91),
              lda: N,
              B: randomFloat32Array(OUTER * LD, -1, 1, 92),
              ldb: LD,
              beta: 0.5,
              C: randomFloat32Array(OUTER * LD, -1, 1, 93),
              ldc: LD,
              layout,
            };
            const got = await ssymm(
              device,
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
            const factor = forwardFactor(got, stdlibReference(a), a);
            assert.ok(
              factor <= THRESHOLD,
              `forward factor ${factor} > ${THRESHOLD}`,
            );
            // Stride padding is never part of the matrix — it must come back as-is.
            for (let o = 0; o < OUTER; o++)
              for (let p = LD - pad; p < LD; p++)
                assert.equal(
                  got.C[o * LD + p],
                  a.C[o * LD + p],
                  `padding element ${o * LD + p} changed`,
                );
          });
        }
});

test("ssymm edge cases (column-major)", async (t) => {
  for (const tc of edgeCasesColumnMajor) {
    await t.test(tc.label, async () => {
      const a = {
        layout: tc.layout,
        side: tc.side,
        uplo: tc.uplo,
        m: tc.m,
        n: tc.n,
        alpha: tc.alpha,
        A: new Float32Array(tc.A),
        lda: tc.lda,
        B: new Float32Array(tc.B),
        ldb: tc.ldb,
        beta: tc.beta,
        C: new Float32Array(tc.C),
        ldc: tc.ldc,
      };
      const got = await ssymm(
        device,
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
      const expected = stdlibReference(a);
      assert.deepEqual(got.C, expected.C);
    });
  }
});
