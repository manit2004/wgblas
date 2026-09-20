import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, randomFloat64Array } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { ddot } from "wgblas/ddot";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
// Two reasons a raw f64 comparison against stdlib is the wrong oracle here:
// the GPU may fuse multiply-add (one rounding where the CPU does two), and
// double-double carries ~48 mantissa bits rather than f64's 53. Near
// cancellation raw ULP is unbounded either way, so fixtures use the forward
// error factor |err| / (n * eps * sum|x_i*y_i|) instead.
// https://www.w3.org/TR/WGSL/#fma-builtin §17.5.32, 15.7.2.
import { forwardFactor } from "../helpers.js";
import { ddotReference as stdlibReference } from "../../helpers/stdlib.js";
import edgeCases from "../edge-cases.json" with { type: "json" };

const NUM_RUNS = 100;
// Forward-error cap, pinned to the NVIDIA-calibrated bound rather than a
// per-adapter value. Worst over 1200 random cases: 0.78 on the NVIDIA dGPU,
// 2949 on the Intel iGPU, with a heavy tail (2.2-2949 run to run) — not the
// multiply (every primitive is bit-exact on both adapters), the loss only
// appears once composed in ddot.wgsl's loop. This threshold is not expected
// to clear on the low-power/Intel backend.
const THRESHOLD = 1;

let device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => {
  cleanup();
});

const validationSpecs = {
  device: loadParam("device"),
  n: loadParam("n"),
  incx: loadParam("incx"),
  incy: loadParam("incy"),
  x: loadParam("x64"),
  y: loadParam("y64"),
};

// Cap n for fixtures — validationSpecs allows up to 1000, which makes property tests slow.
const fixtureSpecs = {
  ...validationSpecs,
  n: { ...validationSpecs.n, range: { min: 1, max: 50 } },
};

test("ddot validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => ddot(a.device, a.n, a.x, a.incx, a.y, a.incy),
    { device },
  );
});

test("ddot fixtures", async (t) => {
  await runFixtures(
    t, // node:test context
    "ddot", // routine name — used in the diagnostic label
    device, // WebGPU device instance
    NUM_RUNS, // 100 random inputs
    THRESHOLD, // forward error factor cap — see above
    fixtureSpecs, // param specs used to generate random inputs
    async (dev, a) => ddot(dev, a.n, a.x, a.incx, a.y, a.incy), // GPU call
    stdlibReference, // CPU reference
    forwardFactor, // |err| / (n * eps * sum|x_i*y_i|) — see helpers.js
  );
});

// Small hand-picked scenarios loaded from edge-cases.json. Expected output is
// computed live from stdlib, not hardcoded. Unlike sdot's exact-equality
// assertion, these go through forwardFactor: double-double is ~48 bits, so a
// ddot result is not expected to be bit-identical to a true f64 reference.
test("ddot edge cases", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n, // vector length
        x: new Float64Array(c.x), // input vector
        incx: c.incx, // stride through x
        y: new Float64Array(c.y), // input vector
        incy: c.incy, // stride through y
      };
      const got = await ddot(
        device, // GPU device
        a.n, // vector length
        a.x, // input vector
        a.incx, // stride through x
        a.y, // input vector
        a.incy, // stride through y
      );
      const expected = stdlibReference(a);
      const factor = forwardFactor(got, expected, a);
      assert.ok(
        factor <= THRESHOLD,
        `${c.label}: got ${got.dot}, expected ${expected} (forward factor ${factor} > ${THRESHOLD})`,
      );
    });
  }
});

// n=0 has zero logical elements to touch, so the only correct dot product is
// exactly 0. The edge-cases block above only asserts "does not throw" for
// n<=0 entries, so an implementation that mishandles n=0 (e.g. dispatches a
// pass over stale buffer contents) could still pass everything above.
test("ddot zero-dimension (regression)", async () => {
  const x = randomFloat64Array(8, -1, 1, 300);
  const y = randomFloat64Array(8, -1, 1, 301);

  const { dot: got } = await ddot(device, 0, x, 1, y, 1);

  assert.strictEqual(got, 0);
});
