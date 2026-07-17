import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { strmv } from "wgblas/strmv";
import stdlibStrmv from "@stdlib/blas-base-strmv";
import { loadParam, runValidation } from "../helpers/validation.js";
import { runFixtures } from "../helpers/fixtures.js";
import { forwardFactor } from "./helpers.js";

const NUM_RUNS = 100;
const THRESHOLD = 2;

let device;
before(async () => {
  device = await init();
});
after(() => {
  cleanup();
});

const nSpec = loadParam("n");
const validationSpecs = {
  device: loadParam("device"),
  uplo:   loadParam("uplo"),
  trans:  loadParam("trans"),
  diag:   loadParam("diag"),
  n: {
    ...nSpec,
    edge:    nSpec.edge.filter((e) => e.value !== -1),
    invalid: [...nSpec.invalid, { value: -1, error: "n must be non-negative", label: "negative" }],
  },
  A:      { ...loadParam("A"), dependsOn: ["n", "lda"] },
  lda:    loadParam("lda"),
  x:      { ...loadParam("x"), dependsOn: ["n", "incx"] },
  incx:   loadParam("incx"),
  y:      { ...loadParam("y"), dependsOn: ["n", "incy"] },
  incy:   loadParam("incy"),
};

const fixtureSpecs = { ...validationSpecs, n: { ...validationSpecs.n, range: { min: 1, max: 50 } } };

test("strmv validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => strmv(a.device, a.uplo, a.trans, a.diag, a.n, a.A, a.lda, a.x, a.incx, a.y, a.incy),
    { device },
  );
});

test("strmv fixtures", async (t) => {
  await runFixtures(
    t,
    "strmv",
    device,
    NUM_RUNS,
    THRESHOLD,
    fixtureSpecs,
    async (dev, a) => strmv(dev, a.uplo, a.trans, a.diag, a.n, a.A, a.lda, a.x, a.incx, a.y, a.incy),
    (a) => {
      const xCopy = a.x.slice();
      stdlibStrmv("row-major", a.uplo, a.trans, a.diag, a.n, a.A.slice(), a.lda, xCopy, a.incx);
      const out = new Float32Array(a.y);
      for (let i = 0; i < a.n; i++) out[i * a.incy] = xCopy[i * a.incx];
      return { y: out };
    },
    forwardFactor,
  );
});

test("strmv edge cases", async (t) => {
  await t.test("lower no-transpose: lower [[1,0],[2,3]] * [1,1] = [1,5]", async () => {
    const A = new Float32Array([1, 99, 2, 3]);
    const { y: out } = await strmv(device, "lower", "no-transpose", "non-unit", 2, A, 2, new Float32Array([1, 1]), 1, new Float32Array(2), 1);
    assert.deepEqual(out, new Float32Array([1, 5]));
  });

  await t.test("upper no-transpose: upper [[1,2],[0,3]] * [1,1] = [3,3]", async () => {
    const A = new Float32Array([1, 2, 99, 3]);
    const { y: out } = await strmv(device, "upper", "no-transpose", "non-unit", 2, A, 2, new Float32Array([1, 1]), 1, new Float32Array(2), 1);
    assert.deepEqual(out, new Float32Array([3, 3]));
  });

  await t.test("lower transpose: lower [[1,0],[2,3]]^T * [1,1] = [3,3]", async () => {
    const A = new Float32Array([1, 99, 2, 3]);
    const { y: out } = await strmv(device, "lower", "transpose", "non-unit", 2, A, 2, new Float32Array([1, 1]), 1, new Float32Array(2), 1);
    assert.deepEqual(out, new Float32Array([3, 3]));
  });

  await t.test("upper transpose: upper [[1,2],[0,3]]^T * [1,1] = [1,5]", async () => {
    const A = new Float32Array([1, 2, 99, 3]);
    const { y: out } = await strmv(device, "upper", "transpose", "non-unit", 2, A, 2, new Float32Array([1, 1]), 1, new Float32Array(2), 1);
    assert.deepEqual(out, new Float32Array([1, 5]));
  });

  await t.test("n=1 lower", async () => {
    const { y: out } = await strmv(device, "lower", "no-transpose", "non-unit", 1, new Float32Array([5]), 1, new Float32Array([2]), 1, new Float32Array(1), 1);
    assert.deepEqual(out, new Float32Array([10]));
  });

  await t.test("incx=2 lower no-transpose", async () => {
    const A = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
    const { y: out } = await strmv(device, "lower", "no-transpose", "non-unit", 3, A, 3, new Float32Array([1, 99, 2, 99, 3]), 2, new Float32Array(3), 1);
    assert.deepEqual(out, new Float32Array([1, 2, 3]));
  });

  await t.test("incy=2 lower no-transpose", async () => {
    const { y: out } = await strmv(device, "lower", "no-transpose", "non-unit", 1, new Float32Array([5]), 1, new Float32Array([2]), 1, new Float32Array([0, 99]), 2);
    assert.strictEqual(out[0], 10);
    assert.strictEqual(out[1], 99);
  });

  await t.test("unit diag lower no-transpose: diagonal ignored, lower [[99,0],[2,99]] * [1,1] = [1,3]", async () => {
    const A = new Float32Array([99, 0, 2, 99]);
    const { y: out } = await strmv(device, "lower", "no-transpose", "unit", 2, A, 2, new Float32Array([1, 1]), 1, new Float32Array(2), 1);
    assert.deepEqual(out, new Float32Array([1, 3]));
  });

  await t.test("unit diag upper transpose: diagonal ignored, upper [[99,2],[0,99]]^T * [1,1] = [1,3]", async () => {
    const A = new Float32Array([99, 2, 0, 99]);
    const { y: out } = await strmv(device, "upper", "transpose", "unit", 2, A, 2, new Float32Array([1, 1]), 1, new Float32Array(2), 1);
    assert.deepEqual(out, new Float32Array([1, 3]));
  });
});
