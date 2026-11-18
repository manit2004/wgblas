import {
  edge_cases_column_major_default,
  edge_cases_default,
  forwardFactor,
} from "./chunk-YXMBIPHE.mjs";
import { assertIeeeMatch, at, withValues } from "./chunk-VGOUGUHQ.mjs";
import { ssyr2kReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures, runValidation } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, init, ssyr2k } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import { randomFloat32Array } from "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/ssyr2k/src/test.ssyr2k.js
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
var aSpec = loadParam("A");
var ldSpec = loadParam("ld");
var validationSpecs = {
  device: loadParam("device"),
  uplo: loadParam("uplo"),
  trans: loadParam("trans"),
  layout: loadParam("layout"),
  n: {
    ...nSpec,
    baseline: 2,
    edge: nSpec.edge.filter((e) => e.value !== -1),
    invalid: [
      ...nSpec.invalid,
      { value: -1, error: "must be non-negative", label: "negative" },
    ],
  },
  k: loadParam("k"),
  alpha: loadParam("alpha"),
  beta: loadParam("beta"),
  A: { ...aSpec, ...aSpec["level-3"], dependsOn: ["n", "k", "lda", "trans"] },
  lda: ldSpec,
  B: { ...loadParam("B"), dependsOn: ["n", "k", "ldb", "trans"] },
  ldb: ldSpec,
  C: { ...loadParam("C"), dependsOn: ["n", "ldc"] },
  ldc: ldSpec,
};
test("ssyr2k validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) =>
      ssyr2k(
        a.device,
        a.uplo,
        a.trans,
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
var fixtureSpecs = {
  ...validationSpecs,
  n: { ...validationSpecs.n, range: { min: 1, max: 20 } },
  k: { ...validationSpecs.k, range: { min: 1, max: 20 } },
};
test("ssyr2k fixtures", async (t) => {
  await runFixtures(
    t,
    "ssyr2k",
    device,
    NUM_RUNS,
    THRESHOLD,
    fixtureSpecs,
    async (dev, a) =>
      ssyr2k(
        dev,
        a.uplo,
        a.trans,
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
    ssyr2kReference,
    forwardFactor,
  );
});
test("ssyr2k edge cases", async (t) => {
  for (const tc of edge_cases_default) {
    await t.test(tc.label, async () => {
      const a = {
        uplo: tc.uplo,
        trans: tc.trans,
        n: tc.n,
        k: tc.k,
        alpha: tc.alpha,
        A: new Float32Array(tc.A),
        lda: tc.lda,
        B: new Float32Array(tc.B),
        ldb: tc.ldb,
        beta: tc.beta,
        C: new Float32Array(tc.C),
        ldc: tc.ldc,
      };
      const got = await ssyr2k(
        device,
        a.uplo,
        a.trans,
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
      const expected = ssyr2kReference(a);
      assert_default.deepEqual(got.C, expected.C);
    });
  }
});
test("ssyr2k multi-tile path (regression)", async (t) => {
  const K = 9;
  for (const layout of ["row-major", "column-major"])
    for (const N of [150, 400])
      for (const uplo of ["lower", "upper"])
        for (const trans of ["no-transpose", "transpose"]) {
          await t.test(
            `${layout} n=${N} uplo=${uplo} trans=${trans}`,
            async () => {
              const cm = layout === "column-major";
              const [aR, aC] = trans === "no-transpose" ? [N, K] : [K, N];
              const ld = cm ? aR : aC;
              const a = {
                layout,
                uplo,
                trans,
                n: N,
                k: K,
                alpha: 1.5,
                A: randomFloat32Array(aR * aC, -1, 1, 71),
                lda: ld,
                B: randomFloat32Array(aR * aC, -1, 1, 72),
                ldb: ld,
                beta: 0.5,
                C: randomFloat32Array(N * N, -1, 1, 73),
                ldc: N,
              };
              const got = await ssyr2k(
                device,
                a.uplo,
                a.trans,
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
              const factor = forwardFactor(got, ssyr2kReference(a), a);
              assert_default.ok(
                factor <= THRESHOLD,
                `forward factor ${factor} > ${THRESHOLD}`,
              );
              for (let i = 0; i < N; i++)
                for (let j = 0; j < N; j++) {
                  if (uplo === "lower" ? j <= i : j >= i) continue;
                  const idx = cm ? j * N + i : i * N + j;
                  assert_default.equal(
                    got.C[idx],
                    a.C[idx],
                    `C(${i},${j}) outside the triangle changed`,
                  );
                }
            },
          );
        }
});
test("ssyr2k zero-dimension (k=0) (regression)", async (t) => {
  const N = 4,
    K = 0;
  const beta = 0.5;
  for (const uplo of ["lower", "upper"]) {
    await t.test(`uplo=${uplo}`, async () => {
      const a = {
        uplo,
        trans: "no-transpose",
        n: N,
        k: K,
        alpha: 1.5,
        A: new Float32Array(3),
        lda: 1,
        B: new Float32Array(3),
        ldb: 1,
        beta,
        C: randomFloat32Array(N * N, -5, 5, uplo === "lower" ? 300 : 301),
        ldc: N,
      };
      const cBefore = Float32Array.from(a.C);
      const got = await ssyr2k(
        device,
        a.uplo,
        a.trans,
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
      for (let row = 0; row < N; row++) {
        for (let col = 0; col < N; col++) {
          const i = row * N + col;
          const inTriangle = uplo === "lower" ? col <= row : col >= row;
          const expected = inTriangle
            ? Math.fround(beta * cBefore[i])
            : cBefore[i];
          assert_default.equal(got.C[i], expected, `row=${row}, col=${col}`);
        }
      }
    });
  }
});
test("ssyr2k edge cases (column-major)", async (t) => {
  for (const tc of edge_cases_column_major_default) {
    await t.test(tc.label, async () => {
      const a = {
        layout: tc.layout,
        uplo: tc.uplo,
        trans: tc.trans,
        n: tc.n,
        k: tc.k,
        alpha: tc.alpha,
        A: new Float32Array(tc.A),
        lda: tc.lda,
        B: new Float32Array(tc.B),
        ldb: tc.ldb,
        beta: tc.beta,
        C: new Float32Array(tc.C),
        ldc: tc.ldc,
      };
      const got = await ssyr2k(
        device,
        a.uplo,
        a.trans,
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
      const expected = ssyr2kReference(a);
      assert_default.deepEqual(got.C, expected.C);
    });
  }
});
test("ssyr2k alpha = 0 reads neither A nor B (regression)", async (t) => {
  for (const uplo of ["lower", "upper"])
    for (const n of [7, 300])
      for (const beta of [0, 0.5])
        await t.test(`${uplo} n=${n} beta=${beta}`, async () => {
          const a = {
            uplo,
            trans: "no-transpose",
            n,
            k: n,
            alpha: 0,
            A: withValues(randomFloat32Array(n * n, -1, 1, 1), {
              [at(n, 1, 2)]: NaN,
              [at(n, 3, 0)]: -Infinity,
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
          const got = await ssyr2k(
            device,
            a.uplo,
            a.trans,
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
          assertIeeeMatch(got.C, ssyr2kReference(a).C, "C", 1e-4);
        });
});
