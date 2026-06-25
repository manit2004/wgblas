import { test, before, after } from "node:test";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { init, cleanup } from "wgblas";
import { isamax } from "wgblas/isamax";

const thisDir = dirname(fileURLToPath(import.meta.url));
const fixturesPath = join(thisDir, "fixtures/fixtures.json");
const fixtures = JSON.parse(readFileSync(fixturesPath, "utf8"));

before(async () => { await init(); });
after(() => { cleanup(); });

test("isamax fixtures", async () => {
  for (const fixture of fixtures) {
    const n    = fixture.n;
    const incx = fixture.incx;
    const x    = new Float32Array(fixture.x);

    const { index } = await isamax(n, x, incx);
    if (index !== fixture.expected_index) {
      throw new Error(`[isamax] index ${index} !== expected ${fixture.expected_index} (n=${n}, incx=${incx})`);
    }
  }
});
