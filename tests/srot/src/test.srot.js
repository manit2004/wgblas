import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { srot } from "wgblas/srot";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
// GPU may fuse multiply-add (FMA, one rounding) while CPU stdlib does two separate roundings.
// Near cancellation raw ULP is unbounded, so we use |err| / (eps * |bound|) instead.
// https://www.w3.org/TR/WGSL/#fma-builtin §17.5.32, 15.7.2
import { forwardFactor } from "../helpers.js";
import { srotReference as stdlibReference } from "../../helpers/stdlib.js";
import edgeCases from "../edge-cases.json" with { type: "json" };

const NUM_RUNS = 100;

let device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
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
  c:      loadParam("cosine"),
  s:      loadParam("s"),
};

test("srot validation", async (t) => {
  await runValidation(t, validationSpecs,
    (a) => srot(a.device, a.n, a.x, a.incx, a.y, a.incy, a.c, a.s),
    { device },
  );
});

test("srot fixtures", async (t) => {
  await runFixtures(
    t,                 // node:test context
    "srot",            // routine name — used in the diagnostic label
    device,            // WebGPU device instance
    NUM_RUNS,          // 100 random inputs
    1,                 // threshold 1 — forward error factor ≤ 1 means within one rounding of true result
    validationSpecs,   // param specs used to generate random inputs
    async (dev, a) => srot(dev, a.n, a.x, a.incx, a.y, a.incy, a.c, a.s),  // GPU call
    stdlibReference,   // CPU reference
    forwardFactor,     // |err| / (eps * |bound|) — see helpers.js
  );
});

// Small hand-picked scenarios loaded from edge-cases.json. Expected output is
// computed live from stdlib, not hardcoded.
test("srot edge cases", async (t) => {
  for (const tc of edgeCases) {
    await t.test(tc.label, async () => {
      const a = {
        n: tc.n,                     // vector length
        x: new Float32Array(tc.x),   // input/output vector
        incx: tc.incx,               // stride through x
        y: new Float32Array(tc.y),   // input/output vector
        incy: tc.incy,               // stride through y
        c: tc.c,                     // rotation cosine
        s: tc.s,                     // rotation sine
      };
      const got = await srot(
        device,   // GPU device
        a.n,      // vector length
        a.x,      // input/output vector
        a.incx,   // stride through x
        a.y,      // input/output vector
        a.incy,   // stride through y
        a.c,      // rotation cosine
        a.s,      // rotation sine
      );
      const expected = stdlibReference(a);
      assert.deepEqual(got.x, expected.x);
      assert.deepEqual(got.y, expected.y);
    });
  }
});
