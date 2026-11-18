import {
  edge_cases_column_major_default,
  edge_cases_default,
  forwardFactor,
} from "./chunk-UJ2EMLQE.mjs";
import {
  all,
  assertBitIdentical,
  fullPrecisionFrom,
  ldPadding,
} from "./chunk-WTAHVNYX.mjs";
import {
  argsInF32Range,
  assertIeeeMatch,
  at,
  saturate,
  values,
  withValues,
} from "./chunk-VGOUGUHQ.mjs";
import { dgerReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures, runValidation } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, dger, init } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import { randomFloat64Array } from "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/dger/src/test.dger.js
var NUM_RUNS = 100;
var THRESHOLD = 5;
var device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => {
  cleanup();
});
var nSpec = loadParam("n");
var validationSpecs = {
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
var fixtureSpecs = {
  ...validationSpecs,
  m: { ...validationSpecs.m, range: { min: 1, max: 50 } },
  n: { ...validationSpecs.n, range: { min: 1, max: 50 } },
};
test("dger fixtures", async (t) => {
  await runFixtures(
    t,
    // node:test context
    "dger",
    // routine name — used in the diagnostic label
    device,
    // WebGPU device instance
    NUM_RUNS,
    // 100 random inputs
    THRESHOLD,
    // forward error factor threshold
    fixtureSpecs,
    // param specs used to generate random inputs (m, n capped at 50 for speed)
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
      ),
    // GPU call
    dgerReference,
    // CPU reference
    forwardFactor,
    // |err| / (eps * forward bound) — see helpers.js
  );
});
test("dger edge cases", async (t) => {
  for (const tc of edge_cases_default) {
    await t.test(tc.label, async () => {
      const a = {
        m: tc.m,
        // rows of A (length of x)
        n: tc.n,
        // columns of A (length of y)
        alpha: tc.alpha,
        // scale factor for x*y^T
        x: new Float64Array(tc.x),
        // input vector
        incx: tc.incx,
        // stride through x
        y: new Float64Array(tc.y),
        // input vector
        incy: tc.incy,
        // stride through y
        A: new Float64Array(tc.A),
        // matrix, row-major, size m*lda, mutated in place
        lda: tc.lda,
        // leading dimension (row stride) of A
      };
      const got = await dger(
        device,
        // GPU device
        a.m,
        // rows of A
        a.n,
        // columns of A
        a.alpha,
        // scale factor for x*y^T
        a.x,
        // input vector
        a.incx,
        // stride through x
        a.y,
        // input vector
        a.incy,
        // stride through y
        a.A,
        // matrix, row-major, size m*lda
        a.lda,
        // leading dimension (row stride) of A
      );
      const expected = dgerReference(a);
      assert_default.deepEqual(got.A, expected.A);
    });
  }
});
test("dger zero-dimension (regression)", async (t) => {
  await t.test("m=0", async () => {
    const before2 = randomFloat64Array(16, -1, 1, 9101);
    const A = Float64Array.from(before2);
    const got = await dger(
      device,
      0,
      // m=0
      4,
      1.5,
      randomFloat64Array(4, -1, 1, 9102),
      1,
      randomFloat64Array(4, -1, 1, 9103),
      1,
      A,
      4,
      // lda for a realistic 4x4 region even though m=0
    );
    assert_default.deepEqual(Array.from(got.A), Array.from(before2));
  });
  await t.test("n=0", async () => {
    const before2 = randomFloat64Array(16, -1, 1, 9104);
    const A = Float64Array.from(before2);
    const got = await dger(
      device,
      4,
      0,
      // n=0
      1.5,
      randomFloat64Array(4, -1, 1, 9105),
      1,
      randomFloat64Array(4, -1, 1, 9106),
      1,
      A,
      4,
      // lda for a realistic 4x4 region even though n=0
    );
    assert_default.deepEqual(Array.from(got.A), Array.from(before2));
  });
});
test("dger multi-chunk rows and packed y (regression)", async (t) => {
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
        const factor = forwardFactor(got, dgerReference(a), a);
        assert_default.ok(
          factor <= THRESHOLD,
          `forward factor ${factor} > ${THRESHOLD}`,
        );
        for (let o = 0; o < outer; o++)
          for (let p = inner; p < lda; p++)
            assert_default.equal(
              got.A[o * lda + p],
              a.A[o * lda + p],
              `padding element ${o * lda + p} changed`,
            );
      });
    }
});
test("dger edge cases (column-major)", async (t) => {
  for (const tc of edge_cases_column_major_default) {
    await t.test(tc.label, async () => {
      const a = {
        m: tc.m,
        // rows of A (length of x)
        n: tc.n,
        // columns of A (length of y)
        alpha: tc.alpha,
        // scale factor for x*y^T
        x: new Float64Array(tc.x),
        // input vector
        incx: tc.incx,
        // stride through x
        y: new Float64Array(tc.y),
        // input vector
        incy: tc.incy,
        // stride through y
        A: new Float64Array(tc.A),
        // matrix, column-major, size n*lda, mutated in place
        lda: tc.lda,
        // leading dimension (column stride) of A
        layout: tc.layout,
        // "column-major"
      };
      const got = await dger(
        device,
        // GPU device
        a.m,
        // rows of A
        a.n,
        // columns of A
        a.alpha,
        // scale factor for x*y^T
        a.x,
        // input vector
        a.incx,
        // stride through x
        a.y,
        // input vector
        a.incy,
        // stride through y
        a.A,
        // matrix, column-major, size n*lda
        a.lda,
        // leading dimension (column stride) of A
        a.layout,
        // storage layout
      );
      const expected = dgerReference(a);
      assert_default.deepEqual(got.A, expected.A);
    });
  }
});
test("dger exactness (regression)", async (t) => {
  const full = fullPrecisionFrom(1e3);
  const [m, n] = [4, 5];
  await t.test("alpha=0 returns A untouched", async () => {
    const A = full(m * n);
    const want = Float64Array.from(A);
    const got = await dger(device, m, n, 0, full(m), 1, full(n), 1, A, n);
    assert_default.equal(got.A, A);
    assertBitIdentical(got.A, want, all(m * n), "A");
  });
  await t.test("lda padding", async () => {
    const lda = n + 3;
    const A = full(m * lda);
    const got = await dger(device, m, n, 1.5, full(m), 1, full(n), 1, A, lda);
    assertBitIdentical(got.A, A, ldPadding(m, n, lda), "A");
  });
});
test("dger IEEE special values (regression)", async () => {
  for (const n of [7, 300]) {
    const a = {
      m: n,
      n,
      alpha: 1.5,
      x: withValues(values(n, 1), { 2: Infinity }),
      incx: 1,
      y: withValues(values(n, 2), { 3: NaN }),
      incy: 1,
      A: withValues(values(n * n, 3), { [at(n, 5, 5)]: -Infinity }),
      lda: n,
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
    );
    assertIeeeMatch(got.A, dgerReference(a).A, `n=${n} A`);
  }
});
test("dger f32 exponent range (regression)", async (t) => {
  for (const n of [7, 300]) {
    await t.test(`n=${n}: out-of-range inputs`, async () => {
      const a = {
        m: n,
        n,
        alpha: 1.5,
        x: withValues(values(n, 1), { 2: 1e300 }),
        incx: 1,
        y: values(n, 2),
        incy: 1,
        A: withValues(values(n * n, 3), {
          [at(n, 5, 5)]: -1e300,
          [at(n, 6, 1)]: 1e-50,
        }),
        lda: n,
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
      );
      assertIeeeMatch(got.A, dgerReference(argsInF32Range(a)).A, "A", 1e-9);
    });
    await t.test(`n=${n}: a result past f32's range`, async () => {
      const a = {
        m: n,
        n,
        alpha: 1e10,
        x: withValues(values(n, 1), { 2: 1e15 }),
        incx: 1,
        y: withValues(values(n, 2), { 4: 1e15 }),
        incy: 1,
        A: values(n * n, 3),
        lda: n,
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
      );
      assertIeeeMatch(got.A, saturate(dgerReference(a).A), "A", 1e-9);
    });
  }
});
test("dger zero vector entries skip their row (regression)", async (t) => {
  for (const layout of ["row-major", "column-major"])
    for (const n of [7, 300])
      await t.test(`${layout} n=${n}`, async () => {
        const inc = 2;
        const len = (n - 1) * inc + 1;
        const x = randomFloat64Array(len, -1, 1, 1);
        const y = randomFloat64Array(len, -1, 1, 2);
        for (const i of [0, 3, 5]) x[i * inc] = 0;
        for (const i of [1, 3, 6]) y[i * inc] = 0;
        x[1 * inc] = Infinity;
        x[6 * inc] = -Infinity;
        y[5 * inc] = NaN;
        const A = randomFloat64Array(n * n, -1, 1, 3);
        const got = await dger(
          device,
          n,
          n,
          1.5,
          x,
          inc,
          y,
          inc,
          A.slice(),
          n,
          layout,
        );
        assertIeeeMatch(
          got.A,
          dgerReference({
            m: n,
            n,
            alpha: 1.5,
            x,
            incx: inc,
            y,
            incy: inc,
            A,
            lda: n,
            layout,
          }).A,
          "A",
          1e-12,
        );
      });
});
