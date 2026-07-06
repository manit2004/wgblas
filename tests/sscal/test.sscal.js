import { test, before, after } from "node:test";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { init, cleanup } from "wgblas";
import { sscal } from "wgblas/sscal";
import { assertUlp } from "../helpers/accuracy/ulp.js";
import { getUlpThreshold } from "../helpers/accuracy/accuracy.js";
import { loadParam, runValidation } from "../helpers/validation.js";

const thisDir = dirname(fileURLToPath(import.meta.url));
const fixturesPath = join(thisDir, "fixtures/fixtures.json");
const fixtures = JSON.parse(readFileSync(fixturesPath, "utf8"));
const ULP_THRESHOLD = getUlpThreshold("sscal");

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

test("sscal fixtures", async () => {
  for (const fixture of fixtures) {
    const n = fixture.n;
    const alpha = fixture.alpha;
    const incx = fixture.incx;
    const x = new Float32Array(fixture.x);
    const expected = new Float32Array(fixture.expected);

    const result = await sscal(device, n, alpha, x, incx);
    assertUlp(result, expected, ULP_THRESHOLD, "sscal");
  }
});
