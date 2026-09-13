import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, randomFloat32Array } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { cscal } from "wgblas/cscal";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
import { cscalReference as stdlibReference } from "../../helpers/stdlib.js";
import { cscalForwardFactor } from "../helpers.js";
import { Complex32, Complex32Array } from "../../../src/classes/Complex32.mjs";
import edgeCases from "../edge-cases.json" with { type: "json" };

const NUM_RUNS = 100;
const THRESHOLD = 1;

let device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => {
  cleanup();
});

// alpha/x: hand-written complex siblings of alpha.json/x.json (see
// validation.js's complex32/complex32array handling).
const validationSpecs = {
  device: loadParam("device"),
  n: loadParam("n"),
  incx: loadParam("incx"),
  alpha: loadParam("alphaComplex"),
  x: loadParam("xComplex"),
};

test("cscal validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => cscal(a.device, a.n, a.alpha, a.x, a.incx),
    { device },
  );
});

test("cscal reports gpuTimeMs in benchmark mode", async () => {
  const bDevice = await init({
    powerPreference: getPowerPreference(),
    benchmark: true,
  });
  const result = await cscal(
    bDevice,
    2,
    new Complex32(2, 0),
    new Complex32Array([1, 1, 2, 2]),
    1,
  );
  assert.equal(typeof result.gpuTimeMs, "number");
  assert.ok(result.gpuTimeMs >= 0);
});

test("cscal fixtures", async (t) => {
  await runFixtures(
    t,
    "cscal",
    device,
    NUM_RUNS,
    THRESHOLD,
    validationSpecs, // buildArb generates alpha/x directly from their complex32/complex32array specs
    async (dev, a) => cscal(dev, a.n, a.alpha, a.x, a.incx),
    stdlibReference,
    cscalForwardFactor,
  );
});

// Small hand-picked scenarios loaded from edge-cases.json. Expected output is
// computed live from stdlib, not hardcoded.
test("cscal edge cases", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,
        alpha: new Complex32(c.alpha.re, c.alpha.im),
        x: new Complex32Array(c.x),
        incx: c.incx,
      };
      const got = await cscal(device, a.n, a.alpha, a.x, a.incx);
      const expected = stdlibReference(a);
      assert.deepEqual(got.x, expected.x);
    });
  }
});

// n=0 has zero logical elements to touch, so the only correct behavior is a
// true no-op. The edge-cases block above only asserts "does not throw" for
// n<=0 entries, so an implementation that scribbles on x before an early
// return (or otherwise mishandles n=0) would still pass everything above.
// This checks x comes back byte-identical to what went in.
test("cscal zero-dimension (regression)", async () => {
  const re = randomFloat32Array(8, -1, 1, 300);
  const im = randomFloat32Array(8, -1, 1, 301);
  const interleaved = [];
  for (let i = 0; i < re.length; i++) interleaved.push(re[i], im[i]);
  const x = new Complex32Array(interleaved);
  // Array.from (not Complex32Array's own .map) so this is a plain Array,
  // matching the shape of the Array.from(got.x) it's compared against below.
  const before = Array.from(x, (z) => new Complex32(z.re, z.im));

  const got = await cscal(device, 0, new Complex32(2, -3), x, 1);

  assert.deepEqual(Array.from(got.x), before);
});
