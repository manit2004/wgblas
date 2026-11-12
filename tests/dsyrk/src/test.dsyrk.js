import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, randomFloat64Array } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { dsyrk } from "wgblas/dsyrk";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { forwardFactor } from "../helpers.js";
import { dsyrkReference as stdlibReference } from "../../helpers/stdlib.js";
import {
  splitDoubleDouble,
  mergeDoubleDouble,
} from "../../../src/util/f64.mjs";
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

// What the GPU hands back for a cell it never writes: C's own value after the
// split into (hi, lo) f32 halves and the merge back — exact for any double
// with ≤ 48 significant bits, a rounding for full-precision random doubles.
function ddRoundTrip(x) {
  const { hi, lo } = splitDoubleDouble(x);
  return mergeDoubleDouble(hi, lo);
}

// A's "level-3" override isn't run through derive64 (it's a nested key), so
// build the f64/L3 spec by hand — same construction as test.dgemmtr.js.
const A64 = loadParam("A64");
const aLevel3 = A64["level-3"];
const aSpec = {
  ...A64,
  edge: aLevel3.edge,
  invalid: [
    ...aLevel3.invalid.map((entry) => ({
      ...entry,
      error:
        typeof entry.error === "string"
          ? entry.error.replace("Float32Array", "Float64Array")
          : entry.error,
    })),
    ...A64.invalid.filter((entry) => entry.scenario === "wrongDtypeGpuMatrix"),
  ],
};

const nSpec = loadParam("n");
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
  A: { ...aSpec, dependsOn: ["n", "k", "lda", "trans"] },
  lda: ldSpec,
  C: { ...loadParam("C64"), dependsOn: ["n", "ldc"] },
  ldc: ldSpec,
};

test("dsyrk validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) =>
      dsyrk(
        a.device,
        a.uplo,
        a.trans,
        a.n,
        a.k,
        a.alpha,
        a.A,
        a.lda,
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

test("dsyrk fixtures", async (t) => {
  await runFixtures(
    t,
    "dsyrk",
    device,
    NUM_RUNS,
    THRESHOLD,
    fixtureSpecs,
    async (dev, a) =>
      dsyrk(
        dev,
        a.uplo,
        a.trans,
        a.n,
        a.k,
        a.alpha,
        a.A,
        a.lda,
        a.beta,
        a.C,
        a.ldc,
        a.layout,
      ),
    stdlibReference,
    forwardFactor,
  );
});

// Small hand-picked scenarios loaded from edge-cases.json (shared with
// ssyrk). All small integers/halves — exact through the DD split, and dsyrk
// has no division, so bit-exact equality holds over the whole of C, the
// untouched triangle included.
test("dsyrk edge cases", async (t) => {
  for (const tc of edgeCases) {
    await t.test(tc.label, async () => {
      const a = {
        uplo: tc.uplo,
        trans: tc.trans,
        n: tc.n,
        k: tc.k,
        alpha: tc.alpha,
        A: new Float64Array(tc.A),
        lda: tc.lda,
        beta: tc.beta,
        C: new Float64Array(tc.C),
        ldc: tc.ldc,
      };
      const got = await dsyrk(
        device,
        a.uplo,
        a.trans,
        a.n,
        a.k,
        a.alpha,
        a.A,
        a.lda,
        a.beta,
        a.C,
        a.ldc,
      );
      const expected = stdlibReference(a);
      assert.deepEqual(got.C, expected.C);
    });
  }
});

// Fixtures cap n at 20 (one tile), so dsyrk's multi-tile path — dgemm's
// kernel with whole-tile triangle skipping — only runs here, at n=150 and
// n=400 (5×5 and 13×13 tiles, neither a multiple of 32).
test("dsyrk multi-tile path (regression)", async (t) => {
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
                A: randomFloat64Array(aR * aC, -1, 1, 61),
                lda: ld,
                beta: 0.5,
                C: randomFloat64Array(N * N, -1, 1, 62),
                ldc: N,
              };
              const got = await dsyrk(
                device,
                a.uplo,
                a.trans,
                a.n,
                a.k,
                a.alpha,
                a.A,
                a.lda,
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
              // must come back unchanged (where a wrong skip/mask would write),
              // up to C's own DD round trip, since the GPU never writes it.
              const cRoundTrip = ddRoundTrip(a.C);
              for (let i = 0; i < N; i++)
                for (let j = 0; j < N; j++) {
                  if (uplo === "lower" ? j <= i : j >= i) continue;
                  const idx = cm ? j * N + i : i * N + j;
                  assert.equal(
                    got.C[idx],
                    cRoundTrip[idx],
                    `C(${i},${j}) outside the triangle changed`,
                  );
                }
            },
          );
        }
});

// k=0 makes the rank-k term vanish entirely, so within the uplo triangle C
// should collapse to beta*C, and the opposite triangle must stay unchanged
// (dsyrk only reads/writes the named triangle). runEdgeCases (see
// tests/helpers/validation.js) only asserts that calls don't throw, so this
// test checks actual per-element values: via forwardFactor inside the
// triangle (C's DD round trip caps precision at ~48 bits, so a plain f64
// beta*C isn't bit-reproducible — as in dgemmtr's k=0 test) and against the
// round-tripped C outside it.
test("dsyrk zero-dimension (k=0) (regression)", async (t) => {
  const N = 4,
    K = 0;
  const beta = 0.5;

  for (const uplo of ["lower", "upper"]) {
    await t.test(`uplo=${uplo}`, async () => {
      // trans='no-transpose' stores A as N x K (each of its N rows has 0
      // elements) — a non-empty buffer (WebGPU rejects a zero-byte storage
      // binding), per dsyrk.mjs's own length validation, with lda at its
      // K=0 minimum of 1.
      const a = {
        uplo,
        trans: "no-transpose",
        n: N,
        k: K,
        alpha: 1.5,
        A: new Float64Array(3),
        lda: 1,
        beta,
        C: randomFloat64Array(N * N, -5, 5, uplo === "lower" ? 300 : 301),
        ldc: N,
      };
      const got = await dsyrk(
        device,
        a.uplo,
        a.trans,
        a.n,
        a.k,
        a.alpha,
        a.A,
        a.lda,
        a.beta,
        a.C,
        a.ldc,
      );
      const factor = forwardFactor(got, stdlibReference(a), a);
      assert.ok(factor <= THRESHOLD, `forward factor ${factor} > ${THRESHOLD}`);
      const cRoundTrip = ddRoundTrip(a.C);
      for (let row = 0; row < N; row++)
        for (let col = 0; col < N; col++) {
          const inTriangle = uplo === "lower" ? col <= row : col >= row;
          if (inTriangle) continue;
          const i = row * N + col;
          assert.equal(got.C[i], cRoundTrip[i], `row=${row}, col=${col}`);
        }
    });
  }
});

// Small hand-picked scenarios loaded from edge-cases-column-major.json.
test("dsyrk edge cases (column-major)", async (t) => {
  for (const tc of edgeCasesColumnMajor) {
    await t.test(tc.label, async () => {
      const a = {
        layout: tc.layout,
        uplo: tc.uplo,
        trans: tc.trans,
        n: tc.n,
        k: tc.k,
        alpha: tc.alpha,
        A: new Float64Array(tc.A),
        lda: tc.lda,
        beta: tc.beta,
        C: new Float64Array(tc.C),
        ldc: tc.ldc,
      };
      const got = await dsyrk(
        device,
        a.uplo,
        a.trans,
        a.n,
        a.k,
        a.alpha,
        a.A,
        a.lda,
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
