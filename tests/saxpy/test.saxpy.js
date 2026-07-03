import { test, before, after } from "node:test";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { init, cleanup } from "wgblas";
import { saxpy } from "wgblas/saxpy";
import { assertUlp } from "../helpers/ulp.js";
import { getUlpThreshold } from "../helpers/accuracy.js";

const thisDir = dirname(fileURLToPath(import.meta.url));
const fixturesPath = join(thisDir, "fixtures/fixtures.json");
const fixtures = JSON.parse(readFileSync(fixturesPath, "utf8"));
const ULP_THRESHOLD = getUlpThreshold("saxpy");

let device;
before(async () => {
  device = await init();
});
after(() => {
  cleanup();
});

test("saxpy fixtures", async () => {
  for (const fixture of fixtures) {
    const n = fixture.n;
    const alpha = fixture.alpha;
    const incx = fixture.incx;
    const incy = fixture.incy;
    const x = new Float32Array(fixture.x);
    const y = new Float32Array(fixture.y);
    const expectedY = new Float32Array(fixture.expected_y);

    const { y: resultY } = await saxpy(device, n, alpha, x, incx, y, incy);
    assertUlp(resultY, expectedY, ULP_THRESHOLD, "saxpy");
  }
});
