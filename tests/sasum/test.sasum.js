import { test, before, after } from "node:test";
import { init, cleanup } from "wgblas";
import { sasum } from "wgblas/sasum";
import stdlibSasum from "@stdlib/blas-base-sasum";
import { loadParam, runValidation } from "../helpers/validation.js";
import { runFixtures, ulpDiff } from "../helpers/fixtures.js";

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

test("sasum validation", async (t) => {
  await runValidation(t, validationSpecs,
    (a) => sasum(a.device, a.n, a.x, a.incx),
    { device },
  );
});

test("sasum fixtures", async (t) => {
  await runFixtures(
    t,                 // node:test context
    "sasum",           // routine name — used in the diagnostic label
    device,            // WebGPU device instance
    NUM_RUNS,          // 100 random inputs
    50,                // threshold 50 ULP — GPU uses tree reduction, CPU is sequential; rounding order differs
    validationSpecs,   // param specs used to generate random inputs
    async (dev, a) => sasum(dev, a.n, a.x, a.incx),        // GPU call
    (a) => stdlibSasum(a.n, a.x.slice(), a.incx),           // CPU reference
    (gpu, ref) => ulpDiff(gpu.asum, ref),                    // raw ULP difference between results
  );
});