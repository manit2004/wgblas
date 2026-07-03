import { test, before, after } from "node:test";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { init, cleanup } from "wgblas";
import { sswap } from "wgblas/sswap";
import { assertUlp } from "../helpers/ulp.js";
import { getUlpThreshold } from "../helpers/accuracy.js";

const thisDir = dirname(fileURLToPath(import.meta.url));
const fixturesPath = join(thisDir, "fixtures/fixtures.json");
const fixtures = JSON.parse(readFileSync(fixturesPath, "utf8"));
const ULP_THRESHOLD = getUlpThreshold("sswap");

let device;
before(async () => {
  device = await init();
});
after(() => {
  cleanup();
});

test("sswap fixtures", async () => {
  for (const fixture of fixtures) {
    const n = fixture.n;
    const incx = fixture.incx;
    const incy = fixture.incy;
    const x = new Float32Array(fixture.x);
    const y = new Float32Array(fixture.y);
    const expectedX = new Float32Array(fixture.expected_x);
    const expectedY = new Float32Array(fixture.expected_y);

    const { x: resultX, y: resultY } = await sswap(device, n, x, incx, y, incy);
    assertUlp(resultX, expectedX, ULP_THRESHOLD, "sswap x");
    assertUlp(resultY, expectedY, ULP_THRESHOLD, "sswap y");
  }
});
