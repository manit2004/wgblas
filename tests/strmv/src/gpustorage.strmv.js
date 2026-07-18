// GPU-resident (GpuMatrix/GpuVector) coverage for strmv — same inputs and stdlib
// oracle as test.strmv.js, run through the overload where A/x/y stay on the GPU
// across the call, to exercise the AIsGpu/xIsGpu/yIsGpu branches in strmv.mjs.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { runFixtures } from "../../helpers/fixtures.js";
import { forwardFactor, stdlibReference, fixtureSpecs, makeY, callGpuResident } from "../helpers.js";
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

test("strmv fixtures (GPU-resident)", async (t) => {
  await runFixtures(
    t,                   // node:test context
    "strmv (GPU-resident)", // routine name
    device,              // GPUDevice
    NUM_RUNS,            // number of fast-check runs
    THRESHOLD,           // max allowed forward error factor
    fixtureSpecs,        // param specs used to generate random inputs
    callGpuResident,     // GPU impl — wraps A/x/y into GpuMatrix/GpuVector
    stdlibReference,     // CPU reference
    forwardFactor,       // error metric
  );
});

test("strmv edge cases (GPU-resident)", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = { // case params, JSON arrays converted to typed arrays
        uplo: c.uplo, trans: c.trans, diag: c.diag, n: c.n,
        A: new Float32Array(c.A), lda: c.lda,
        x: new Float32Array(c.x), incx: c.incx,
        y: makeY(c.n, c.incy), incy: c.incy,
      };
      const { y: got } = await callGpuResident(device, a); // GPU result
      const { y: expected } = stdlibReference(a); // stdlib result
      assert.deepEqual(got, expected);
    });
  }
});
