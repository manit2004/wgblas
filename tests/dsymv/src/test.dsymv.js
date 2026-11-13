import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, randomFloat64Array } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { dsymv } from "wgblas/dsymv";
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
  gaps,
} from "../../helpers/exactness.js";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { forwardFactor } from "../helpers.js";
import { dsymvReference as stdlibReference } from "../../helpers/stdlib.js";
import edgeCases from "../edge-cases.json" with { type: "json" };
import edgeCasesColumnMajor from "../edge-cases-column-major.json" with { type: "json" };

const NUM_RUNS = 100;
// Forward-error cap, pinned to the high-performance/NVIDIA-calibrated bound
// (see tests/dger/src/test.dger.js) — dsymv does the same full DD tree
// reduction per row as dgemv (plus an extra alpha*dot+beta*y combine), so
// like the other arithmetic f64 routines this is not expected to clear on
// the low-power/Intel backend.
const THRESHOLD = 5;

let device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => {
  cleanup();
});

//   n: negative throws (not a noop) — move n=-1 from edge to invalid
//   A: square n×n, no separate m — dependsOn ["n","lda"] instead of ["m","n","lda"]
//   x/y: size depends only on n, not trans/m — dependsOn ["n","inc*"]
const nSpec = loadParam("n");
const validationSpecs = {
  device: loadParam("device"),
  uplo: loadParam("uplo"),
  n: {
    ...nSpec,
    edge: nSpec.edge.filter((e) => e.value !== -1),
    invalid: [
      ...nSpec.invalid,
      { value: -1, error: "n must be non-negative", label: "negative" },
    ],
  },
  alpha: loadParam("alpha64"),
  A: { ...loadParam("A64"), dependsOn: ["n", "lda"] },
  lda: loadParam("lda"),
  x: { ...loadParam("x64"), dependsOn: ["n", "incx"] },
  incx: loadParam("incx"),
  beta: loadParam("beta64"),
  y: { ...loadParam("y64"), dependsOn: ["n", "incy"] },
  incy: loadParam("incy"),
  layout: loadParam("layout"),
};

test("dsymv validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) =>
      dsymv(
        a.device,
        a.uplo,
        a.n,
        a.alpha,
        a.A,
        a.lda,
        a.x,
        a.incx,
        a.beta,
        a.y,
        a.incy,
        a.layout,
      ),
    { device },
  );
});

// Cap n: validationSpecs allows up to 1000 but n×n matrices at that size make property tests slow.
const fixtureSpecs = {
  ...validationSpecs,
  n: { ...validationSpecs.n, range: { min: 1, max: 50 } },
};

test("dsymv fixtures", async (t) => {
  await runFixtures(
    t, // node:test context
    "dsymv", // routine name — used in the diagnostic label
    device, // WebGPU device instance
    NUM_RUNS, // 100 random inputs
    THRESHOLD, // max allowed forward error factor
    fixtureSpecs, // param specs used to generate random inputs (n capped at 50 for speed)
    async (dev, a) =>
      dsymv(
        dev,
        a.uplo,
        a.n,
        a.alpha,
        a.A,
        a.lda,
        a.x,
        a.incx,
        a.beta,
        a.y,
        a.incy,
        a.layout,
      ), // GPU call
    stdlibReference, // CPU reference
    forwardFactor, // |err| / (eps * forward bound) — see helpers.js
  );
});

// Small hand-picked scenarios loaded from edge-cases.json. Expected output is
// computed live from stdlib, not hardcoded.
test("dsymv edge cases", async (t) => {
  for (const tc of edgeCases) {
    await t.test(tc.label, async () => {
      const a = {
        uplo: tc.uplo, // which triangle of the symmetric matrix is stored
        n: tc.n, // matrix dimension (n×n)
        alpha: tc.alpha, // scale factor for A·x
        A: new Float64Array(tc.A), // matrix, row-major, size n*lda
        lda: tc.lda, // leading dimension (row stride) of A
        x: new Float64Array(tc.x), // input vector
        incx: tc.incx, // stride through x
        beta: tc.beta, // scale factor applied to existing y before accumulating
        y: new Float64Array(tc.y), // input/output vector
        incy: tc.incy, // stride through y
      };
      const got = await dsymv(
        device, // GPU device
        a.uplo, // which triangle of the symmetric matrix is stored
        a.n, // matrix dimension (n×n)
        a.alpha, // scale factor for A·x
        a.A, // matrix, row-major, size n*lda
        a.lda, // leading dimension (row stride) of A
        a.x, // input vector
        a.incx, // stride through x
        a.beta, // scale factor applied to existing y before accumulating
        a.y, // input/output vector
        a.incy, // stride through y
      );
      const expected = stdlibReference(a);
      assert.deepEqual(got.y, expected.y);
    });
  }
});

