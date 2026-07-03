import { test, before, after } from "node:test";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { init, cleanup } from "wgblas";
import { snrm2 } from "wgblas/snrm2";
import { ulpDiff } from "../helpers/ulp.js";
import { getUlpThreshold } from "../helpers/accuracy.js";

const thisDir = dirname(fileURLToPath(import.meta.url));
const fixturesPath = join(thisDir, "fixtures/fixtures.json");
const fixtures = JSON.parse(readFileSync(fixturesPath, "utf8"));
const ULP_THRESHOLD = getUlpThreshold("snrm2");

let device;
before(async () => { device = await init(); });
after(() => { cleanup(); });

test("snrm2 fixtures", async () => {
  for (const fixture of fixtures) {
    const n    = fixture.n;
    const incx = fixture.incx;
    const x    = new Float32Array(fixture.x);

    const { nrm2 } = await snrm2(device, n, x, incx);
    const diff = ulpDiff(nrm2, fixture.expected_nrm2);
    if (diff > ULP_THRESHOLD) {
      throw new Error(`[snrm2] ULP ${diff} exceeds threshold ${ULP_THRESHOLD} (actual=${nrm2}, expected=${fixture.expected_nrm2})`);
    }
  }
});
