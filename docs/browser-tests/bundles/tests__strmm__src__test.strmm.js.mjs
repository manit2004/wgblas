import {
  edge_cases_column_major_default,
  edge_cases_default,
  forwardFactor,
} from "./chunk-22YEMGJ7.mjs";
import { assertIeeeMatch, at, withValues } from "./chunk-VGOUGUHQ.mjs";
import { strmmReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures, runValidation } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, init, strmm } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import { randomFloat32Array } from "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/strmm/src/test.strmm.js
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
  transA: loadParam("trans"),
  diag: loadParam("diag"),
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
  A: { ...loadParam("A"), dependsOn: ["m", "n", "lda", "side"] },
  lda: loadParam("ld"),
  B: { ...loadParam("B"), dependsOn: ["m", "n", "ldb"] },
  ldb: loadParam("ld"),
};
test("strmm validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) =>
      strmm(
        a.device,
        a.side,
        a.uplo,
        a.transA,
        a.diag,
        a.m,
        a.n,
        a.alpha,
        a.A,
        a.lda,
        a.B,
        a.ldb,
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
test("strmm fixtures", async (t) => {
  await runFixtures(
    t,
    "strmm",
    device,
    NUM_RUNS,
    THRESHOLD,
    fixtureSpecs,
    async (dev, a) =>
      strmm(
        dev,
        a.side,
        a.uplo,
        a.transA,
        a.diag,
        a.m,
        a.n,
        a.alpha,
        a.A,
        a.lda,
        a.B,
        a.ldb,
        a.layout,
      ),
    strmmReference,
    forwardFactor,
  );
});
test("strmm edge cases", async (t) => {
  for (const tc of edge_cases_default) {
    await t.test(tc.label, async () => {
      const a = {
        side: tc.side,
        uplo: tc.uplo,
        transA: tc.transA,
        diag: tc.diag,
        m: tc.m,
        n: tc.n,
        alpha: tc.alpha,
        A: new Float32Array(tc.A),
        lda: tc.lda,
        B: new Float32Array(tc.B),
        ldb: tc.ldb,
      };
      const got = await strmm(
        device,
        a.side,
        a.uplo,
        a.transA,
        a.diag,
        a.m,
        a.n,
        a.alpha,
        a.A,
        a.lda,
        a.B,
        a.ldb,
      );
      const expected = strmmReference(a);
      assert_default.deepEqual(got.B, expected.B);
    });
  }
});
test("strmm zero-dimension (regression)", async (t) => {
  await t.test("m=0", async () => {
    const a = {
      side: "left",
      uplo: "lower",
      transA: "no-transpose",
      diag: "non-unit",
      m: 0,
      n: 4,
      alpha: 1.5,
      A: new Float32Array(0),
      lda: 1,
      B: randomFloat32Array(16, -5, 5, 300),
      ldb: 4,
    };
    const bBefore = Float32Array.from(a.B);
    const got = await strmm(
      device,
      a.side,
      a.uplo,
      a.transA,
      a.diag,
      a.m,
      a.n,
      a.alpha,
      a.A,
      a.lda,
      a.B,
      a.ldb,
    );
    assert_default.deepEqual(got.B, bBefore);
  });
  await t.test("n=0", async () => {
    const a = {
      side: "left",
      uplo: "lower",
      transA: "no-transpose",
      diag: "non-unit",
      m: 4,
      n: 0,
      alpha: 1.5,
      A: new Float32Array(0),
      lda: 1,
      B: randomFloat32Array(16, -5, 5, 301),
      ldb: 4,
    };
    const bBefore = Float32Array.from(a.B);
    const got = await strmm(
      device,
      a.side,
      a.uplo,
      a.transA,
      a.diag,
      a.m,
      a.n,
      a.alpha,
      a.A,
      a.lda,
      a.B,
      a.ldb,
    );
    assert_default.deepEqual(got.B, bBefore);
  });
});
test("strmm multi-tile path (regression)", async (t) => {
  const OTHER = 72;
  for (const [N, pad] of [
    [150, 1],
    [400, 4],
  ])
    for (const layout of ["row-major", "column-major"])
      for (const side of ["left", "right"])
        for (const uplo of ["lower", "upper"])
          for (const transA of ["no-transpose", "transpose"]) {
            const diag = transA === "transpose" ? "unit" : "non-unit";
            await t.test(
              `${layout} N=${N} ${side} ${uplo} ${transA} ${diag}`,
              async () => {
                const m = side === "left" ? N : OTHER;
                const n = side === "left" ? OTHER : N;
                const cm = layout === "column-major";
                const LD = (cm ? m : n) + pad;
                const OUTER = cm ? n : m;
                const a = {
                  side,
                  uplo,
                  transA,
                  diag,
                  m,
                  n,
                  alpha: 1.5,
                  A: randomFloat32Array(N * N, -1, 1, 81),
                  lda: N,
                  B: randomFloat32Array(OUTER * LD, -1, 1, 82),
                  ldb: LD,
                  layout,
                };
                const got = await strmm(
                  device,
                  a.side,
                  a.uplo,
                  a.transA,
                  a.diag,
                  a.m,
                  a.n,
                  a.alpha,
                  a.A,
                  a.lda,
                  a.B,
                  a.ldb,
                  a.layout,
                );
                const factor = forwardFactor(got, strmmReference(a), a);
                assert_default.ok(
                  factor <= THRESHOLD,
                  `forward factor ${factor} > ${THRESHOLD}`,
                );
                for (let o = 0; o < OUTER; o++)
                  for (let p = LD - pad; p < LD; p++)
                    assert_default.equal(
                      got.B[o * LD + p],
                      a.B[o * LD + p],
                      `padding element ${o * LD + p} changed`,
                    );
              },
            );
          }
});
test("strmm edge cases (column-major)", async (t) => {
  for (const tc of edge_cases_column_major_default) {
    await t.test(tc.label, async () => {
      const a = {
        layout: tc.layout,
        side: tc.side,
        uplo: tc.uplo,
        transA: tc.transA,
        diag: tc.diag,
        m: tc.m,
        n: tc.n,
        alpha: tc.alpha,
        A: new Float32Array(tc.A),
        lda: tc.lda,
        B: new Float32Array(tc.B),
        ldb: tc.ldb,
      };
      const got = await strmm(
        device,
        a.side,
        a.uplo,
        a.transA,
        a.diag,
        a.m,
        a.n,
        a.alpha,
        a.A,
        a.lda,
        a.B,
        a.ldb,
        a.layout,
      );
      const expected = strmmReference(a);
      assert_default.deepEqual(got.B, expected.B);
    });
  }
});
test("strmm alpha = 0 reads neither A nor B (regression)", async (t) => {
  for (const side of ["left", "right"])
    for (const n of [7, 300])
      await t.test(`${side} n=${n}`, async () => {
        const a = {
          side,
          uplo: "lower",
          transA: "no-transpose",
          diag: "non-unit",
          m: n,
          n,
          alpha: 0,
          A: withValues(randomFloat32Array(n * n, -1, 1, 1), {
            [at(n, 3, 1)]: NaN,
          }),
          lda: n,
          B: withValues(randomFloat32Array(n * n, -1, 1, 2), {
            [at(n, 2, 3)]: Infinity,
            [at(n, 0, 0)]: NaN,
          }),
          ldb: n,
        };
        const got = await strmm(
          device,
          a.side,
          a.uplo,
          a.transA,
          a.diag,
          a.m,
          a.n,
          a.alpha,
          a.A,
          a.lda,
          a.B.slice(),
          a.ldb,
        );
        assertIeeeMatch(got.B, strmmReference(a).B, "B", 1e-4);
      });
});
