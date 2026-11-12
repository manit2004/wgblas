import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, randomFloat64Array } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { dgemm } from "wgblas/dgemm";
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
  ldPadding,
} from "../../helpers/exactness.js";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { forwardFactor } from "../helpers.js";
import { dgemmReference as stdlibReference } from "../../helpers/stdlib.js";
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
// build the f64/L3 spec by hand: A64's own f64 wording and GpuMatrix dtype
// case, plus the level-3 shape with its error text fixed the same way.
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

test("dgemm validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) =>
      dgemm(
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

test("dgemm fixtures", async (t) => {
  await runFixtures(
    t,
    "dgemm",
    device,
    NUM_RUNS,
    THRESHOLD,
    fixtureSpecs,
    async (dev, a) =>
      dgemm(
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

// Small hand-picked scenarios loaded from edge-cases.json (shared with
// sgemm). All small integers — exact through the DD split, and dgemm has no
// division, so bit-exact equality holds as it does for dtrmv/dsymv/dgemv.
test("dgemm edge cases", async (t) => {
  for (const tc of edgeCases) {
    await t.test(tc.label, async () => {
      const a = {
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
      const got = await dgemm(
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

// No fixture or edge case spans more than one 32×32 tile; 400×400 spans 13×13
// and, not being a multiple of 32, also exercises edge-tile masking. One
// case per transA/transB combo, since each takes a different load path.
test("dgemm large-n path (regression)", async (t) => {
  const M = 400,
    N = 400,
    K = 8;

  for (const transA of ["no-transpose", "transpose"]) {
    for (const transB of ["no-transpose", "transpose"]) {
      await t.test(`transA=${transA}, transB=${transB}`, async () => {
        const [aRows, aCols] = transA === "no-transpose" ? [M, K] : [K, M];
        const lda = aCols;
        const [bRows, bCols] = transB === "no-transpose" ? [K, N] : [N, K];
        const ldb = bCols;

        const a = {
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
        const got = await dgemm(
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

// k=0 (with m,n>0) collapses the operation to C := beta*C — same scenario as
// sgemm's own regression test, but checked via forwardFactor rather than
// bit-exact equality: C's splitDoubleDouble round trip already caps precision
// at ~48 bits, so a plain f64 beta*C isn't bit-reproducible here the way
// Math.fround(beta*C) is for sgemm.
test("dgemm zero-dimension (k=0) (regression)", async (t) => {
  await t.test("k=0 collapses to C := beta*C", async () => {
    const M = 4,
      N = 4,
      K = 0;
    // transA='no-transpose' stores A as M x K and transB='transpose' stores B
    // as N x K — both non-empty buffers (WebGPU rejects a zero-byte storage
    // binding), with lda/ldb at their K=0 minimum of 1.
    const a = {
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
      C: randomFloat64Array(M * N, -5, 5, 300),
      ldc: N,
    };
    const got = await dgemm(
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
    const factor = forwardFactor(got, stdlibReference(a), a);
    assert.ok(factor <= THRESHOLD, `forward factor ${factor} > ${THRESHOLD}`);
  });
});

// Small hand-picked scenarios loaded from edge-cases-column-major.json.
test("dgemm edge cases (column-major)", async (t) => {
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
        A: new Float64Array(tc.A),
        lda: tc.lda,
        B: new Float64Array(tc.B),
        ldb: tc.ldb,
        beta: tc.beta,
        C: new Float64Array(tc.C),
        ldc: tc.ldc,
      };
      const got = await dgemm(
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

// Values the routine leaves alone come back bit-identical (see
// tests/helpers/exactness.js): full-precision inputs, which the (hi, lo)
// split would round if they went through a GPU round trip.
test("dgemm exactness (regression)", async (t) => {
  const full = fullPrecisionFrom(1030);
  const n = 6;
  // k = 0 still needs non-empty A/B buffers; lda at its minimum.
  for (const [label, alpha, k] of [
    ["alpha=0", 0, n],
    ["k=0", 1.5, 0],
  ])
    await t.test(`${label}, beta=1 returns C untouched`, async () => {
      const A = k === 0 ? new Float64Array(n) : full(n * k);
      const B = k === 0 ? new Float64Array(1) : full(k * n);
      const C = full(n * n);
      const want = Float64Array.from(C);
      const got = await dgemm(
        device,
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
  await t.test("ldc padding", async () => {
    const [m, k, ldc] = [4, 2, n + 3];
    const C = full(m * ldc);
    const got = await dgemm(
      device,
      "no-transpose",
      "no-transpose",
      m,
      n,
      k,
      1.5,
      full(m * k),
      k,
      full(k * n),
      n,
      0.5,
      C,
      ldc,
    );
    assertBitIdentical(got.C, C, ldPadding(m, n, ldc), "C");
  });
});

// ±Infinity and NaN reach the outputs as in real f64 (stdlib): no Inf turned
// into NaN by a double-double error term (see tests/helpers/specials.js).
test("dgemm IEEE special values (regression)", async () => {
  // beta = 0 must ignore NaN/Inf already in C; n = 150 spans several tiles.
  for (const n of [7, 150]) {
    const a = {
      transA: "no-transpose",
      transB: "no-transpose",
      m: n,
      n,
      k: n,
      alpha: 1.5,
      A: withValues(values(n * n, 1), { [at(n, 1, 2)]: Infinity }),
      lda: n,
      B: withValues(values(n * n, 2), { [at(n, 3, 4)]: NaN }),
      ldb: n,
      beta: 0,
      C: withValues(values(n * n, 3), { 0: NaN, 5: Infinity }),
      ldc: n,
    };
    const got = await dgemm(
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
    const want = stdlibReference({ ...a, C: new Float64Array(n * n) });
    assertIeeeMatch(got.C, want.C, `n=${n} C`);
  }
});

// Double-double has f64's precision but f32's exponent range (its leading
// part is an f32): a double beyond ±3.4e38 reads as ±Infinity, one below
// f32's range as 0, and a result past it overflows to ±Infinity — where real
// f64 stays finite. Pinned against stdlib on the inputs as double-double sees
// them (tests/helpers/specials.js), so a change in that behaviour shows.
test("dgemm f32 exponent range (regression)", async (t) => {
  // Out-of-range inputs and an overflowing result are separate cases: an
  // intermediate past f32's range is already Infinity here where f64 still
  // holds it, so mixed with another Infinity it can give NaN where f64
  // doesn't.
  for (const n of [7, 150]) {
    await t.test(`n=${n}: out-of-range inputs`, async () => {
      const a = {
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
        B: withValues(values(n * n, 2), { [at(n, 5, 1)]: -1e-50 }),
        ldb: n,
        beta: 0.5,
        C: withValues(values(n * n, 3), { [at(n, 6, 6)]: -1e300 }),
        ldc: n,
      };
      const got = await dgemm(
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
      assertIeeeMatch(got.C, stdlibReference(argsInF32Range(a)).C, "C", 1e-9);
    });
    await t.test(`n=${n}: a result past f32's range`, async () => {
      const a = {
        transA: "no-transpose",
        transB: "no-transpose",
        m: n,
        n,
        k: n,
        alpha: 10,
        A: withValues(values(n * n, 1), { [at(n, 3, 3)]: 3e38 }),
        lda: n,
        B: withValues(values(n * n, 2), { [at(n, 5, 1)]: -1e-50 }),
        ldb: n,
        beta: 0.5,
        C: values(n * n, 3),
        ldc: n,
      };
      const got = await dgemm(
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
      assertIeeeMatch(got.C, saturate(stdlibReference(a).C), "C", 1e-9);
    });
  }
});
