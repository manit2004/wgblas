import {
  edge_cases_column_major_default,
  edge_cases_default,
  forwardFactor,
} from "./chunk-N6FEJXQV.mjs";
import { assertIeeeMatch, at, withValues } from "./chunk-VGOUGUHQ.mjs";
import { ssymmReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures, runValidation } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, init, ssymm } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import { randomFloat32Array } from "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/ssymm/src/test.ssymm.js
var NUM_RUNS = 100;
var THRESHOLD = 1;
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
  side: loadParam("side"),
  uplo: loadParam("uplo"),
  layout: loadParam("layout"),
  m: { ...loadParam("m"), baseline: 2 },
  n: {
    ...nSpec,
    baseline: 2,
    edge: nSpec.edge.filter((e) => e.value !== -1),
    invalid: [
      ...nSpec.invalid,
      { value: -1, error: "must be non-negative", label: "negative" },
    ],
  },
  alpha: loadParam("alpha"),
  beta: loadParam("beta"),
  A: { ...loadParam("A"), dependsOn: ["m", "n", "lda", "side"] },
  lda: loadParam("ld"),
  B: { ...loadParam("B"), dependsOn: ["m", "n", "ldb"] },
  ldb: loadParam("ld"),
  C: loadParam("C"),
  ldc: loadParam("ld"),
};
test("ssymm validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) =>
      ssymm(
        a.device,
        a.side,
        a.uplo,
        a.m,
        a.n,
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
var fixtureSpecs = {
  ...validationSpecs,
  m: { ...validationSpecs.m, range: { min: 1, max: 20 } },
  n: { ...validationSpecs.n, range: { min: 1, max: 20 } },
};
test("ssymm fixtures", async (t) => {
  await runFixtures(
    t,
    "ssymm",
    device,
    NUM_RUNS,
    THRESHOLD,
    fixtureSpecs,
    async (dev, a) =>
      ssymm(
        dev,
        a.side,
        a.uplo,
        a.m,
        a.n,
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
    ssymmReference,
    forwardFactor,
  );
});
test("ssymm edge cases", async (t) => {
  for (const tc of edge_cases_default) {
    await t.test(tc.label, async () => {
      const a = {
        side: tc.side,
        uplo: tc.uplo,
        m: tc.m,
        n: tc.n,
        alpha: tc.alpha,
        A: new Float32Array(tc.A),
        lda: tc.lda,
        B: new Float32Array(tc.B),
        ldb: tc.ldb,
        beta: tc.beta,
        C: new Float32Array(tc.C),
        ldc: tc.ldc,
      };
      const got = await ssymm(
        device,
        a.side,
        a.uplo,
        a.m,
        a.n,
        a.alpha,
        a.A,
        a.lda,
        a.B,
        a.ldb,
        a.beta,
        a.C,
        a.ldc,
      );
      const expected = ssymmReference(a);
      assert_default.deepEqual(got.C, expected.C);
    });
  }
});
test("ssymm zero-dimension (regression)", async (t) => {
  await t.test("m=0", async () => {
    const a = {
      side: "left",
      uplo: "lower",
      m: 0,
      n: 4,
      alpha: 1.5,
      A: new Float32Array(0),
      lda: 1,
      B: new Float32Array(0),
      ldb: 1,
      beta: 0.5,
      C: randomFloat32Array(16, -5, 5, 300),
      ldc: 4,
    };
    const cBefore = Float32Array.from(a.C);
    const got = await ssymm(
      device,
      a.side,
      a.uplo,
      a.m,
      a.n,
      a.alpha,
      a.A,
      a.lda,
      a.B,
      a.ldb,
      a.beta,
      a.C,
      a.ldc,
    );
    assert_default.deepEqual(got.C, cBefore);
  });
  await t.test("n=0", async () => {
    const a = {
      side: "left",
      uplo: "lower",
      m: 4,
      n: 0,
      alpha: 1.5,
      A: new Float32Array(0),
      lda: 1,
      B: new Float32Array(0),
      ldb: 1,
      beta: 0.5,
      C: randomFloat32Array(16, -5, 5, 301),
      ldc: 4,
    };
    const cBefore = Float32Array.from(a.C);
    const got = await ssymm(
      device,
      a.side,
      a.uplo,
      a.m,
      a.n,
      a.alpha,
      a.A,
      a.lda,
      a.B,
      a.ldb,
      a.beta,
      a.C,
      a.ldc,
    );
    assert_default.deepEqual(got.C, cBefore);
  });
});
test("ssymm multi-tile path (regression)", async (t) => {
  const OTHER = 72;
  for (const [N, pad] of [
    [150, 1],
    [400, 4],
  ])
    for (const layout of ["row-major", "column-major"])
      for (const side of ["left", "right"])
        for (const uplo of ["lower", "upper"]) {
          await t.test(`${layout} N=${N} ${side} ${uplo}`, async () => {
            const m = side === "left" ? N : OTHER;
            const n = side === "left" ? OTHER : N;
            const cm = layout === "column-major";
            const LD = (cm ? m : n) + pad;
            const OUTER = cm ? n : m;
            const a = {
              side,
              uplo,
              m,
              n,
              alpha: 1.5,
              A: randomFloat32Array(N * N, -1, 1, 91),
              lda: N,
              B: randomFloat32Array(OUTER * LD, -1, 1, 92),
              ldb: LD,
              beta: 0.5,
              C: randomFloat32Array(OUTER * LD, -1, 1, 93),
              ldc: LD,
              layout,
            };
            const got = await ssymm(
              device,
              a.side,
              a.uplo,
              a.m,
              a.n,
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
            const factor = forwardFactor(got, ssymmReference(a), a);
            assert_default.ok(
              factor <= THRESHOLD,
              `forward factor ${factor} > ${THRESHOLD}`,
            );
            for (let o = 0; o < OUTER; o++)
              for (let p = LD - pad; p < LD; p++)
                assert_default.equal(
                  got.C[o * LD + p],
                  a.C[o * LD + p],
                  `padding element ${o * LD + p} changed`,
                );
          });
        }
});
test("ssymm edge cases (column-major)", async (t) => {
  for (const tc of edge_cases_column_major_default) {
    await t.test(tc.label, async () => {
      const a = {
        layout: tc.layout,
        side: tc.side,
        uplo: tc.uplo,
        m: tc.m,
        n: tc.n,
        alpha: tc.alpha,
        A: new Float32Array(tc.A),
        lda: tc.lda,
        B: new Float32Array(tc.B),
        ldb: tc.ldb,
        beta: tc.beta,
        C: new Float32Array(tc.C),
        ldc: tc.ldc,
      };
      const got = await ssymm(
        device,
        a.side,
        a.uplo,
        a.m,
        a.n,
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
      const expected = ssymmReference(a);
      assert_default.deepEqual(got.C, expected.C);
    });
  }
});
test("ssymm alpha = 0 reads neither A nor B (regression)", async (t) => {
  for (const side of ["left", "right"])
    for (const n of [7, 300])
      for (const beta of [0, 0.5])
        await t.test(`${side} n=${n} beta=${beta}`, async () => {
          const a = {
            side,
            uplo: "lower",
            m: n,
            n,
            alpha: 0,
            A: withValues(randomFloat32Array(n * n, -1, 1, 1), {
              [at(n, 3, 1)]: NaN,
            }),
            lda: n,
            B: withValues(randomFloat32Array(n * n, -1, 1, 2), {
              [at(n, 2, 3)]: Infinity,
            }),
            ldb: n,
            beta,
            C: withValues(
              randomFloat32Array(n * n, -1, 1, 3),
              beta === 0 ? { [at(n, 4, 4)]: NaN } : {},
            ),
            ldc: n,
          };
          const got = await ssymm(
            device,
            a.side,
            a.uplo,
            a.m,
            a.n,
            a.alpha,
            a.A,
            a.lda,
            a.B,
            a.ldb,
            a.beta,
            a.C,
            a.ldc,
          );
          assertIeeeMatch(got.C, ssymmReference(a).C, "C", 1e-4);
        });
});
