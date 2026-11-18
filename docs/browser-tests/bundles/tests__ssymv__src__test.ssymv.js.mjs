import {
  edge_cases_column_major_default,
  edge_cases_default,
  forwardFactor,
} from "./chunk-YPSWSHEJ.mjs";
import { assertIeeeMatch, at, withValues } from "./chunk-VGOUGUHQ.mjs";
import { ssymvReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures, runValidation } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, init, ssymv } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import { randomFloat32Array } from "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/ssymv/src/test.ssymv.js
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
  uplo: loadParam("uplo"),
  n: {
    ...nSpec,
    edge: nSpec.edge.filter((e) => e.value !== -1),
    invalid: [
      ...nSpec.invalid,
      { value: -1, error: "n must be non-negative", label: "negative" },
    ],
  },
  alpha: loadParam("alpha"),
  A: { ...loadParam("A"), dependsOn: ["n", "lda"] },
  lda: loadParam("lda"),
  x: { ...loadParam("x"), dependsOn: ["n", "incx"] },
  incx: loadParam("incx"),
  beta: loadParam("beta"),
  y: { ...loadParam("y"), dependsOn: ["n", "incy"] },
  incy: loadParam("incy"),
  layout: loadParam("layout"),
};
test("ssymv validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) =>
      ssymv(
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
var fixtureSpecs = {
  ...validationSpecs,
  n: { ...validationSpecs.n, range: { min: 1, max: 50 } },
};
test("ssymv fixtures", async (t) => {
  await runFixtures(
    t,
    // node:test context
    "ssymv",
    // routine name — used in the diagnostic label
    device,
    // WebGPU device instance
    NUM_RUNS,
    // 100 random inputs
    THRESHOLD,
    // threshold 2 — forward error factor ≤ 2 means within two roundings of true result
    fixtureSpecs,
    // param specs used to generate random inputs (n capped at 50 for speed)
    async (dev, a) =>
      ssymv(
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
      ),
    // GPU call
    ssymvReference,
    // CPU reference
    forwardFactor,
    // |err| / (eps * forward bound) — see helpers.js
  );
});
test("ssymv edge cases", async (t) => {
  for (const tc of edge_cases_default) {
    await t.test(tc.label, async () => {
      const a = {
        uplo: tc.uplo,
        // which triangle of the symmetric matrix is stored
        n: tc.n,
        // matrix dimension (n×n)
        alpha: tc.alpha,
        // scale factor for A·x
        A: new Float32Array(tc.A),
        // matrix, row-major, size n*lda
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
      const got = await ssymv(
        device,
        // GPU device
        a.uplo,
        // which triangle of the symmetric matrix is stored
        a.n,
        // matrix dimension (n×n)
        a.alpha,
        // scale factor for A·x
        a.A,
        // matrix, row-major, size n*lda
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
      const expected = ssymvReference(a);
      assert_default.deepEqual(got.y, expected.y);
    });
  }
});
test("ssymv zero-dimension (regression)", async (t) => {
  await t.test("n=0", async () => {
    const yBefore = randomFloat32Array(4, -1, 1, 9201);
    const y = Float32Array.from(yBefore);
    const got = await ssymv(
      device,
      "lower",
      0,
      // n=0
      1.5,
      new Float32Array(0),
      // A: 0x0 has no elements
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
});
test("ssymv many-tile path (regression)", async (t) => {
  const N = 600;
  for (const layout of ["row-major", "column-major"])
    for (const uplo of ["lower", "upper"])
      for (const beta of [0, 0.75])
        for (const inc of [1, 3]) {
          await t.test(
            `${layout} ${uplo} beta=${beta} inc=${inc}`,
            async () => {
              const a = {
                uplo,
                n: N,
                alpha: 1.5,
                A: randomFloat32Array(N * N, -1, 1, 31),
                lda: N,
                x: randomFloat32Array((N - 1) * inc + 1, -1, 1, 32),
                incx: inc,
                beta,
                y: randomFloat32Array((N - 1) * inc + 1, -1, 1, 33),
                incy: inc,
                layout,
              };
              const got = await ssymv(
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
              const factor = forwardFactor(got, ssymvReference(a), a);
              assert_default.ok(
                factor <= THRESHOLD,
                `forward factor ${factor} > ${THRESHOLD}`,
              );
            },
          );
        }
});
test("ssymv edge cases (column-major)", async (t) => {
  for (const tc of edge_cases_column_major_default) {
    await t.test(tc.label, async () => {
      const a = {
        uplo: tc.uplo,
        // which triangle of the symmetric matrix is stored
        n: tc.n,
        // matrix dimension (n×n)
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
      const got = await ssymv(
        device,
        // GPU device
        a.uplo,
        // which triangle of the symmetric matrix is stored
        a.n,
        // matrix dimension (n×n)
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
      const expected = ssymvReference(a);
      assert_default.deepEqual(got.y, expected.y);
    });
  }
});
test("ssymv alpha = 0 reads neither A nor x (regression)", async (t) => {
  for (const uplo of ["lower", "upper"])
    for (const n of [7, 300])
      for (const beta of [0, 0.5])
        await t.test(`${uplo} n=${n} beta=${beta}`, async () => {
          const a = {
            uplo,
            n,
            alpha: 0,
            A: withValues(randomFloat32Array(n * n, -1, 1, 1), {
              [at(n, 3, 1)]: NaN,
              [at(n, 1, 3)]: Infinity,
              [at(n, 2, 2)]: -Infinity,
            }),
            lda: n,
            x: withValues(randomFloat32Array(n, -1, 1, 2), { 5: Infinity }),
            incx: 1,
            beta,
            y: withValues(
              randomFloat32Array(n, -1, 1, 3),
              beta === 0 ? { 0: NaN } : {},
            ),
            incy: 1,
          };
          const got = await ssymv(
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
          assertIeeeMatch(got.y, ssymvReference(a).y, "y", 1e-4);
        });
});
