import { test, before, after } from "node:test";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { init, cleanup } from "wgblas";
import { srot } from "wgblas/srot";
import { assertUlp } from "../helpers/ulp.js";
import { getUlpThreshold } from "../helpers/accuracy.js";

const thisDir = dirname(fileURLToPath(import.meta.url));
const fixtures = JSON.parse(readFileSync(join(thisDir, "fixtures/fixtures.json"), "utf8"));
const ULP_THRESHOLD = getUlpThreshold("srot");

before(async () => { await init(); });
after(() => { cleanup(); });

test("srot fixtures", async () => {
  for (const fixture of fixtures) {
    const { n, incx, incy, c, s } = fixture;
    const x = new Float32Array(fixture.x);
    const y = new Float32Array(fixture.y);
    const expectedX = new Float32Array(fixture.expected_x);
    const expectedY = new Float32Array(fixture.expected_y);

    const { x: xOut, y: yOut } = await srot(n, x, incx, y, incy, c, s);
    assertUlp(xOut, expectedX, ULP_THRESHOLD, "srot x");
    assertUlp(yOut, expectedY, ULP_THRESHOLD, "srot y");
  }
});
