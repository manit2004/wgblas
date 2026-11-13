import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, randomFloat64Array } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { dgemmtr } from "wgblas/dgemmtr";
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
import { dgemmtrReference as stdlibReference } from "../../helpers/stdlib.js";
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
// build the f64/L3 spec by hand — same construction as test.dgemm.js.
const A64 = loadParam("A64");
const aLevel3 = A64["level-3"];
const aSpec = {
  ...A64,
  dependsOn: aLevel3.dependsOn,
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
  A: aSpec,
  lda: ldSpec,
  B: loadParam("B64"),
  ldb: ldSpec,
  C: loadParam("C64"),
  ldc: ldSpec,
};

test("dgemmtr validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) =>
      dgemmtr(
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

test("dgemmtr fixtures", async (t) => {
  await runFixtures(
    t,
    "dgemmtr",
    device,
    NUM_RUNS,
    THRESHOLD,
    fixtureSpecs,
    async (dev, a) =>
      dgemmtr(
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

// Small hand-picked scenarios loaded from edge-cases.json (shared with
// sgemmtr). All small integers — exact through the DD split, and dgemmtr has
// no division, so bit-exact equality holds over the whole of C, the untouched
// triangle included.
test("dgemmtr edge cases", async (t) => {
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
        A: new Float64Array(tc.A),
        lda: tc.lda,
        B: new Float64Array(tc.B),
        ldb: tc.ldb,
        beta: tc.beta,
        C: new Float64Array(tc.C),
        ldc: tc.ldc,
      };
      const got = await dgemmtr(
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

// Same reasoning as dgemm's: no fixture or edge case spans more than one
// 32×32 tile; 400×400 spans 13×13 and, not being a multiple of 32, also
// exercises edge-tile masking. Both uplo values get their own case since
// the triangle boundary masking differs between them.
test("dgemmtr large-n path (regression)", async (t) => {
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
              A: randomFloat64Array(aRows * aCols, -1, 1, 0),
              lda,
              B: randomFloat64Array(bRows * bCols, -1, 1, 100),
              ldb,
              beta: 0.5,
              C: randomFloat64Array(M * N, -1, 1, 200),
              ldc: N,
            };
            const got = await dgemmtr(
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

// dgemmtr skips tiles wholly outside the triangle. Fixtures (n <= 20) never
// span more than one 32-tile, so this covers that skipping, plus non-square C
// (the triangle of an m×n grid), in both layouts (column-major flips uplo
// internally). forwardFactor only checks the requested triangle, so the other
// one is also asserted to come back unchanged, bit for bit, since the GPU
// never writes it — which is where a wrong skip or mask would write.
test("dgemmtr small-tile skipping and non-square C (regression)", async (t) => {
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
                A: randomFloat64Array(aR * aC, -1, 1, 51),
                lda: cm ? aR : aC,
                B: randomFloat64Array(bR * bC, -1, 1, 52),
                ldb: cm ? bR : bC,
                beta: 0.5,
                C: randomFloat64Array(M * N, -1, 1, 53),
                ldc: cm ? M : N,
              };
              const got = await dgemmtr(
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

// k=0 (with m,n>0) collapses the operation to C := beta*C within the uplo
// triangle, and the opposite triangle must stay unchanged (dgemmtr only
// reads/writes the named triangle). Checked via forwardFactor inside the
// triangle rather than bit-exact equality — C's DD round trip caps precision
// at ~48 bits, so a plain f64 beta*C isn't bit-reproducible (as in dgemm's
// own k=0 test) — and against the C itself outside it.
test("dgemmtr zero-dimension (k=0) (regression)", async (t) => {
  const M = 4,
    N = 4,
    K = 0;

  for (const uplo of ["lower", "upper"]) {
    await t.test(`uplo=${uplo}`, async () => {
      // transA='no-transpose' stores A as M x K and transB='transpose' stores B
      // as N x K — both non-empty buffers (WebGPU rejects a zero-byte storage
      // binding), with lda/ldb at their K=0 minimum of 1.
      const a = {
        uplo,
        transA: "no-transpose",
        transB: "transpose",
        m: M,
        n: N,
        k: K,
        alpha: 1.5,
        A: new Float64Array(3),
        lda: 1,
        B: new Float64Array(3),
        ldb: 1,
        beta: 0.5,
        C: randomFloat64Array(M * N, -5, 5, uplo === "lower" ? 300 : 301),
        ldc: N,
      };
      const got = await dgemmtr(
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
      const factor = forwardFactor(got, stdlibReference(a), a);
      assert.ok(factor <= THRESHOLD, `forward factor ${factor} > ${THRESHOLD}`);
      for (let row = 0; row < M; row++)
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
test("dgemmtr edge cases (column-major)", async (t) => {
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
        A: new Float64Array(tc.A),
        lda: tc.lda,
        B: new Float64Array(tc.B),
        ldb: tc.ldb,
        beta: tc.beta,
        C: new Float64Array(tc.C),
        ldc: tc.ldc,
      };
      const got = await dgemmtr(
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

// Values the routine leaves alone come back bit-identical (see
// tests/helpers/exactness.js): full-precision inputs, which the (hi, lo)
// split would round if they went through a GPU round trip.
test("dgemmtr exactness (regression)", async (t) => {
  const full = fullPrecisionFrom(1040);
  const n = 7;
  // k = 0 still needs non-empty A/B buffers; lda at its minimum.
  for (const [label, alpha, k] of [
    ["alpha=0", 0, 3],
    ["k=0", 1.5, 0],
  ])
    await t.test(`${label}, beta=1 returns C untouched`, async () => {
      const A = k === 0 ? new Float64Array(n) : full(n * k);
      const B = k === 0 ? new Float64Array(1) : full(k * n);
      const C = full(n * n);
      const want = Float64Array.from(C);
      const got = await dgemmtr(
        device,
        "upper",
        "no-transpose",
        "no-transpose",
        n,
        n,
        k,
        alpha,
        A,
        Math.max(k, 1),
        B,
        n,
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
      const got = await dgemmtr(
        device,
        uplo,
        "no-transpose",
        "transpose",
        n,
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
test("dgemmtr IEEE special values (regression)", async () => {
  // beta = 0 must ignore NaN/Inf in C's triangle; the other triangle keeps
  // whatever it held, NaN included.
  for (const uplo of ["lower", "upper"])
    for (const n of [7, 150]) {
      const a = {
        uplo,
        transA: "no-transpose",
        transB: "no-transpose",
        m: n,
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
      const got = await dgemmtr(
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
test("dgemmtr f32 exponent range (regression)", async (t) => {
  // Out-of-range inputs and an overflowing result are separate cases: an
  // intermediate past f32's range is already Infinity here where f64 still
  // holds it, so mixed with another Infinity it can give NaN where f64
  // doesn't.
  // An out-of-range value in C's other triangle reads as Infinity even
  // though dgemmtr never touches it.
  for (const uplo of ["lower", "upper"])
    for (const n of [7, 150]) {
      await t.test(`${uplo} n=${n}: out-of-range inputs`, async () => {
        const a = {
          uplo,
          transA: "no-transpose",
          transB: "no-transpose",
          m: n,
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
        const got = await dgemmtr(
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
        assertIeeeMatch(got.C, stdlibReference(argsInF32Range(a)).C, "C", 1e-9);
      });
      await t.test(`${uplo} n=${n}: a result past f32's range`, async () => {
        const a = {
          uplo,
          transA: "no-transpose",
          transB: "no-transpose",
          m: n,
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
        const got = await dgemmtr(
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
        assertIeeeMatch(got.C, saturate(stdlibReference(a).C), "C", 1e-9);
      });
    }
});

// alpha = 0: reference BLAS (and stdlib) scales the output by beta without
// reading the other operands, so NaN or ±Infinity there can't reach it — and
// beta = 0 clears it, NaN included.
test("dgemmtr alpha = 0 reads neither A nor B (regression)", async (t) => {
  for (const uplo of ["lower", "upper"])
    for (const n of [7, 150])
      for (const beta of [0, 0.5])
        await t.test(`${uplo} n=${n} beta=${beta}`, async () => {
          const a = {
            uplo,
            transA: "no-transpose",
            transB: "no-transpose",
            m: n,
            n,
            k: n,
            alpha: 0,
            A: withValues(randomFloat64Array(n * n, -1, 1, 1), {
              [at(n, 1, 2)]: NaN,
              [at(n, 3, 0)]: -Infinity,
            }),
            lda: n,
            B: withValues(randomFloat64Array(n * n, -1, 1, 2), {
              [at(n, 2, 3)]: Infinity,
            }),
            ldb: n,
            beta,
            C: withValues(
              randomFloat64Array(n * n, -1, 1, 3),
              beta === 0 ? { [at(n, 4, 4)]: NaN } : {},
            ),
            ldc: n,
          };
          const got = await dgemmtr(
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
          assertIeeeMatch(got.C, stdlibReference(a).C, "C", 1e-9);
        });
});
