import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, randomFloat64Array } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { dgemm } from "wgblas/dgemm";
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

// Same reasoning as sgemm's: the large-tile kernel only runs once
// ceil(n/64)*ceil(m/64) >= LARGE_TILE_WORKGROUP_THRESHOLD, which no fixture
// or edge case reaches. 400×400 clears it and, not being a multiple of 64,
// also exercises edge-tile masking. One case per transA/transB combo, since
// each takes a different load path.
test("dgemm large-tile path (regression)", async (t) => {
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
