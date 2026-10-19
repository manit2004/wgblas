import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, randomFloat32Array } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { ssyr2k } from "wgblas/ssyr2k";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { forwardFactor } from "../helpers.js";
import { ssyr2kReference as stdlibReference } from "../../helpers/stdlib.js";
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
  trans: loadParam("trans"),
  layout: loadParam("layout"),
  n: {
    ...nSpec,
    baseline: 2,
    edge: nSpec.edge.filter((e) => e.value !== -1),
    invalid: [
      ...nSpec.invalid,
      { value: -1, error: "must be non-negative", label: "negative" },
    ],
  },
  k: loadParam("k"),
  alpha: loadParam("alpha"),
  beta: loadParam("beta"),
  A: { ...aSpec, ...aSpec["level-3"], dependsOn: ["n", "k", "lda", "trans"] },
  lda: ldSpec,
  B: { ...loadParam("B"), dependsOn: ["n", "k", "ldb", "trans"] },
  ldb: ldSpec,
  C: { ...loadParam("C"), dependsOn: ["n", "ldc"] },
  ldc: ldSpec,
};

test("ssyr2k validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) =>
      ssyr2k(
        a.device,
        a.uplo,
        a.trans,
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

// Cap n/k for fixtures — validationSpecs allows up to 200×1000 matrices which
// makes property tests prohibitively slow. Keep validation coverage wide, fixtures fast.
const fixtureSpecs = {
  ...validationSpecs,
  n: { ...validationSpecs.n, range: { min: 1, max: 20 } },
  k: { ...validationSpecs.k, range: { min: 1, max: 20 } },
};

test("ssyr2k fixtures", async (t) => {
  await runFixtures(
    t,
    "ssyr2k",
    device,
    NUM_RUNS,
    THRESHOLD,
    fixtureSpecs,
    async (dev, a) =>
      ssyr2k(
        dev,
        a.uplo,
        a.trans,
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
test("ssyr2k edge cases", async (t) => {
  for (const tc of edgeCases) {
    await t.test(tc.label, async () => {
      const a = {
        uplo: tc.uplo,
        trans: tc.trans,
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
      const got = await ssyr2k(
        device,
        a.uplo,
        a.trans,
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

// k=0 makes both rank-k terms vanish entirely, so within the uplo triangle C
// should collapse to beta*C, and the opposite triangle must stay
// byte-identical (ssyr2k only reads/writes the named triangle). runEdgeCases
// (see tests/helpers/validation.js) only asserts that calls don't throw, so
// an implementation that skips applying beta within the triangle when k=0,
// or that touches the untouched triangle (e.g. via its second beta=1 pass),
// would still pass every existing case — this test checks actual
// per-element values.
// Fixtures cap n at 20 (one tile), so ssyr2k's multi-tile path — two passes
// on sgemm's kernels with whole-tile triangle skipping — only runs here:
// n=150 uses the small kernel across several tiles, n=400 the large one.
test("ssyr2k multi-tile path (regression)", async (t) => {
  const K = 9;
  for (const layout of ["row-major", "column-major"])
    for (const N of [150, 400])
      for (const uplo of ["lower", "upper"])
        for (const trans of ["no-transpose", "transpose"]) {
          await t.test(
            `${layout} n=${N} uplo=${uplo} trans=${trans}`,
            async () => {
              const cm = layout === "column-major";
              // op(A) is N×K; A is stored N×K (no-transpose) or K×N (transpose).
              const [aR, aC] = trans === "no-transpose" ? [N, K] : [K, N];
              const ld = cm ? aR : aC;
              const a = {
                layout,
                uplo,
                trans,
                n: N,
                k: K,
                alpha: 1.5,
                A: randomFloat32Array(aR * aC, -1, 1, 71),
                lda: ld,
                B: randomFloat32Array(aR * aC, -1, 1, 72),
                ldb: ld,
                beta: 0.5,
                C: randomFloat32Array(N * N, -1, 1, 73),
                ldc: N,
              };
              const got = await ssyr2k(
                device,
                a.uplo,
                a.trans,
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
              // The metric only covers the requested triangle — the other one
              // must come back byte-identical (where a wrong skip/mask would write).
              for (let i = 0; i < N; i++)
                for (let j = 0; j < N; j++) {
                  if (uplo === "lower" ? j <= i : j >= i) continue;
                  const idx = cm ? j * N + i : i * N + j;
                  assert.equal(
                    got.C[idx],
                    a.C[idx],
                    `C(${i},${j}) outside the triangle changed`,
                  );
                }
            },
          );
        }
});

test("ssyr2k zero-dimension (k=0) (regression)", async (t) => {
  const N = 4,
    K = 0;
  const beta = 0.5;

  for (const uplo of ["lower", "upper"]) {
    await t.test(`uplo=${uplo}`, async () => {
      // trans='no-transpose' stores A and B as N x K (each of their N rows
      // has 0 elements) — non-empty buffers (WebGPU rejects a zero-byte
      // storage binding), per ssyr2k.mjs's own length validation, with
      // lda/ldb at their K=0 minimum of 1.
      const a = {
        uplo,
        trans: "no-transpose",
        n: N,
        k: K,
        alpha: 1.5,
        A: new Float32Array(3),
        lda: 1,
        B: new Float32Array(3),
        ldb: 1,
        beta,
        C: randomFloat32Array(N * N, -5, 5, uplo === "lower" ? 300 : 301),
        ldc: N,
      };
      const cBefore = Float32Array.from(a.C);
      const got = await ssyr2k(
        device,
        a.uplo,
        a.trans,
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
      for (let row = 0; row < N; row++) {
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
test("ssyr2k edge cases (column-major)", async (t) => {
  for (const tc of edgeCasesColumnMajor) {
    await t.test(tc.label, async () => {
      const a = {
        layout: tc.layout,
        uplo: tc.uplo,
        trans: tc.trans,
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
      const got = await ssyr2k(
        device,
        a.uplo,
        a.trans,
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
