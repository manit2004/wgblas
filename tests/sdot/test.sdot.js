import { test, before, after } from "node:test";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { init, cleanup } from "wgblas";
import { sdot } from "wgblas/sdot";
import { ulpDiff } from "../helpers/accuracy/ulp.js";
import { getUlpThreshold } from "../helpers/accuracy/accuracy.js";
import { loadParam, runValidation } from "../helpers/validation.js";

const thisDir = dirname(fileURLToPath(import.meta.url));
const fixturesPath = join(thisDir, "fixtures/fixtures.json");
const fixtures = JSON.parse(readFileSync(fixturesPath, "utf8"));
const ULP_THRESHOLD = getUlpThreshold("sdot");

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

test("sdot validation", async (t) => {
  await runValidation(t, validationSpecs,
    (a) => sdot(a.device, a.n, a.x, a.incx, a.y, a.incy),
    { device },
  );
});

test("sdot fixtures", async () => {
  for (const fixture of fixtures) {
    const n = fixture.n;
    const incx = fixture.incx;
    const incy = fixture.incy;
    const x = new Float32Array(fixture.x);
    const y = new Float32Array(fixture.y);

    const { dot } = await sdot(device, n, x, incx, y, incy);
    const diff = ulpDiff(dot, fixture.expected_dot);
    if (diff > ULP_THRESHOLD) {
      throw new Error(
        `[sdot] ULP ${diff} exceeds threshold ${ULP_THRESHOLD} (actual=${dot}, expected=${fixture.expected_dot})`,
      );
    }
  }
});
