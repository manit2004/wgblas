import { test, before, after } from "node:test";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { init, cleanup } from "wgblas";
import { sasum } from "wgblas/sasum";
import { ulpDiff } from "../helpers/accuracy/ulp.js";
import { getUlpThreshold } from "../helpers/accuracy/accuracy.js";
import { loadParam, runValidation } from "../helpers/validation.js";

const thisDir = dirname(fileURLToPath(import.meta.url));
const fixturesPath = join(thisDir, "fixtures/fixtures.json");
const fixtures = JSON.parse(readFileSync(fixturesPath, "utf8"));
const ULP_THRESHOLD = getUlpThreshold("sasum");

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

test("sasum fixtures", async () => {
  for (const fixture of fixtures) {
    const n = fixture.n;
    const incx = fixture.incx;
    const x = new Float32Array(fixture.x);

    const { asum } = await sasum(device, n, x, incx);
    const diff = ulpDiff(asum, fixture.expected_asum);
    if (diff > ULP_THRESHOLD) {
      throw new Error(
        `[sasum] ULP ${diff} exceeds threshold ${ULP_THRESHOLD} (actual=${asum}, expected=${fixture.expected_asum})`,
      );
    }
  }
});
