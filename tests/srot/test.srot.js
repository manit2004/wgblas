import { test, before, after } from "node:test";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { init, cleanup } from "wgblas";
import { srot } from "wgblas/srot";
import { assertUlp } from "../helpers/accuracy/ulp.js";
import { getUlpThreshold } from "../helpers/accuracy/accuracy.js";
import { loadParam, runValidation } from "../helpers/validation.js";

const thisDir = dirname(fileURLToPath(import.meta.url));
const fixtures = JSON.parse(
  readFileSync(join(thisDir, "fixtures/fixtures.json"), "utf8"),
);
const ULP_THRESHOLD = getUlpThreshold("srot");

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
  c:      loadParam("c"),
  s:      loadParam("s"),
};

test("srot validation", async (t) => {
  await runValidation(t, validationSpecs,
    (a) => srot(a.device, a.n, a.x, a.incx, a.y, a.incy, a.c, a.s),
    { device },
  );
});

test("srot fixtures", async () => {
  for (const fixture of fixtures) {
    const { n, incx, incy, c, s } = fixture;
    const x = new Float32Array(fixture.x);
    const y = new Float32Array(fixture.y);
    const expectedX = new Float32Array(fixture.expected_x);
    const expectedY = new Float32Array(fixture.expected_y);

    const { x: xOut, y: yOut } = await srot(device, n, x, incx, y, incy, c, s);
    assertUlp(xOut, expectedX, ULP_THRESHOLD, "srot x");
    assertUlp(yOut, expectedY, ULP_THRESHOLD, "srot y");
  }
});
