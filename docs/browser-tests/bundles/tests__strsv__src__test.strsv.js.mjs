import {
  backwardResidualFactor,
  edge_cases_column_major_default,
  edge_cases_default,
} from "./chunk-VKVZNLUG.mjs";
import { assertIeeeMatch, at, withValues } from "./chunk-VGOUGUHQ.mjs";
import { strsvReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures, runValidation } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, init, strsv } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import { randomFloat32Array } from "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/strsv/src/test.strsv.js
var NUM_RUNS = 100;
var THRESHOLD = 3;
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
  trans: loadParam("trans"),
  diag: loadParam("diag"),
  n: {
    ...nSpec,
    edge: nSpec.edge.filter((e) => e.value !== -1),
    invalid: [
      ...nSpec.invalid,
      { value: -1, error: "n must be non-negative", label: "negative" },
    ],
  },
  // triangular: true keeps buildArb's diagonal well away from 0 — strsv divides by it.
  // range is also tightened to [-1,1]: with diag="unit" the diagonal is implicitly 1
  // (the triangular patch above doesn't apply), so an off-diagonal magnitude near the
  // default ±10 compounds across a long dependency chain (n up to 50) and overflows
  // float32 to Infinity/NaN — a pathological fixture, not a real accuracy bug.
  A: {
    ...loadParam("A"),
    dependsOn: ["n", "lda"],
    triangular: true,
    range: { elementMin: -1, elementMax: 1 },
  },
  lda: loadParam("lda"),
  x: { ...loadParam("x"), dependsOn: ["n", "incx"] },
  incx: loadParam("incx"),
  layout: loadParam("layout"),
};
var fixtureSpecs = {
  ...validationSpecs,
  n: { ...validationSpecs.n, range: { min: 1, max: 50 } },
};
test("strsv validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) =>
      strsv(
        a.device,
        a.uplo,
        a.trans,
        a.diag,
        a.n,
        a.A,
        a.lda,
        a.x,
        a.incx,
        a.layout,
      ),
    { device },
  );
});
test("strsv fixtures", async (t) => {
  await runFixtures(
    t,
    // node:test context
    "strsv",
    // routine name
    device,
    // GPUDevice
    NUM_RUNS,
    // number of fast-check runs
    THRESHOLD,
    // max allowed backward-residual factor
    fixtureSpecs,
    // A's spec has triangular: true — buildArb keeps its diagonal safe
    async (dev, a) =>
      strsv(
        dev,
        a.uplo,
        a.trans,
        a.diag,
        a.n,
        a.A,
        a.lda,
        a.x,
        a.incx,
        a.layout,
      ),
    // GPU impl
    () => ({}),
    // no CPU reference needed — backwardResidualFactor self-checks against b
    backwardResidualFactor,
    // error metric: plug GPU x back into op(A)*x and compare to b
  );
});
test("strsv edge cases", async (t) => {
  for (const c of edge_cases_default) {
    await t.test(c.label, async () => {
      const a = {
        uplo: c.uplo,
        // which triangle of A is stored
        trans: c.trans,
        // whether to use A or Aᵀ
        diag: c.diag,
        // unit (diagonal implicitly 1) or non-unit (read from A)
        n: c.n,
        // matrix dimension (n×n)
        A: new Float32Array(c.A),
        // matrix, row-major, size n*lda
        lda: c.lda,
        // leading dimension (row stride) of A
        x: new Float32Array(c.x),
        // holds b on input, the solution on output
        incx: c.incx,
        // stride through x
      };
      const { x: got } = await strsv(
        device,
        // GPU device
        a.uplo,
        // which triangle of A is stored
        a.trans,
        // whether to use A or Aᵀ
        a.diag,
        // unit (diagonal implicitly 1) or non-unit (read from A)
        a.n,
        // matrix dimension (n×n)
        a.A,
        // matrix, row-major, size n*lda
        a.lda,
        // leading dimension (row stride) of A
        a.x,
        // holds b on input, the solution on output
        a.incx,
        // stride through x
      );
      const { x: expected } = strsvReference(a);
      assert_default.deepEqual(got, expected);
    });
  }
});
test("strsv zero-dimension (regression)", async (t) => {
  await t.test("n=0", async () => {
    const xBefore = randomFloat32Array(4, -1, 1, 9601);
    const x = Float32Array.from(xBefore);
    const got = await strsv(
      device,
      "lower",
      "no-transpose",
      "non-unit",
      0,
      // n=0
      new Float32Array(0),
      // A: 0x0 has no elements
      1,
      x,
      1,
    );
    assert_default.deepEqual(got.x, xBefore);
  });
});
test("strsv few-block substitution path (regression)", async (t) => {
  for (const N of [64, 37, 1, 100, 128, 150, 300])
    for (const layout of ["row-major", "column-major"])
      for (const uplo of ["lower", "upper"])
        for (const trans of ["no-transpose", "transpose"])
          for (const diag of ["non-unit", "unit"])
            for (const inc of [1, 3]) {
              await t.test(
                `${layout} N=${N} ${uplo} ${trans} ${diag} inc=${inc}`,
                async () => {
                  const A = randomFloat32Array(N * N, -1 / N, 1 / N, 131);
                  for (let i = 0; i < N; i++) A[i * N + i] = 2;
                  const a = {
                    uplo,
                    trans,
                    diag,
                    n: N,
                    A,
                    lda: N,
                    x: randomFloat32Array((N - 1) * inc + 1, -1, 1, 132),
                    incx: inc,
                    layout,
                  };
                  const got = await strsv(
                    device,
                    a.uplo,
                    a.trans,
                    a.diag,
                    a.n,
                    a.A,
                    a.lda,
                    a.x,
                    a.incx,
                    a.layout,
                  );
                  const factor = backwardResidualFactor(got, null, a);
                  assert_default.ok(
                    factor <= THRESHOLD,
                    `backward residual factor ${factor} > ${THRESHOLD}`,
                  );
                  for (let i = 0; i < a.x.length; i++)
                    if (i % inc !== 0)
                      assert_default.equal(
                        got.x[i],
                        a.x[i],
                        `gap element ${i}`,
                      );
                },
              );
            }
});
test("strsv multi-block path (regression)", async (t) => {
  const N = 600;
  for (const layout of ["row-major", "column-major"])
    for (const uplo of ["lower", "upper"])
      for (const trans of ["no-transpose", "transpose"])
        for (const diag of ["non-unit", "unit"])
          for (const inc of [1, 3]) {
            await t.test(
              `${layout} ${uplo} ${trans} ${diag} inc=${inc}`,
              async () => {
                const A = randomFloat32Array(N * N, -1 / N, 1 / N, 41);
                for (let i = 0; i < N; i++) A[i * N + i] = 2;
                const a = {
                  uplo,
                  trans,
                  diag,
                  n: N,
                  A,
                  lda: N,
                  x: randomFloat32Array((N - 1) * inc + 1, -1, 1, 42),
                  incx: inc,
                  layout,
                };
                const got = await strsv(
                  device,
                  a.uplo,
                  a.trans,
                  a.diag,
                  a.n,
                  a.A,
                  a.lda,
                  a.x,
                  a.incx,
                  a.layout,
                );
                const factor = backwardResidualFactor(got, null, a);
                assert_default.ok(
                  factor <= THRESHOLD,
                  `backward residual factor ${factor} > ${THRESHOLD}`,
                );
                for (let i = 0; i < a.x.length; i++)
                  if (i % inc !== 0)
                    assert_default.equal(got.x[i], a.x[i], `gap element ${i}`);
              },
            );
          }
});
test("strsv edge cases (column-major)", async (t) => {
  for (const c of edge_cases_column_major_default) {
    await t.test(c.label, async () => {
      const a = {
        uplo: c.uplo,
        // which triangle of A is stored
        trans: c.trans,
        // whether to use A or Aᵀ
        diag: c.diag,
        // unit (diagonal implicitly 1) or non-unit (read from A)
        n: c.n,
        // matrix dimension (n×n)
        A: new Float32Array(c.A),
        // matrix, column-major, size n*lda
        lda: c.lda,
        // leading dimension (column stride) of A
        x: new Float32Array(c.x),
        // holds b on input, the solution on output
        incx: c.incx,
        // stride through x
        layout: c.layout,
        // "column-major"
      };
      const { x: got } = await strsv(
        device,
        // GPU device
        a.uplo,
        // which triangle of A is stored
        a.trans,
        // whether to use A or Aᵀ
        a.diag,
        // unit (diagonal implicitly 1) or non-unit (read from A)
        a.n,
        // matrix dimension (n×n)
        a.A,
        // matrix, column-major, size n*lda
        a.lda,
        // leading dimension (column stride) of A
        a.x,
        // holds b on input, the solution on output
        a.incx,
        // stride through x
        a.layout,
        // storage layout
      );
      const { x: expected } = strsvReference(a);
      assert_default.deepEqual(got, expected);
    });
  }
});
test("strsv IEEE special values (regression)", async (t) => {
  for (const uplo of ["lower", "upper"])
    for (const trans of ["no-transpose", "transpose"])
      for (const n of [7, 300])
        for (const [label, setup] of [
          ["Infinity early in b", (A, x) => (x[1] = Infinity)],
          ["Infinity mid-b", (A, x) => (x[Math.floor(n / 2)] = Infinity)],
          ["Infinity late in b", (A, x) => (x[n - 2] = -Infinity)],
          [
            "Infinity in A",
            (A) =>
              (A[uplo === "lower" ? at(n, n - 1, 2) : at(n, 2, n - 1)] =
                Infinity),
          ],
          [
            "Infinity in A near the diagonal",
            (A) => (A[uplo === "lower" ? at(n, 5, 4) : at(n, 4, 5)] = Infinity),
          ],
        ])
          await t.test(`${uplo} ${trans} n=${n}: ${label}`, async () => {
            const A = randomFloat32Array(n * n, -1, 1, 1);
            for (let i = 0; i < n; i++) A[at(n, i, i)] += n + 4;
            A[uplo === "lower" ? at(n, 1, 4) : at(n, 4, 1)] = NaN;
            const x = randomFloat32Array(n, -1, 1, 2);
            setup(A, x);
            const a = {
              uplo,
              trans,
              diag: "non-unit",
              n,
              A,
              lda: n,
              x,
              incx: 1,
            };
            const got = await strsv(
              device,
              a.uplo,
              a.trans,
              a.diag,
              a.n,
              a.A,
              a.lda,
              x.slice(),
              a.incx,
            );
            assertIeeeMatch(got.x, strsvReference(a).x, "x", 1e-4);
          });
});
test("strsv zero unknowns skip their column (regression)", async (t) => {
  for (const layout of ["row-major", "column-major"])
    for (const uplo of ["lower", "upper"])
      for (const trans of ["no-transpose", "transpose"])
        for (const n of [7, 300])
          await t.test(`${layout} ${uplo} ${trans} n=${n}`, async () => {
            const at2 = (i, j) =>
              layout === "row-major" ? at(n, i, j) : at(n, j, i);
            const A = randomFloat32Array(n * n, -1, 1, 1);
            for (let i = 0; i < n; i++) A[at(n, i, i)] += n + 4;
            const forward = (uplo === "lower") === (trans === "no-transpose");
            const first = forward ? 0 : n - 1;
            const later = forward ? 3 : n - 4;
            A[at2(first, first)] = NaN;
            A[
              trans === "no-transpose" ? at2(later, first) : at2(first, later)
            ] = Infinity;
            const x = withValues(randomFloat32Array(n, -1, 1, 2), {
              [first]: 0,
            });
            const a = {
              uplo,
              trans,
              diag: "non-unit",
              n,
              A,
              lda: n,
              x,
              incx: 1,
              layout,
            };
            const got = await strsv(
              device,
              a.uplo,
              a.trans,
              a.diag,
              a.n,
              a.A,
              a.lda,
              x.slice(),
              a.incx,
              a.layout,
            );
            assertIeeeMatch(got.x, strsvReference(a).x, "x", 1e-4);
          });
});
