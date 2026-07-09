import { test, before, after } from "node:test";
import { init, cleanup } from "wgblas";
import { sscal } from "wgblas/sscal";
import stdlibSscal from "@stdlib/blas-base-sscal";
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
  alpha:  loadParam("alpha"),
  x:      loadParam("x"),
};

test("sscal validation", async (t) => {
  await runValidation(t, validationSpecs,
    (a) => sscal(a.device, a.n, a.alpha, a.x, a.incx),
    { device },
  );
});

test("sscal fixtures", async (t) => {
  await runFixtures(
    t,                 // node:test context
    "sscal",           // routine name — used in the diagnostic label
    device,            // WebGPU device instance
    NUM_RUNS,          // 100 random inputs
    0,                 // threshold 0 — scalar multiply is exact at f32, output must match bit-for-bit
    validationSpecs,   // param specs used to generate random inputs
    async (dev, a) => sscal(dev, a.n, a.alpha, a.x, a.incx),  // GPU call
    (a) => {                                                     // CPU reference — sscal modifies x in-place so slice() first
      const x = a.x.slice();
      stdlibSscal(a.n, a.alpha, x, a.incx);
      return x;
    },
    (gpu, ref) => maxUlp(gpu, ref).max,                         // max ULP across all elements of x
  );
});
