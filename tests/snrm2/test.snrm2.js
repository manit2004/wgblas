import { test, before, after } from "node:test";
import { init, cleanup } from "wgblas";
import { snrm2 } from "wgblas/snrm2";
import stdlibSnrm2 from "@stdlib/blas-base-snrm2";
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

test("snrm2 validation", async (t) => {
  await runValidation(t, validationSpecs,
    (a) => snrm2(a.device, a.n, a.x, a.incx),
    { device },
  );
});

test("snrm2 fixtures", async (t) => {
  await runFixtures(
    t,                 // node:test context
    "snrm2",           // routine name — used in the diagnostic label
    device,            // WebGPU device instance
    NUM_RUNS,          // 100 random inputs
    50,                // threshold 50 ULP — GPU uses tree reduction, CPU is sequential; rounding order differs
    validationSpecs,   // param specs used to generate random inputs
    async (dev, a) => snrm2(dev, a.n, a.x, a.incx),        // GPU call
    (a) => stdlibSnrm2(a.n, a.x.slice(), a.incx),           // CPU reference 
    (gpu, ref) => ulpDiff(gpu.nrm2, ref),                    // raw ULP difference between scalar results
  );
});