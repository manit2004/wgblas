// GPU-resident (GpuMatrix/GpuVector) coverage for strmv — same inputs and stdlib
// oracle as test.strmv.js, run through the overload where A/x/y stay on the GPU
// across the call, to exercise the AIsGpu/xIsGpu/yIsGpu branches in strmv.mjs.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, GpuMatrix, GpuVector } from "wgblas";
import { strmv } from "wgblas/strmv";
import { runFixtures } from "../../helpers/fixtures.js";
import { forwardFactor, stdlibReference, fixtureSpecs } from "../helpers.js";
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

// GpuMatrix.from requires the full n*lda elements; a's A is only sized to the
// Float32Array API's minimum (n-1)*lda+n, which is shorter whenever lda > n,
// so zero-pad first (the extra padding columns are never read by the shader either way).
async function callGpuResident(dev, a) {
  const paddedA = new Float32Array(a.n * a.lda);
  paddedA.set(a.A);
  const AGpu = GpuMatrix.from(paddedA, a.n, a.n, a.lda);
  const xGpu = GpuVector.from(a.x);
  const yGpu = GpuVector.from(a.y);
  try {
    await strmv(dev, a.uplo, a.trans, a.diag, a.n, AGpu, a.lda, xGpu, a.incx, yGpu, a.incy);
    const y = await yGpu.read();
    return { y };
  } finally {
    AGpu.destroy();
    xGpu.destroy();
    yGpu.destroy();
  }
}

test("strmv fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,
    "strmv (GPU-resident)",
    device,
    NUM_RUNS,
    THRESHOLD,
    fixtureSpecs,
    callGpuResident,
    stdlibReference,
    forwardFactor,
  );
});

test("strmv edge cases (GPU-resident)", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        uplo: c.uplo, trans: c.trans, diag: c.diag, n: c.n,
        A: new Float32Array(c.A), lda: c.lda,
        x: new Float32Array(c.x), incx: c.incx,
        y: new Float32Array(c.y), incy: c.incy,
      };
      const { y: got } = await callGpuResident(device, a);
      const { y: expected } = stdlibReference(a);
      assert.deepEqual(got, expected);
    });
  }
});
