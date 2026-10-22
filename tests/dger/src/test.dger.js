import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, randomFloat64Array } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { dger } from "wgblas/dger";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { forwardFactor } from "../helpers.js";
import { dgerReference as stdlibReference } from "../../helpers/stdlib.js";
import edgeCases from "../edge-cases.json" with { type: "json" };
import edgeCasesColumnMajor from "../edge-cases-column-major.json" with { type: "json" };

const NUM_RUNS = 100;
// Forward-error cap, pinned to the high-performance/NVIDIA-calibrated bound
// (see tests/daxpy/src/test.daxpy.js) — dger does real double-double
// arithmetic (mul+add per element), so like the other arithmetic f64
// routines this is not expected to clear on the low-power/Intel backend.
const THRESHOLD = 5;

let device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => {
  cleanup();
});

// n: negative throws (not a noop) — move n=-1 from edge to invalid, matching sger.
const nSpec = loadParam("n");
const validationSpecs = {
  device: loadParam("device"),
  m: loadParam("m"),
  n: {
    ...nSpec,
    edge: nSpec.edge.filter((e) => e.value !== -1),
    invalid: [
      ...nSpec.invalid,
      { value: -1, error: "n must be non-negative", label: "negative" },
    ],
  },
  alpha: loadParam("alpha64"),
  x: { ...loadParam("x64"), dependsOn: ["m", "incx"] },
  incx: loadParam("incx"),
  y: { ...loadParam("y64"), dependsOn: ["n", "incy"] },
  incy: loadParam("incy"),
  A: loadParam("A64"),
  lda: loadParam("lda"),
  layout: loadParam("layout"),
};

test("dger validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) =>
      dger(
        a.device,
        a.m,
        a.n,
        a.alpha,
        a.x,
        a.incx,
        a.y,
        a.incy,
        a.A,
        a.lda,
        a.layout,
      ),
    { device },
  );
});

// Cap m and n for fixtures
const fixtureSpecs = {
  ...validationSpecs,
  m: { ...validationSpecs.m, range: { min: 1, max: 50 } },
  n: { ...validationSpecs.n, range: { min: 1, max: 50 } },
};

test("dger fixtures", async (t) => {
  await runFixtures(
    t, // node:test context
    "dger", // routine name — used in the diagnostic label
    device, // WebGPU device instance
    NUM_RUNS, // 100 random inputs
    THRESHOLD, // forward error factor threshold
    fixtureSpecs, // param specs used to generate random inputs (m, n capped at 50 for speed)
    async (dev, a) =>
      dger(
        dev,
        a.m,
        a.n,
        a.alpha,
        a.x,
        a.incx,
        a.y,
        a.incy,
        a.A,
        a.lda,
        a.layout,
      ), // GPU call
    stdlibReference, // CPU reference
    forwardFactor, // |err| / (eps * forward bound) — see helpers.js
  );
});

// Small hand-picked scenarios loaded from edge-cases.json.
test("dger edge cases", async (t) => {
  for (const tc of edgeCases) {
    await t.test(tc.label, async () => {
      const a = {
        m: tc.m, // rows of A (length of x)
        n: tc.n, // columns of A (length of y)
        alpha: tc.alpha, // scale factor for x*y^T
        x: new Float64Array(tc.x), // input vector
        incx: tc.incx, // stride through x
        y: new Float64Array(tc.y), // input vector
        incy: tc.incy, // stride through y
        A: new Float64Array(tc.A), // matrix, row-major, size m*lda, mutated in place
        lda: tc.lda, // leading dimension (row stride) of A
      };
      const got = await dger(
        device, // GPU device
        a.m, // rows of A
        a.n, // columns of A
        a.alpha, // scale factor for x*y^T
        a.x, // input vector
        a.incx, // stride through x
        a.y, // input vector
        a.incy, // stride through y
        a.A, // matrix, row-major, size m*lda
        a.lda, // leading dimension (row stride) of A
      );
      const expected = stdlibReference(a);
      assert.deepEqual(got.A, expected.A);
    });
  }
});