// Zero-dimension edge case: n ties A's order, x's length, and y's length
// together, so n=0 is fully vacuous. Guards that y comes back
// byte-for-byte untouched.
test("dsymv zero-dimension (regression)", async (t) => {
  await t.test("n=0", async () => {
    const yBefore = randomFloat64Array(4, -1, 1, 9201);
    const y = Float64Array.from(yBefore);
    const got = await dsymv(
      device,
      "lower",
      0, // n=0
      1.5,
      new Float64Array(0), // A: 0x0 has no elements
      1,
      new Float64Array(0), // x: length n=0
      1,
      0.5, // beta != 0, != 1
      y,
      1,
    );
    assert.deepEqual(got.y, yBefore);
  });
});

// Fixtures stay below TILE_KERNEL_MIN_N (256), so the tiled kernel and its
// reduce_partials_f64 pass never run there. n=257 leaves a one-element last
// block, n=600 a ragged one (600 = 18·32 + 24) across 171 tiles; strided x
// and y are read in place. A is random off the stored triangle too, so
// reading outside it would show. beta=0 must ignore y's prior value (NaN).
test("dsymv tiled kernel (regression)", async (t) => {
  for (const [N, inc, beta] of [
    [256, 1, 0.75],
    [257, 1, 0.75],
    [600, 3, 0.75],
    [600, 1, 0],
  ])
    for (const layout of ["row-major", "column-major"])
      for (const uplo of ["lower", "upper"]) {
        await t.test(
          `${layout} ${uplo} n=${N} inc=${inc} beta=${beta}`,
          async () => {
            const lda = N + 3;
            const y = randomFloat64Array((N - 1) * inc + 1, -1, 1, 507);
            if (beta === 0) for (let i = 0; i < N; i++) y[i * inc] = NaN;
            const a = {
              uplo,
              n: N,
              alpha: 1.5,
              A: randomFloat64Array(N * lda, -1, 1, 501),
              lda,
              x: randomFloat64Array((N - 1) * inc + 1, -1, 1, 503),
              incx: inc,
              beta,
              y,
              incy: inc,
              layout,
            };
            const got = await dsymv(
              device,
              a.uplo,
              a.n,
              a.alpha,
              a.A,
              a.lda,
              a.x,
              a.incx,
              a.beta,
              a.y,
              a.incy,
              a.layout,
            );
            // The reference and bound see y = 0 where beta = 0 discards NaN.
            const aRef =
              beta === 0 ? { ...a, y: new Float64Array(y.length) } : a;
            const factor = forwardFactor(got, stdlibReference(aRef), aRef);
            assert.ok(
              factor <= THRESHOLD,
              `forward factor ${factor} > ${THRESHOLD}`,
            );
            for (let i = 0; i < y.length; i++)
              if (i % inc !== 0)
                assert.equal(got.y[i], y[i], `y gap element ${i} changed`);
          },
        );
      }
});

// Small hand-picked scenarios loaded from edge-cases-column-major.json.
test("dsymv edge cases (column-major)", async (t) => {
  for (const tc of edgeCasesColumnMajor) {
    await t.test(tc.label, async () => {
      const a = {
        uplo: tc.uplo, // which triangle of the symmetric matrix is stored
        n: tc.n, // matrix dimension (n×n)
        alpha: tc.alpha, // scale factor for A·x
        A: new Float64Array(tc.A), // matrix, column-major, size n*lda
        lda: tc.lda, // leading dimension (column stride) of A
        x: new Float64Array(tc.x), // input vector
        incx: tc.incx, // stride through x
        beta: tc.beta, // scale factor applied to existing y before accumulating
        y: new Float64Array(tc.y), // input/output vector
        incy: tc.incy, // stride through y
        layout: tc.layout, // "column-major"
      };
      const got = await dsymv(
        device, // GPU device
        a.uplo, // which triangle of the symmetric matrix is stored
        a.n, // matrix dimension (n×n)
        a.alpha, // scale factor for A·x
        a.A, // matrix, column-major, size n*lda
        a.lda, // leading dimension (column stride) of A
        a.x, // input vector
        a.incx, // stride through x
        a.beta, // scale factor applied to existing y before accumulating
        a.y, // input/output vector
        a.incy, // stride through y
        a.layout, // storage layout
      );
      const expected = stdlibReference(a);
      assert.deepEqual(got.y, expected.y);
    });
  }
});

