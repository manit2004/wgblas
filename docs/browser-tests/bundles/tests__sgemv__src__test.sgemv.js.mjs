import {
  edge_cases_column_major_default,
  edge_cases_default,
  forwardFactor,
} from "./chunk-BAUESGWD.mjs";
import { assertIeeeMatch, at, withValues } from "./chunk-VGOUGUHQ.mjs";
import { sgemvReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures, runValidation } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, init, sgemv } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import { randomFloat32Array } from "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/sgemv/src/test.sgemv.js
var NUM_RUNS = 100;
var THRESHOLD = 4;
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
  trans: loadParam("trans"),
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
  beta: loadParam("beta"),
  lda: loadParam("lda"),
  A: loadParam("A"),
  x: loadParam("x"),
  incx: loadParam("incx"),
  y: loadParam("y"),
  incy: loadParam("incy"),
  layout: loadParam("layout"),
};
test("sgemv validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) =>
      sgemv(
        a.device,
        a.trans,
        a.m,
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
var fixtureSpecs = {
  ...validationSpecs,
  m: { ...validationSpecs.m, range: { min: 1, max: 50 } },
  n: { ...validationSpecs.n, range: { min: 1, max: 50 } },
};
test("sgemv fixtures", async (t) => {
  await runFixtures(
    t,
    // node:test context
    "sgemv",
    // routine name — used in failure labels
    device,
    // GPUDevice from before()
    NUM_RUNS,
    // number of fast-check runs
    THRESHOLD,
    // max allowed forward error factor
    fixtureSpecs,
    // param specs used to generate random inputs (m, n capped at 50 for speed)
    async (dev, a) =>
      sgemv(
        dev,
        a.trans,
        a.m,
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
    // GPU impl
    sgemvReference,
    // CPU reference
    forwardFactor,
    // error metric: max |err| / (eps * per-element bound) across output
  );
});
test("sgemv edge cases", async (t) => {
  for (const tc of edge_cases_default) {
    await t.test(tc.label, async () => {
      const a = {
        trans: tc.trans,
        // whether to use A or Aᵀ
        m: tc.m,
        // rows of A
        n: tc.n,
        // columns of A
        alpha: tc.alpha,
        // scale factor for A·x
        A: new Float32Array(tc.A),
        // matrix, row-major, size m*lda
        lda: tc.lda,
        // leading dimension (row stride) of A
        x: new Float32Array(tc.x),
        // input vector
        incx: tc.incx,
        // stride through x
        beta: tc.beta,
        // scale factor applied to existing y before accumulating
        y: new Float32Array(tc.y),
        // input/output vector
        incy: tc.incy,
        // stride through y
      };
      const got = await sgemv(
        device,
        // GPU device
        a.trans,
        // whether to use A or Aᵀ
        a.m,
        // rows of A
        a.n,
        // columns of A
        a.alpha,
        // scale factor for A·x
        a.A,
        // matrix, row-major, size m*lda
        a.lda,
        // leading dimension (row stride) of A
        a.x,
        // input vector
        a.incx,
        // stride through x
        a.beta,
        // scale factor applied to existing y before accumulating
        a.y,
        // input/output vector
        a.incy,
        // stride through y
      );
      const expected = sgemvReference(a);
      assert_default.deepEqual(got.y, expected.y);
    });
  }
});
test("sgemv zero-dimension (regression)", async (t) => {
  await t.test("no-transpose, n=0 (contraction dim zero, m>0)", async () => {
    const yBefore = randomFloat32Array(4, -1, 1, 9001);
    const y = Float32Array.from(yBefore);
    const got = await sgemv(
      device,
      "no-transpose",
      4,
      // m>0
      0,
      // n=0 — contraction dimension for no-transpose
      1.5,
      new Float32Array(0),
      // A: m*0 has no elements
      1,
      new Float32Array(0),
      // x: length n=0
      1,
      0.5,
      // beta != 0, != 1
      y,
      1,
    );
    assert_default.deepEqual(got.y, yBefore);
  });
  await t.test("transpose, m=0 (contraction dim zero, n>0)", async () => {
    const yBefore = randomFloat32Array(4, -1, 1, 9002);
    const y = Float32Array.from(yBefore);
    const got = await sgemv(
      device,
      "transpose",
      0,
      // m=0 — contraction dimension for transpose
      4,
      // n>0
      1.5,
      new Float32Array(0),
      // A: 0*n has no elements
      1,
      new Float32Array(0),
      // x: length m=0
      1,
      0.5,
      // beta != 0, != 1
      y,
      1,
    );
    assert_default.deepEqual(got.y, yBefore);
  });
});
test("sgemv split-K transpose path (regression)", async (t) => {
  const M = 600,
    N = 300;
  for (const [layout, trans] of [
    ["row-major", "transpose"],
    ["column-major", "no-transpose"],
  ])
    for (const beta of [0, 0.75])
      for (const inc of [1, 3]) {
        await t.test(`${layout} ${trans} beta=${beta} inc=${inc}`, async () => {
          const [m, n] = layout === "row-major" ? [M, N] : [N, M];
          const isNoTrans = trans === "no-transpose";
          const xLen = isNoTrans ? n : m;
          const yLen = isNoTrans ? m : n;
          const a = {
            trans,
            m,
            n,
            alpha: 1.5,
            A: randomFloat32Array(m * n, -1, 1, 21),
            lda: layout === "row-major" ? n : m,
            x: randomFloat32Array((xLen - 1) * inc + 1, -1, 1, 22),
            incx: inc,
            beta,
            y: randomFloat32Array((yLen - 1) * inc + 1, -1, 1, 23),
            incy: inc,
            layout,
          };
          const got = await sgemv(
            device,
            a.trans,
            a.m,
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
          const factor = forwardFactor(got, sgemvReference(a), a);
          assert_default.ok(
            factor <= THRESHOLD,
            `forward factor ${factor} > ${THRESHOLD}`,
          );
        });
      }
});
test("sgemv edge cases (column-major)", async (t) => {
  for (const tc of edge_cases_column_major_default) {
    await t.test(tc.label, async () => {
      const a = {
        trans: tc.trans,
        // whether to use A or Aᵀ
        m: tc.m,
        // rows of A
        n: tc.n,
        // columns of A
        alpha: tc.alpha,
        // scale factor for A·x
        A: new Float32Array(tc.A),
        // matrix, column-major, size n*lda
        lda: tc.lda,
        // leading dimension (column stride) of A
        x: new Float32Array(tc.x),
        // input vector
        incx: tc.incx,
        // stride through x
        beta: tc.beta,
        // scale factor applied to existing y before accumulating
        y: new Float32Array(tc.y),
        // input/output vector
        incy: tc.incy,
        // stride through y
        layout: tc.layout,
        // "column-major"
      };
      const got = await sgemv(
        device,
        // GPU device
        a.trans,
        // whether to use A or Aᵀ
        a.m,
        // rows of A
        a.n,
        // columns of A
        a.alpha,
        // scale factor for A·x
        a.A,
        // matrix, column-major, size n*lda
        a.lda,
        // leading dimension (column stride) of A
        a.x,
        // input vector
        a.incx,
        // stride through x
        a.beta,
        // scale factor applied to existing y before accumulating
        a.y,
        // input/output vector
        a.incy,
        // stride through y
        a.layout,
        // storage layout
      );
      const expected = sgemvReference(a);
      assert_default.deepEqual(got.y, expected.y);
    });
  }
});
test("sgemv alpha = 0 reads neither A nor x (regression)", async (t) => {
  for (const trans of ["no-transpose", "transpose"])
    for (const n of [7, 300])
      for (const beta of [0, 0.5])
        await t.test(`${trans} n=${n} beta=${beta}`, async () => {
          const a = {
            trans,
            m: n,
            n,
            alpha: 0,
            A: withValues(randomFloat32Array(n * n, -1, 1, 1), {
              [at(n, 1, 2)]: NaN,
              [at(n, 3, 4)]: Infinity,
            }),
            lda: n,
            x: withValues(randomFloat32Array(n, -1, 1, 2), { 5: -Infinity }),
            incx: 1,
            beta,
            y: withValues(
              randomFloat32Array(n, -1, 1, 3),
              beta === 0 ? { 0: NaN } : {},
            ),
            incy: 1,
          };
          const got = await sgemv(
            device,
            a.trans,
            a.m,
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
          assertIeeeMatch(got.y, sgemvReference(a).y, "y", 1e-4);
        });
});
test("sgemv zero x entries skip their column (regression)", async (t) => {
  for (const layout of ["row-major", "column-major"])
    for (const trans of ["no-transpose", "transpose"])
      for (const n of [7, 300])
        await t.test(`${layout} ${trans} n=${n}`, async () => {
          const A = withValues(randomFloat32Array(n * n, -1, 1, 1), {
            [at(n, 1, 2)]: Infinity,
            [at(n, 2, 1)]: -Infinity,
            [at(n, 4, 0)]: NaN,
            [at(n, 0, 4)]: Infinity,
          });
          const x = withValues(randomFloat32Array(n, -1, 1, 2), { 1: 0, 4: 0 });
          const a = {
            trans,
            m: n,
            n,
            alpha: 1.5,
            A,
            lda: n,
            x,
            incx: 1,
            beta: 0.5,
            y: randomFloat32Array(n, -1, 1, 3),
            incy: 1,
            layout,
          };
          const got = await sgemv(
            device,
            a.trans,
            a.m,
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
          assertIeeeMatch(got.y, sgemvReference(a).y, "y", 1e-4);
        });
});