// Zero-dimension edge case: A's shape ties directly to both m and n, so
// m=0 or n=0 always makes A's accessed region empty (vacuous, unlike
// sgemv). Guards that A's entire backing storage stays byte-for-byte
// untouched.
test("dger zero-dimension (regression)", async (t) => {
  await t.test("m=0", async () => {
    const before = randomFloat64Array(16, -1, 1, 9101);
    const A = Float64Array.from(before);
    const got = await dger(
      device,
      0, // m=0
      4,
      1.5,
      randomFloat64Array(4, -1, 1, 9102),
      1,
      randomFloat64Array(4, -1, 1, 9103),
      1,
      A,
      4, // lda for a realistic 4x4 region even though m=0
    );
    assert.deepEqual(Array.from(got.A), Array.from(before));
  });

  await t.test("n=0", async () => {
    const before = randomFloat64Array(16, -1, 1, 9104);
    const A = Float64Array.from(before);
    const got = await dger(
      device,
      4,
      0, // n=0
      1.5,
      randomFloat64Array(4, -1, 1, 9105),
      1,
      randomFloat64Array(4, -1, 1, 9106),
      1,
      A,
      4, // lda for a realistic 4x4 region even though n=0
    );
    assert.deepEqual(Array.from(got.A), Array.from(before));
  });
});

// Fixtures cap the sizes well below one 64-lane chunk per row, so rows
// spanning several chunks never run there, nor does packing strided vectors
// at size (worthPackingDD only packs from 1024+ rows). These cover multi-
// chunk rows with an lda that leaves every row misaligned, y read
// strided in place, and the packed path (1100 rows at stride 8); both
// layouts. Padding must come back untouched.
test("dger multi-chunk rows and packed y (regression)", async (t) => {
  // [M, N, inc]: 70 rows don't reach worthPackingDD's threshold (y read
  // strided in place); 1100 rows at stride 8 do (y packed first).
  for (const [M, N, inc] of [
    [70, 600, 1],
    [70, 600, 3],
    [1100, 150, 8],
  ])
    for (const layout of ["row-major", "column-major"]) {
      await t.test(`${layout} ${M}x${N} incy=${inc}`, async () => {
        const cm = layout === "column-major";
        const inner = cm ? M : N;
        const outer = cm ? N : M;
        const lda = inner + 3;
        const a = {
          m: M,
          n: N,
          alpha: 1.5,
          x: randomFloat64Array((M - 1) * inc + 1, -1, 1, 201),
          incx: inc,
          y: randomFloat64Array((N - 1) * inc + 1, -1, 1, 202),
          incy: inc,
          A: randomFloat64Array(outer * lda, -1, 1, 203),
          lda,
          layout,
        };
        const got = await dger(
          device,
          a.m,
          a.n,
          a.alpha,
          a.x,
          a.incx,
          a.y,
          a.incy,
          a.A,
          a.lda,
          a.layout,
        );
        const factor = forwardFactor(got, stdlibReference(a), a);
        assert.ok(
          factor <= THRESHOLD,
          `forward factor ${factor} > ${THRESHOLD}`,
        );
        for (let o = 0; o < outer; o++)
          for (let p = inner; p < lda; p++)
            assert.equal(
              got.A[o * lda + p],
              a.A[o * lda + p],
              `padding element ${o * lda + p} changed`,
            );
      });
    }
});

// Small hand-picked scenarios loaded from edge-cases-column-major.json.
test("dger edge cases (column-major)", async (t) => {
  for (const tc of edgeCasesColumnMajor) {
    await t.test(tc.label, async () => {
      const a = {
        m: tc.m, // rows of A (length of x)
        n: tc.n, // columns of A (length of y)
        alpha: tc.alpha, // scale factor for x*y^T
        x: new Float64Array(tc.x), // input vector
        incx: tc.incx, // stride through x
        y: new Float64Array(tc.y), // input vector
        incy: tc.incy, // stride through y
        A: new Float64Array(tc.A), // matrix, column-major, size n*lda, mutated in place
        lda: tc.lda, // leading dimension (column stride) of A
        layout: tc.layout, // "column-major"
      };
      const got = await dger(
        device, // GPU device
        a.m, // rows of A
        a.n, // columns of A
        a.alpha, // scale factor for x*y^T
        a.x, // input vector
        a.incx, // stride through x
        a.y, // input vector
        a.incy, // stride through y
        a.A, // matrix, column-major, size n*lda
        a.lda, // leading dimension (column stride) of A
        a.layout, // storage layout
      );
      const expected = stdlibReference(a);
      assert.deepEqual(got.A, expected.A);
    });
  }
});
