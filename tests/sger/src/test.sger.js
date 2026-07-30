import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { sger } from "wgblas/sger";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { forwardFactor } from "../helpers.js";
import { sgerReference as stdlibReference } from "../../helpers/stdlib.js";
import edgeCases from "../edge-cases.json" with { type: "json" };

const NUM_RUNS = 100;
const THRESHOLD = 2;

let device;
before(async () => {
  device = await init();
});
after(() => {
  cleanup();
});

// n: negative throws (not a noop) — move n=-1 from edge to invalid, matching sgemv/ssymv.
const nSpec = loadParam("n");
const validationSpecs = {
  device: loadParam("device"),
  m:      loadParam("m"),
  n: {
    ...nSpec,
    edge:    nSpec.edge.filter((e) => e.value !== -1),
    invalid: [...nSpec.invalid, { value: -1, error: "n must be non-negative", label: "negative" }],
  },
  alpha:  loadParam("alpha"),
  x:      { ...loadParam("x"), dependsOn: ["m", "incx"] },
  incx:   loadParam("incx"),
  y:      { ...loadParam("y"), dependsOn: ["n", "incy"] },
  incy:   loadParam("incy"),
  A:      loadParam("A"),
  lda:    loadParam("lda"),
};

test("sger validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => sger(a.device, a.m, a.n, a.alpha, a.x, a.incx, a.y, a.incy, a.A, a.lda),
    { device },
  );
});

// Cap m and n for fixtures
const fixtureSpecs = {
  ...validationSpecs,
  m: { ...validationSpecs.m, range: { min: 1, max: 50 } },
  n: { ...validationSpecs.n, range: { min: 1, max: 50 } },
};

test("sger fixtures", async (t) => {
  await runFixtures(
    t,                   // node:test context
    "sger",              // routine name — used in the diagnostic label
    device,              // WebGPU device instance
    NUM_RUNS,            // 100 random inputs
    THRESHOLD,           // threshold 2 — forward error factor ≤ 2 means within two roundings of true result
    fixtureSpecs,        // param specs used to generate random inputs (m, n capped at 50 for speed)
    async (dev, a) => sger(dev, a.m, a.n, a.alpha, a.x, a.incx, a.y, a.incy, a.A, a.lda), // GPU call
    stdlibReference,     // CPU reference
    forwardFactor,       // |err| / (eps * forward bound) — see helpers.js
  );
});

// Small hand-picked scenarios loaded from edge-cases.json.
test("sger edge cases", async (t) => {
  for (const tc of edgeCases) {
    await t.test(tc.label, async () => {
      const a = {
        m: tc.m,                     // rows of A (length of x)
        n: tc.n,                     // columns of A (length of y)
        alpha: tc.alpha,             // scale factor for x*y^T
        x: new Float32Array(tc.x),   // input vector
        incx: tc.incx,               // stride through x
        y: new Float32Array(tc.y),   // input vector
        incy: tc.incy,               // stride through y
        A: new Float32Array(tc.A),   // matrix, row-major, size m*lda, mutated in place
        lda: tc.lda,                 // leading dimension (row stride) of A
      };
      const got = await sger(
        device,   // GPU device
        a.m,      // rows of A
        a.n,      // columns of A
        a.alpha,  // scale factor for x*y^T
        a.x,      // input vector
        a.incx,   // stride through x
        a.y,      // input vector
        a.incy,   // stride through y
        a.A,      // matrix, row-major, size m*lda
        a.lda,    // leading dimension (row stride) of A
      );
      const expected = stdlibReference(a);
      assert.deepEqual(got.A, expected.A);
    });
  }
});
