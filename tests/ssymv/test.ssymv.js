import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { ssymv } from "wgblas/ssymv";
import { loadParam, runValidation } from "../helpers/validation.js";
import { runFixtures } from "../helpers/fixtures.js";
import { forwardFactor } from "./helpers.js";
import stdlibSsymv from "@stdlib/blas-base-ssymv";

const NUM_RUNS = 100;
const THRESHOLD = 2;

let device;
before(async () => {
  device = await init();
});
after(() => {
  cleanup();
});

//   n: negative throws (not a noop) — move n=-1 from edge to invalid
//   A: square n×n, no separate m — dependsOn ["n","lda"] instead of ["m","n","lda"]
//   x/y: size depends only on n, not trans/m — dependsOn ["n","inc*"]
const nSpec = loadParam("n");
const validationSpecs = {
  device: loadParam("device"),
  uplo:   loadParam("uplo"),
  n: {
    ...nSpec,
    edge:    nSpec.edge.filter((e) => e.value !== -1),
    invalid: [...nSpec.invalid, { value: -1, error: "n must be non-negative", label: "negative" }],
  },
  alpha:  loadParam("alpha"),
  A:      { ...loadParam("A"), dependsOn: ["n", "lda"] },
  lda:    loadParam("lda"),
  x:      { ...loadParam("x"), dependsOn: ["n", "incx"] },
  incx:   loadParam("incx"),
  beta:   loadParam("beta"),
  y:      { ...loadParam("y"), dependsOn: ["n", "incy"] },
  incy:   loadParam("incy"),
};

test("ssymv validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => ssymv(a.device, a.uplo, a.n, a.alpha, a.A, a.lda, a.x, a.incx, a.beta, a.y, a.incy),
    { device },
  );
});

// Cap n: validationSpecs allows up to 1000 but n×n matrices at that size make property tests slow.
const fixtureSpecs = { ...validationSpecs, n: { ...validationSpecs.n, range: { min: 1, max: 50 } } };

test("ssymv fixtures", async (t) => {
  await runFixtures(
    t,                   // node:test context
    "ssymv",             // routine name — used in the diagnostic label
    device,              // WebGPU device instance
    NUM_RUNS,            // 100 random inputs
    THRESHOLD,           // threshold 2 — forward error factor ≤ 2 means within two roundings of true result
    fixtureSpecs,        // param specs used to generate random inputs (n capped at 50 for speed)
    async (dev, a) => ssymv(dev, a.uplo, a.n, a.alpha, a.A, a.lda, a.x, a.incx, a.beta, a.y, a.incy), // GPU call
    (a) => {                                                                                              // CPU reference
      const out = new Float32Array(a.y);
      stdlibSsymv("row-major", a.uplo, a.n, a.alpha, a.A.slice(), a.lda, a.x.slice(), a.incx, a.beta, out, a.incy);
      return { y: out };
    },
    forwardFactor,       // |err| / (eps * forward bound) — see helpers.js
  );
});

test("ssymv edge cases", async (t) => {
  await t.test("alpha=0 — output is beta*y, no matrix contribution", async () => {
    const A = new Float32Array(4).fill(9); // 2×2 of 9s — must not appear in output
    const { y: out } = await ssymv(device, "lower", 2, 0, A, 2, new Float32Array([1, 1]), 1, 2, new Float32Array([3, 4]), 1);
    assert.deepEqual(out, new Float32Array([6, 8]));
  });

  await t.test("beta=0 — output is alpha*A*x, no y contribution", async () => {
    // 2×2 identity stored lower: A[0,0]=1, A[1,0]=0, A[1,1]=1; A[0,1] ignored
    const I = new Float32Array([1, 0, 0, 1]);
    const { y: out } = await ssymv(device, "lower", 2, 3, I, 2, new Float32Array([5, 7]), 1, 0, new Float32Array([99, 99]), 1);
    assert.deepEqual(out, new Float32Array([15, 21]));
  });

  await t.test("lower: [[1,2],[2,3]] * [1,1] = [3,5]", async () => {
    // Lower storage: A[0,0]=1 (diag), A[1,0]=2 (lower), A[1,1]=3 (diag); A[0,1]=99 (ignored)
    const A = new Float32Array([1, 99, 2, 3]);
    const { y: out } = await ssymv(device, "lower", 2, 1, A, 2, new Float32Array([1, 1]), 1, 0, new Float32Array(2), 1);
    assert.deepEqual(out, new Float32Array([3, 5]));
  });

  await t.test("upper: [[1,2],[2,3]] * [1,1] = [3,5] — same matrix, different storage", async () => {
    // Upper storage: A[0,0]=1 (diag), A[0,1]=2 (upper), A[1,1]=3 (diag); A[1,0]=99 (ignored)
    const A = new Float32Array([1, 2, 99, 3]);
    const { y: out } = await ssymv(device, "upper", 2, 1, A, 2, new Float32Array([1, 1]), 1, 0, new Float32Array(2), 1);
    assert.deepEqual(out, new Float32Array([3, 5]));
  });

  await t.test("lda > n — padding elements in stride gaps are ignored", async () => {
    // 3×3 identity, lda=4; every 4th element is padding (99)
    const Ipad = new Float32Array([1, 0, 0, 99, 0, 1, 0, 99, 0, 0, 1, 99]);
    const { y: out } = await ssymv(device, "lower", 3, 1, Ipad, 4, new Float32Array([2, 3, 5]), 1, 0, new Float32Array(3), 1);
    assert.deepEqual(out, new Float32Array([2, 3, 5]));
  });

  await t.test("incx=2 — reads every other element of x", async () => {
    // 3×3 identity; x=[1,99,2,99,3] with incx=2 → effective x=[1,2,3]
    const I3 = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
    const { y: out } = await ssymv(device, "lower", 3, 1, I3, 3, new Float32Array([1, 99, 2, 99, 3]), 2, 0, new Float32Array(3), 1);
    assert.deepEqual(out, new Float32Array([1, 2, 3]));
  });

  await t.test("incy=2 — writes every other element of y, gaps unchanged", async () => {
    // 1×1 matrix A=[5], x=[2]; y_out[0] = 1*5*2 = 10, y[1] must stay 99
    const { y: out } = await ssymv(device, "lower", 1, 1, new Float32Array([5]), 1, new Float32Array([2]), 1, 0, new Float32Array([0, 99]), 2);
    assert.strictEqual(out[0], 10);
    assert.strictEqual(out[1], 99);
  });

  await t.test("beta accumulation — y_out = alpha*A*x + beta*y_in", async () => {
    // A = 2×2 identity, alpha=1, beta=2, x=[1,2], y_in=[10,20]
    // y_out = I*[1,2] + 2*[10,20] = [1,2] + [20,40] = [21,42]
    const I = new Float32Array([1, 0, 0, 1]);
    const { y: out } = await ssymv(device, "lower", 2, 1, I, 2, new Float32Array([1, 2]), 1, 2, new Float32Array([10, 20]), 1);
    assert.deepEqual(out, new Float32Array([21, 42]));
  });
});