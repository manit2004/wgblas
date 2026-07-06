import { test, before, after } from "node:test";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { init, cleanup } from "wgblas";
import { srotm } from "wgblas/srotm";
import { assertUlp } from "../helpers/accuracy/ulp.js";
import { getUlpThreshold } from "../helpers/accuracy/accuracy.js";
import { loadParam, runValidation } from "../helpers/validation.js";

const thisDir = dirname(fileURLToPath(import.meta.url));
const fixtures = JSON.parse(
  readFileSync(join(thisDir, "fixtures/fixtures.json"), "utf8"),
);
const ULP_THRESHOLD = getUlpThreshold("srotm");

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

test("srotm validation", async (t) => {
  await runValidation(t, validationSpecs,
    (a) => srotm(a.device, a.n, a.x, a.incx, a.y, a.incy, new Float32Array([0, 1, 0, 0, 1])),
    { device },
  );
});

test("srotm fixtures", async () => {
  for (const fixture of fixtures) {
    const { n, incx, incy } = fixture;
    const x = new Float32Array(fixture.x);
    const y = new Float32Array(fixture.y);
    const param = new Float32Array(fixture.param);
    const expectedX = new Float32Array(fixture.expected_x);
    const expectedY = new Float32Array(fixture.expected_y);

    const { x: xOut, y: yOut } = await srotm(
      device,
      n,
      x,
      incx,
      y,
      incy,
      param,
    );
    assertUlp(xOut, expectedX, ULP_THRESHOLD, `srotm x (flag=${param[0]})`);
    assertUlp(yOut, expectedY, ULP_THRESHOLD, `srotm y (flag=${param[0]})`);
  }
});
