import {
  edge_cases_column_major_default,
  edge_cases_default,
  forwardFactor,
} from "./chunk-57G2M3YA.mjs";
import { assertIeeeMatch, withValues } from "./chunk-VGOUGUHQ.mjs";
import { sgerReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures, runValidation } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, init, sger } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import { randomFloat32Array } from "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/sger/src/test.sger.js
var NUM_RUNS = 100;
var THRESHOLD = 2;
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
  alpha: loadParam("alpha"),
  x: { ...loadParam("x"), dependsOn: ["m", "incx"] },
  incx: loadParam("incx"),
  y: { ...loadParam("y"), dependsOn: ["n", "incy"] },
  incy: loadParam("incy"),
  A: loadParam("A"),
  lda: loadParam("lda"),
  layout: loadParam("layout"),
};
test("sger validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) =>
      sger(
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
test("sger fixtures", async (t) => {
  await runFixtures(
    t,
    // node:test context
    "sger",
    // routine name — used in the diagnostic label
    device,
    // WebGPU device instance
    NUM_RUNS,
    // 100 random inputs
    THRESHOLD,
    // threshold 2 — forward error factor ≤ 2 means within two roundings of true result
    fixtureSpecs,
    // param specs used to generate random inputs (m, n capped at 50 for speed)
    async (dev, a) =>
      sger(
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
    sgerReference,
    // CPU reference
    forwardFactor,
    // |err| / (eps * forward bound) — see helpers.js
  );
});
test("sger edge cases", async (t) => {
  for (const tc of edge_cases_default) {
    await t.test(tc.label, async () => {
      const a = {
        m: tc.m,
        // rows of A (length of x)
        n: tc.n,
        // columns of A (length of y)
        alpha: tc.alpha,
        // scale factor for x*y^T
        x: new Float32Array(tc.x),
        // input vector
        incx: tc.incx,
        // stride through x
        y: new Float32Array(tc.y),
        // input vector
        incy: tc.incy,
        // stride through y
        A: new Float32Array(tc.A),
        // matrix, row-major, size m*lda, mutated in place
        lda: tc.lda,
        // leading dimension (row stride) of A
      };
      const got = await sger(
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
      const expected = sgerReference(a);
      assert_default.deepEqual(got.A, expected.A);
    });
  }
});
test("sger zero-dimension (regression)", async (t) => {
  await t.test("m=0", async () => {
    const before2 = randomFloat32Array(16, -1, 1, 9101);
    const A = Float32Array.from(before2);
    const got = await sger(
      device,
      0,
      // m=0
      4,
      1.5,
      randomFloat32Array(4, -1, 1, 9102),
      1,
      randomFloat32Array(4, -1, 1, 9103),
      1,
      A,
      4,
      // lda for a realistic 4x4 region even though m=0
    );
    assert_default.deepEqual(Array.from(got.A), Array.from(before2));
  });
  await t.test("n=0", async () => {
    const before2 = randomFloat32Array(16, -1, 1, 9104);
    const A = Float32Array.from(before2);
    const got = await sger(
      device,
      4,
      0,
      // n=0
      1.5,
      randomFloat32Array(4, -1, 1, 9105),
      1,
      randomFloat32Array(4, -1, 1, 9106),
      1,
      A,
      4,
      // lda for a realistic 4x4 region even though n=0
    );
    assert_default.deepEqual(Array.from(got.A), Array.from(before2));
  });
});
test("sger edge cases (column-major)", async (t) => {
  for (const tc of edge_cases_column_major_default) {
    await t.test(tc.label, async () => {
      const a = {
        m: tc.m,
        // rows of A (length of x)
        n: tc.n,
        // columns of A (length of y)
        alpha: tc.alpha,
        // scale factor for x*y^T
        x: new Float32Array(tc.x),
        // input vector
        incx: tc.incx,
        // stride through x
        y: new Float32Array(tc.y),
        // input vector
        incy: tc.incy,
        // stride through y
        A: new Float32Array(tc.A),
        // matrix, column-major, size n*lda, mutated in place
        lda: tc.lda,
        // leading dimension (column stride) of A
        layout: tc.layout,
        // "column-major"
      };
      const got = await sger(
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
      const expected = sgerReference(a);
      assert_default.deepEqual(got.A, expected.A);
    });
  }
});
test("sger zero vector entries skip their row (regression)", async (t) => {
  for (const layout of ["row-major", "column-major"])
    for (const n of [7, 300])
      await t.test(`${layout} n=${n}`, async () => {
        const inc = 2;
        const len = (n - 1) * inc + 1;
        const x = randomFloat32Array(len, -1, 1, 1);
        const y = randomFloat32Array(len, -1, 1, 2);
        for (const i of [0, 3, 5]) x[i * inc] = 0;
        for (const i of [1, 3, 6]) y[i * inc] = 0;
        x[1 * inc] = Infinity;
        x[6 * inc] = -Infinity;
        y[5 * inc] = NaN;
        const A = randomFloat32Array(n * n, -1, 1, 3);
        const got = await sger(
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
          sgerReference({
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
          1e-5,
        );
      });
});
test("sger alpha = 0 leaves A as it is (regression)", async () => {
  const n = 6;
  const x = withValues(randomFloat32Array(n, -1, 1, 1), {
    1: Infinity,
    3: NaN,
  });
  const A = randomFloat32Array(n * n, -1, 1, 3);
  const a = {
    m: n,
    n,
    alpha: 0,
    x,
    incx: 1,
    y: randomFloat32Array(n, -1, 1, 2),
    incy: 1,
    A,
    lda: n,
  };
  const got = await sger(
    device,
    a.m,
    a.n,
    a.alpha,
    a.x,
    a.incx,
    a.y,
    a.incy,
    A.slice(),
    a.lda,
  );
  assertIeeeMatch(got.A, sgerReference(a).A, "A", 0);
});
