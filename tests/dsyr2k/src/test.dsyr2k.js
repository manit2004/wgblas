import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, randomFloat64Array } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { dsyr2k } from "wgblas/dsyr2k";
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
  offTriangle,
} from "../../helpers/exactness.js";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { forwardFactor } from "../helpers.js";
import { dsyr2kReference as stdlibReference } from "../../helpers/stdlib.js";
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

// A's "level-3" override isn't run through derive64 (it's a nested key), so
// build the f64/L3 spec by hand — same construction as test.dsyrk.js.
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
  B: { ...loadParam("B64"), dependsOn: ["n", "k", "ldb", "trans"] },
  ldb: ldSpec,
  C: { ...loadParam("C64"), dependsOn: ["n", "ldc"] },
  ldc: ldSpec,
};

test("dsyr2k validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) =>
      dsyr2k(
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

test("dsyr2k fixtures", async (t) => {
  await runFixtures(
    t,
    "dsyr2k",
    device,
    NUM_RUNS,
    THRESHOLD,
    fixtureSpecs,
    async (dev, a) =>
      dsyr2k(
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

// Small hand-picked scenarios loaded from edge-cases.json (shared with
// ssyr2k). All small integers — exact through the DD split, and dsyr2k has
// no division, so bit-exact equality holds over the whole of C, the
// untouched triangle included.
test("dsyr2k edge cases", async (t) => {
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
        B: new Float64Array(tc.B),
        ldb: tc.ldb,
        beta: tc.beta,
        C: new Float64Array(tc.C),
        ldc: tc.ldc,
      };
      const got = await dsyr2k(
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

// Fixtures cap n at 20 (one tile), so dsyr2k's multi-tile path — two passes
// on dgemm's kernel with whole-tile triangle skipping — only runs here, at
// n=150 and n=400 (5×5 and 13×13 tiles, neither a multiple of 32).
test("dsyr2k multi-tile path (regression)", async (t) => {
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
                A: randomFloat64Array(aR * aC, -1, 1, 71),
                lda: ld,
                B: randomFloat64Array(aR * aC, -1, 1, 72),
                ldb: ld,
                beta: 0.5,
                C: randomFloat64Array(N * N, -1, 1, 73),
                ldc: N,
              };
              const got = await dsyr2k(
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
              // must come back unchanged (where a wrong skip/mask would write),
              // bit for bit, since the GPU never writes it.
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

// k=0 makes both rank-k terms vanish entirely, so within the uplo triangle C
// should collapse to beta*C, and the opposite triangle must stay unchanged
// (dsyr2k only reads/writes the named triangle, its second beta=1 pass
// included). runEdgeCases (see tests/helpers/validation.js) only asserts
// that calls don't throw, so this test checks actual per-element values:
// via forwardFactor inside the triangle (C's DD round trip caps precision at
// ~48 bits, so a plain f64 beta*C isn't bit-reproducible — as in dsyrk's k=0
// test) and against the C itself outside it.
test("dsyr2k zero-dimension (k=0) (regression)", async (t) => {
  const N = 4,
    K = 0;
  const beta = 0.5;

  for (const uplo of ["lower", "upper"]) {
    await t.test(`uplo=${uplo}`, async () => {
      // trans='no-transpose' stores A and B as N x K (each of their N rows
      // has 0 elements) — non-empty buffers (WebGPU rejects a zero-byte
      // storage binding), per dsyr2k.mjs's own length validation, with
      // lda/ldb at their K=0 minimum of 1.
      const a = {
        uplo,
        trans: "no-transpose",
        n: N,
        k: K,
        alpha: 1.5,
        A: new Float64Array(3),
        lda: 1,
        B: new Float64Array(3),
        ldb: 1,
        beta,
        C: randomFloat64Array(N * N, -5, 5, uplo === "lower" ? 300 : 301),
        ldc: N,
      };
      const got = await dsyr2k(
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
      const factor = forwardFactor(got, stdlibReference(a), a);
      assert.ok(factor <= THRESHOLD, `forward factor ${factor} > ${THRESHOLD}`);
      for (let row = 0; row < N; row++)
        for (let col = 0; col < N; col++) {
          const inTriangle = uplo === "lower" ? col <= row : col >= row;
          if (inTriangle) continue;
          const i = row * N + col;
          assert.equal(got.C[i], a.C[i], `row=${row}, col=${col}`);
        }
    });
  }
});

// Small hand-picked scenarios loaded from edge-cases-column-major.json.
test("dsyr2k edge cases (column-major)", async (t) => {
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
        B: new Float64Array(tc.B),
        ldb: tc.ldb,
        beta: tc.beta,
        C: new Float64Array(tc.C),
        ldc: tc.ldc,
      };
      const got = await dsyr2k(
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

// Values the routine leaves alone come back bit-identical (see
// tests/helpers/exactness.js): full-precision inputs, which the (hi, lo)
// split would round if they went through a GPU round trip.
test("dsyr2k exactness (regression)", async (t) => {
  const full = fullPrecisionFrom(1060);
  const n = 7;
  // k = 0 still needs non-empty A/B buffers; lda/ldb at their minimum.
  for (const [label, alpha, k] of [
    ["alpha=0", 0, 3],
    ["k=0", 1.5, 0],
  ])
    await t.test(`${label}, beta=1 returns C untouched`, async () => {
      const ab = () => (k === 0 ? new Float64Array(n) : full(n * k));
      const C = full(n * n);
      const want = Float64Array.from(C);
      const got = await dsyr2k(
        device,
        "upper",
        "no-transpose",
        n,
        k,
        alpha,
        ab(),
        Math.max(k, 1),
        ab(),
        Math.max(k, 1),
        1,
        C,
        n,
      );
      assert.equal(got.C, C);
      assertBitIdentical(got.C, want, all(n * n), "C");
    });
  for (const uplo of ["lower", "upper"])
    await t.test(`the unreferenced triangle (${uplo})`, async () => {
      const C = full(n * n);
      const got = await dsyr2k(
        device,
        uplo,
        "no-transpose",
        n,
        3,
        1.5,
        full(n * 3),
        3,
        full(n * 3),
        3,
        0.5,
        C,
        n,
      );
      assertBitIdentical(got.C, C, offTriangle(n, uplo), "C");
    });
});

// ±Infinity and NaN reach the outputs as in real f64 (stdlib): no Inf turned
// into NaN by a double-double error term (see tests/helpers/specials.js).
test("dsyr2k IEEE special values (regression)", async () => {
  // beta = 0 must ignore NaN/Inf in C's triangle; the other triangle keeps
  // whatever it held, NaN included.
  for (const uplo of ["lower", "upper"])
    for (const n of [7, 150]) {
      const a = {
        uplo,
        trans: "no-transpose",
        n,
        k: n,
        alpha: 1.5,
        A: withValues(values(n * n, 1), { [at(n, 4, 2)]: Infinity }),
        lda: n,
        B: withValues(values(n * n, 2), { [at(n, 3, 1)]: NaN }),
        ldb: n,
        beta: 0,
        C: withValues(values(n * n, 3), {
          [at(n, 2, 2)]: NaN,
          [at(n, 0, n - 1)]: NaN,
          [at(n, n - 1, 0)]: Infinity,
        }),
        ldc: n,
      };
      const got = await dsyr2k(
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
      // The reference sees C's triangle zeroed (beta = 0 ignores it), the rest as given.
      const C0 = Float64Array.from(a.C);
      for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++)
          if (uplo === "lower" ? j <= i : j >= i) C0[at(n, i, j)] = 0;
      assertIeeeMatch(
        got.C,
        stdlibReference({ ...a, C: C0 }).C,
        `${uplo} n=${n} C`,
      );
    }
});

// Double-double has f64's precision but f32's exponent range (its leading
// part is an f32): a double beyond ±3.4e38 reads as ±Infinity, one below
// f32's range as 0, and a result past it overflows to ±Infinity — where real
// f64 stays finite. Pinned against stdlib on the inputs as double-double sees
// them (tests/helpers/specials.js), so a change in that behaviour shows.
test("dsyr2k f32 exponent range (regression)", async (t) => {
  // Out-of-range inputs and an overflowing result are separate cases: an
  // intermediate past f32's range is already Infinity here where f64 still
  // holds it, so mixed with another Infinity it can give NaN where f64
  // doesn't.
  // An out-of-range value in C's other triangle reads as Infinity even
  // though dsyr2k never touches it.
  for (const uplo of ["lower", "upper"])
    for (const n of [7, 150]) {
      await t.test(`${uplo} n=${n}: out-of-range inputs`, async () => {
        const a = {
          uplo,
          trans: "no-transpose",
          n,
          k: n,
          alpha: 1.5,
          A: withValues(values(n * n, 1), {
            [at(n, 4, 2)]: 1e300,
            [at(n, 5, 5)]: 1e-50,
          }),
          lda: n,
          B: values(n * n, 2),
          ldb: n,
          beta: 0.5,
          C: withValues(values(n * n, 3), {
            [at(n, 0, n - 1)]: 1e300,
            [at(n, n - 1, 0)]: -1e300,
          }),
          ldc: n,
        };
        const got = await dsyr2k(
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
        assertIeeeMatch(got.C, stdlibReference(argsInF32Range(a)).C, "C", 1e-9);
      });
      await t.test(`${uplo} n=${n}: a result past f32's range`, async () => {
        const a = {
          uplo,
          trans: "no-transpose",
          n,
          k: n,
          alpha: 10,
          A: withValues(values(n * n, 1), { [at(n, 3, 3)]: 3e38 }),
          lda: n,
          B: values(n * n, 2),
          ldb: n,
          beta: 0.5,
          C: values(n * n, 3),
          ldc: n,
        };
        const got = await dsyr2k(
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
        assertIeeeMatch(got.C, saturate(stdlibReference(a).C), "C", 1e-9);
      });
    }
});
