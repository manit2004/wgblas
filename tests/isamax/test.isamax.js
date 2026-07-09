import { test, before, after } from "node:test";
import { init, cleanup } from "wgblas";
import { isamax } from "wgblas/isamax";
import stdlibIsamax from "@stdlib/blas-base-isamax";
import { loadParam, runValidation } from "../helpers/validation.js";
import { runFixtures } from "../helpers/fixtures.js";

const NUM_RUNS = 100;

let device;
before(async () => {
  device = await init();
});
after(() => {
  cleanup();
});

const validationSpecs = {
  device: loadParam("device"),
  n:      loadParam("n"),
  incx:   loadParam("incx"),
  x:      loadParam("x"),
};

test("isamax validation", async (t) => {
  await runValidation(t, validationSpecs,
    (a) => isamax(a.device, a.n, a.x, a.incx),
    { device },
  );
});

test("isamax fixtures", async (t) => {
  await runFixtures(
    t,                 // node:test context
    "isamax",          // routine name — used in the diagnostic label
    device,            // WebGPU device instance
    NUM_RUNS,          // 100 random inputs
    0,                 // threshold 0 — index must match exactly.
    validationSpecs,   // param specs used to generate random inputs
    async (dev, a) => isamax(dev, a.n, a.x, a.incx),        // GPU call
    (a) => stdlibIsamax(a.n, a.x.slice(), a.incx),           // CPU reference
    (gpu, ref) => (gpu.index === ref ? 0 : 1),                // 0 if correct, 1 if wrong
  );
});