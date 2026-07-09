import { test, before, after } from "node:test";
import { init, cleanup } from "wgblas";
import { sswap } from "wgblas/sswap";
import stdlibSswap from "@stdlib/blas-base-sswap";
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

test("sswap validation", async (t) => {
  await runValidation(t, validationSpecs,
    (a) => sswap(a.device, a.n, a.x, a.incx, a.y, a.incy),
    { device },
  );
});

test("sswap fixtures", async (t) => {
  await runFixtures(
    t,                 // node:test context
    "sswap",           // routine name — used in the diagnostic label
    device,            // WebGPU device instance
    NUM_RUNS,          // 100 random inputs
    0,                 // threshold 0 — swap is exact, output must match reference bit-for-bit
    validationSpecs,   // param specs used to generate random inputs
    async (dev, a) => sswap(dev, a.n, a.x, a.incx, a.y, a.incy),  // GPU call
    (a) => {                                                          // CPU reference — sswap modifies x and y in-place so slice() both
      const x = a.x.slice();
      const y = a.y.slice();
      stdlibSswap(a.n, x, a.incx, y, a.incy);
      return { x, y };
    },
    (gpu, ref) => Math.max(maxUlp(gpu.x, ref.x).max, maxUlp(gpu.y, ref.y).max),  // max ULP across both vectors
  );
});
