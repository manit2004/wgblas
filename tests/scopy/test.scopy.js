import { test, before, after } from "node:test";
import { init, cleanup } from "wgblas";
import { scopy } from "wgblas/scopy";
import stdlibScopy from "@stdlib/blas-base-scopy";
import { loadParam, runValidation } from "../helpers/validation.js";
import { runFixtures, maxUlp } from "../helpers/fixtures.js";

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
  incy:   loadParam("incy"),
  x:      loadParam("x"),
  y:      loadParam("y"),
};

test("scopy validation", async (t) => {
  await runValidation(t, validationSpecs,
    (a) => scopy(a.device, a.n, a.x, a.incx, a.y, a.incy),
    { device },
  );
});

test("scopy fixtures", async (t) => {
  await runFixtures(
    t,                 // node:test context
    "scopy",           // routine name — used in the diagnostic label
    device,            // WebGPU device instance
    NUM_RUNS,          // 100 random inputs
    0,                 // threshold 0 — scopy is exact, output must match reference bit-for-bit
    validationSpecs,   // param specs used to generate random inputs
    async (dev, a) => scopy(dev, a.n, a.x, a.incx, a.y, a.incy),  // GPU call
    (a) => {                                                          // CPU reference
      const y = a.y.slice();
      stdlibScopy(a.n, a.x.slice(), a.incx, y, a.incy);
      return { y };
    },
    (gpu, ref) => maxUlp(gpu.y, ref.y).max,                          // max ULP across all elements of y
  );
});