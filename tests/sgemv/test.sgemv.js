import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { sgemv } from "wgblas/sgemv";
import stdlibSgemv from "@stdlib/blas-base-sgemv";
import { loadParam, runValidation } from "../helpers/validation.js";
import { runFixtures } from "../helpers/fixtures.js";
// GPU may fuse multiply-add (FMA, one rounding) while CPU does separate roundings.
// Near cancellation raw ULP is unbounded; use forward error factor instead.
// https://www.w3.org/TR/WGSL/#fma-builtin §17.5.32, 15.7.2.
import { forwardFactor } from "./helpers.js";

const NUM_RUNS = 100;
// threshold 4: the GPU computes alpha*(A·x) while the stdlib may compute (alpha·A)·x,
// producing up to 2 extra eps per term from the different multiplication order. Combined
// with FMA fusion in the final alpha*acc+beta*y step this doubles the raw bound, so a
// factor of 4 gives headroom for all known GPU-vs-CPU rounding paths.
const THRESHOLD = 4;

let device;
before(async () => {
  device = await init();
});
after(() => {
  cleanup();
});


const validationSpecs = {
  device: loadParam("device"),
  trans:  loadParam("trans"),
  m:      loadParam("m"),
  n:      loadParam("n"),
  alpha:  loadParam("alpha"),
  beta:   loadParam("beta"),
  lda:    loadParam("lda"),
  A:      loadParam("A"),
  x:      loadParam("x"),
  incx:   loadParam("incx"),
  y:      loadParam("y"),
  incy:   loadParam("incy"),
};

test("sgemv validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => sgemv(a.device, a.trans, a.m, a.n, a.alpha, a.A, a.lda, a.x, a.incx, a.beta, a.y, a.incy),
    { device },
  );
});

test("sgemv fixtures", async (t) => {
  await runFixtures(
    t,                   // node:test context
    "sgemv",             // routine name — used in failure labels
    device,              // GPUDevice from before()
    NUM_RUNS,            // number of fast-check runs
    THRESHOLD,   // max allowed forward error factor
    validationSpecs,     // param specs used to generate random inputs
    async (dev, a) => sgemv(dev, a.trans, a.m, a.n, a.alpha, a.A, a.lda, a.x, a.incx, a.beta, a.y, a.incy), // GPU impl
    (a) => {             // CPU reference
      const out = a.y.slice();
      stdlibSgemv("row-major", a.trans, a.m, a.n, a.alpha, a.A.slice(), a.lda, a.x.slice(), a.incx, a.beta, out, a.incy);
      return { y: out };
    },
    forwardFactor,       // error metric: max |err| / (eps * per-element bound) across output
  );
});

test("sgemv edge cases", async (t) => {
  await t.test("alpha=0 — output is beta*y, no matrix contribution", async () => {
    const A = new Float32Array([9, 9, 9, 9, 9, 9]); // 2×3 of 9s — must not appear
    const { y: out } = await sgemv(device, "no-transpose", 2, 3, 0, A, 3, new Float32Array([1, 1, 1]), 1, 2, new Float32Array([3, 4]), 1);
    assert.deepEqual(out, new Float32Array([6, 8]));
  });

  await t.test("beta=0 — output is alpha*A*x, no y contribution", async () => {
    const I = new Float32Array([1, 0, 0, 1]); // 2×2 identity
    const { y: out } = await sgemv(device, "no-transpose", 2, 2, 3, I, 2, new Float32Array([5, 7]), 1, 0, new Float32Array([0, 0]), 1);
    assert.deepEqual(out, new Float32Array([15, 21]));
  });

  await t.test("NoTrans: row sums of [[1,2,3],[4,5,6]] with x=[1,1,1]", async () => {
    const A = new Float32Array([1, 2, 3, 4, 5, 6]);
    const { y: out } = await sgemv(device, "no-transpose", 2, 3, 1, A, 3, new Float32Array([1, 1, 1]), 1, 0, new Float32Array(2), 1);
    assert.deepEqual(out, new Float32Array([6, 15]));
  });

  await t.test("Trans: column sums of [[1,2,3],[4,5,6]] with x=[1,1]", async () => {
    const A = new Float32Array([1, 2, 3, 4, 5, 6]);
    const { y: out } = await sgemv(device, "transpose", 2, 3, 1, A, 3, new Float32Array([1, 1]), 1, 0, new Float32Array(3), 1);
    assert.deepEqual(out, new Float32Array([5, 7, 9]));
  });

  await t.test("lda > n — padding elements in stride gaps are ignored", async () => {
    const Apad = new Float32Array([1, 2, 99, 99, 3, 4, 99, 99]); // 2×2, lda=4
    const { y: out } = await sgemv(device, "no-transpose", 2, 2, 1, Apad, 4, new Float32Array([1, 1]), 1, 0, new Float32Array(2), 1);
    assert.deepEqual(out, new Float32Array([3, 7]));
  });

  await t.test("incx=2 — reads every other element of x", async () => {
    const I = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]); // 3×3 identity
    const { y: out } = await sgemv(device, "no-transpose", 3, 3, 1, I, 3, new Float32Array([1, 99, 2, 99, 3]), 2, 0, new Float32Array(3), 1);
    assert.deepEqual(out, new Float32Array([1, 2, 3]));
  });

  await t.test("incy=2 — writes every other element, gaps unchanged", async () => {
    const { y: out } = await sgemv(device, "no-transpose", 1, 1, 1, new Float32Array([2]), 1, new Float32Array([3]), 1, 0, new Float32Array([0, 99]), 2);
    assert.strictEqual(out[0], 6);
    assert.strictEqual(out[1], 99);
  });

});
