import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, randomFloat32Array } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { strmm } from "wgblas/strmm";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { forwardFactor } from "../helpers.js";
import { strmmReference as stdlibReference } from "../../helpers/stdlib.js";
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
  A: { ...loadParam("A"), dependsOn: ["m", "n", "lda", "side"] },
  lda: loadParam("ld"),
  B: { ...loadParam("B"), dependsOn: ["m", "n", "ldb"] },
  ldb: loadParam("ld"),
};

test("strmm validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) =>
      strmm(
        a.device,
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

test("strmm fixtures", async (t) => {
  await runFixtures(
    t,
    "strmm",
    device,
    NUM_RUNS,
    THRESHOLD,
    fixtureSpecs,
    async (dev, a) =>
      strmm(
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
      ),
    stdlibReference,
    forwardFactor,
  );
});

// Small hand-picked scenarios loaded from edge-cases.json. Expected output is
// computed live from stdlibReference, not hardcoded.
test("strmm edge cases", async (t) => {
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
        A: new Float32Array(tc.A),
        lda: tc.lda,
        B: new Float32Array(tc.B),
        ldb: tc.ldb,
      };
      const got = await strmm(
        device,
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
      );
      const expected = stdlibReference(a);
      assert.deepEqual(got.B, expected.B);
    });
  }
});

// m=0 or n=0 ties directly to B's own shape, so B is written in place over a
// vacuous region in both cases — the routine must return B completely
// untouched. runEdgeCases (see tests/helpers/validation.js) only asserts
// that calls don't throw, so an implementation that scribbles on B (e.g. via
// its triangularize/gemm passes) before or instead of returning early would
// still pass every existing case — this test checks B comes back
// byte-identical.
test("strmm zero-dimension (regression)", async (t) => {
  await t.test("m=0", async () => {
    const a = {
      side: "left",
      uplo: "lower",
      transA: "no-transpose",
      diag: "non-unit",
      m: 0,
      n: 4,
      alpha: 1.5,
      A: new Float32Array(0),
      lda: 1,
      B: randomFloat32Array(16, -5, 5, 300),
      ldb: 4,
    };
    const bBefore = Float32Array.from(a.B);
    const got = await strmm(
      device,
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
    );
    assert.deepEqual(got.B, bBefore);
  });

  await t.test("n=0", async () => {
    const a = {
      side: "left",
      uplo: "lower",
      transA: "no-transpose",
      diag: "non-unit",
      m: 4,
      n: 0,
      alpha: 1.5,
      A: new Float32Array(0),
      lda: 1,
      B: randomFloat32Array(16, -5, 5, 301),
      ldb: 4,
    };
    const bBefore = Float32Array.from(a.B);
    const got = await strmm(
      device,
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
    );
    assert.deepEqual(got.B, bBefore);
  });
});

// Small hand-picked scenarios loaded from edge-cases-column-major.json.
// Fixtures cap m/n at 20 (one tile), so the multi-tile paths only run here:
// the k-band skip (each tile walks only the nonzero band of the triangular
// operand's k range — sgemm's kTri) and vec4 loads. aOrder=150 spans several
// small tiles with ldb % 4 != 0 (scalar loads); 400 runs the large kernel
// with a 4-aligned ldb (vec4 loads). Every side/uplo/trans/layout pairing,
// since each lands the triangle on a different gemm operand and orientation.
test("strmm multi-tile path (regression)", async (t) => {
  const OTHER = 70;
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
                  A: randomFloat32Array(N * N, -1, 1, 81),
                  lda: N,
                  B: randomFloat32Array(OUTER * LD, -1, 1, 82),
                  ldb: LD,
                  layout,
                };
                const got = await strmm(
                  device,
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
                const factor = forwardFactor(got, stdlibReference(a), a);
                assert.ok(
                  factor <= THRESHOLD,
                  `forward factor ${factor} > ${THRESHOLD}`,
                );
                // Stride padding is never part of the matrix — it must come back as-is.
                for (let o = 0; o < OUTER; o++)
                  for (let p = LD - pad; p < LD; p++)
                    assert.equal(
                      got.B[o * LD + p],
                      a.B[o * LD + p],
                      `padding element ${o * LD + p} changed`,
                    );
              },
            );
          }
});

test("strmm edge cases (column-major)", async (t) => {
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
        A: new Float32Array(tc.A),
        lda: tc.lda,
        B: new Float32Array(tc.B),
        ldb: tc.ldb,
      };
      const got = await strmm(
        device,
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
      const expected = stdlibReference(a);
      assert.deepEqual(got.B, expected.B);
    });
  }
});