// Values the routine leaves alone come back bit-identical (see
// tests/helpers/exactness.js): full-precision inputs, which the (hi, lo)
// split would round if they went through a GPU round trip.
test("dsymv exactness (regression)", async (t) => {
  const full = fullPrecisionFrom(970);
  const n = 5;
  await t.test("alpha=0, beta=1 returns y untouched", async () => {
    const y = full(n);
    const want = Float64Array.from(y);
    const got = await dsymv(
      device,
      "lower",
      n,
      0,
      full(n * n),
      n,
      full(n),
      1,
      1,
      y,
      1,
    );
    assert.equal(got.y, y);
    assertBitIdentical(got.y, want, all(n), "y");
  });
  for (const beta of [0, 0.5])
    await t.test(`stride gaps in y (beta=${beta})`, async () => {
      const y = full(13);
      const got = await dsymv(
        device,
        "upper",
        n,
        1.5,
        full(n * n),
        n,
        full(13),
        3,
        beta,
        y,
        3,
      );
      assertBitIdentical(got.y, y, gaps(n, 3), "y");
    });
});

// ±Infinity and NaN reach the outputs as in real f64 (stdlib): no Inf turned
// into NaN by a double-double error term (see tests/helpers/specials.js).
test("dsymv IEEE special values (regression)", async (t) => {
  // n = 300 reaches the tile kernel. The stored Infinity reaches rows r and
  // c (symmetry) as ±Infinity, the rest stay finite; NaN in the unreferenced
  // triangle must never be read.
  for (const uplo of ["lower", "upper"])
    for (const n of [7, 300])
      await t.test(`${uplo} n=${n}`, async () => {
        const [r, c] = uplo === "lower" ? [4, 1] : [1, 4];
        const a = {
          uplo,
          n,
          alpha: 1.5,
          A: withValues(values(n * n, 1), {
            [at(n, r, c)]: Infinity,
            [at(n, c, r)]: NaN,
          }),
          lda: n,
          x: values(n, 2),
          incx: 1,
          beta: 0.5,
          y: values(n, 3),
          incy: 1,
        };
        const got = await dsymv(
          device,
          a.uplo,
          a.n,
          a.alpha,
          a.A,
          a.lda,
          a.x,
          a.incx,
          a.beta,
          a.y,
          a.incy,
        );
        assertIeeeMatch(got.y, stdlibReference(a).y, "y");
      });
});

// Double-double has f64's precision but f32's exponent range (its leading
// part is an f32): a double beyond ±3.4e38 reads as ±Infinity, one below
// f32's range as 0, and a result past it overflows to ±Infinity — where real
// f64 stays finite. Pinned against stdlib on the inputs as double-double sees
// them (tests/helpers/specials.js), so a change in that behaviour shows.
test("dsymv f32 exponent range (regression)", async (t) => {
  // 1e300 in the unreferenced triangle is never read.
  for (const uplo of ["lower", "upper"])
    for (const n of [7, 300])
      await t.test(`${uplo} n=${n}`, async () => {
        const [r, c] = uplo === "lower" ? [4, 1] : [1, 4];
        const a = {
          uplo,
          n,
          alpha: 1.5,
          A: withValues(values(n * n, 1), {
            [at(n, r, c)]: 1e300,
            [at(n, c, r)]: -1e300,
            [at(n, 5, 5)]: 1e-50,
          }),
          lda: n,
          x: withValues(values(n, 2), { 6: 1e-50 }),
          incx: 1,
          beta: 0.5,
          y: values(n, 3),
          incy: 1,
        };
        const got = await dsymv(
          device,
          a.uplo,
          a.n,
          a.alpha,
          a.A,
          a.lda,
          a.x,
          a.incx,
          a.beta,
          a.y,
          a.incy,
        );
        assertIeeeMatch(
          got.y,
          saturate(stdlibReference(argsInF32Range(a)).y),
          "y",
        );
      });
});

// alpha = 0: reference BLAS (and stdlib) scales the output by beta without
// reading the other operands, so NaN or ±Infinity there can't reach it — and
// beta = 0 clears it, NaN included.
test("dsymv alpha = 0 reads neither A nor x (regression)", async (t) => {
  for (const uplo of ["lower", "upper"])
    for (const n of [7, 300])
      for (const beta of [0, 0.5])
        await t.test(`${uplo} n=${n} beta=${beta}`, async () => {
          const a = {
            uplo,
            n,
            alpha: 0,
            A: withValues(randomFloat64Array(n * n, -1, 1, 1), {
              [at(n, 3, 1)]: NaN,
              [at(n, 1, 3)]: Infinity,
              [at(n, 2, 2)]: -Infinity,
            }),
            lda: n,
            x: withValues(randomFloat64Array(n, -1, 1, 2), { 5: Infinity }),
            incx: 1,
            beta,
            y: withValues(
              randomFloat64Array(n, -1, 1, 3),
              beta === 0 ? { 0: NaN } : {},
            ),
            incy: 1,
          };
          const got = await dsymv(
            device,
            a.uplo,
            a.n,
            a.alpha,
            a.A,
            a.lda,
            a.x,
            a.incx,
            a.beta,
            a.y,
            a.incy,
          );
          assertIeeeMatch(got.y, stdlibReference(a).y, "y", 1e-9);
        });
});
