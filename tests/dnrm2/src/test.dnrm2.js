import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { dnrm2 } from "wgblas/dnrm2";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures } from "../../helpers/fixtures.js";
// Fixtures use a relative-error forward factor against double-double's own
// epsilon rather than raw ULP64 — see helpers.js.
import { forwardFactor } from "../helpers.js";
import { dnrm2Reference as stdlibReference } from "../../helpers/stdlib.js";
import edgeCases from "../edge-cases.json" with { type: "json" };

const NUM_RUNS = 100;
// Forward-error cap, pinned to the high-performance/NVIDIA-calibrated bound
// (see tests/drot/src/test.drot.js) — calibrated against real hardware:
// observed worst case across thousands of random trials (spanning normal
// magnitudes, all-zero vectors, and magnitudes that would overflow/underflow
// naive f32 squaring) stayed under ~2 on high-performance. Not expected to
// clear on the low-power backend (previously calibrated at ~1700-8000 there).
const THRESHOLD = 10;

let device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => {
  cleanup();
});

// x64 derives genuine float64 values from x.json (see derive64 in
// validation.js) — the 64 variant specifically so fixtures generate wide
// doubles (float64Arb), not floatArb's f32-exact values, which would always
// double-double-split to a zero lo component.
const validationSpecs = {
  device: loadParam("device"),
  n: loadParam("n"),
  incx: loadParam("incx"),
  x: loadParam("x64"),
};

// Cap n for fixtures — validationSpecs allows up to 1000, which makes property tests slow.
const fixtureSpecs = {
  ...validationSpecs,
  n: { ...validationSpecs.n, range: { min: 1, max: 50 } },
};

test("dnrm2 validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => dnrm2(a.device, a.n, a.x, a.incx),
    { device },
  );
});

test("dnrm2 fixtures", async (t) => {
  await runFixtures(
    t, // node:test context
    "dnrm2", // routine name — used in the diagnostic label
    device, // WebGPU device instance
    NUM_RUNS, // 100 random inputs
    THRESHOLD, // forward error factor cap — see above
    fixtureSpecs, // param specs used to generate random inputs
    async (dev, a) => dnrm2(dev, a.n, a.x, a.incx), // GPU call
    stdlibReference, // CPU reference
    (gpu, ref) => forwardFactor(gpu, ref), // eps * |ref| — see helpers.js
  );
});

// Small hand-picked scenarios loaded from edge-cases.json. Expected output is
// computed live from stdlib, not hardcoded. Unlike snrm2's raw-ULP
// assertion, these go through forwardFactor: double-double is ~48 bits, so
// a dnrm2 result is not expected to be bit-identical to a true f64 reference.
test("dnrm2 edge cases", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n, // vector length
        x: new Float64Array(c.x), // input vector
        incx: c.incx, // stride through x
      };
      const got = await dnrm2(
        device, // GPU device
        a.n, // vector length
        a.x, // input vector
        a.incx, // stride through x
      );
      const expected = stdlibReference(a);
      const factor = forwardFactor(got, expected);
      assert.ok(
        factor <= THRESHOLD,
        `${c.label}: got ${got.nrm2}, expected ${expected} (forward factor ${factor} > ${THRESHOLD})`,
      );
    });
  }
});

// n=0 must return exactly 0 (the L2 norm of an empty vector), matching
// snrm2's own contract — no GPU dispatch happens in that case.
test("dnrm2 zero-dimension (regression)", async () => {
  const got = await dnrm2(device, 0, new Float64Array([1, 2, 3]), 1);
  assert.equal(got.nrm2, 0);
});

// Edge cases are 1-3 elements and fixtures cap n at 50, so the three-
// accumulator path (big / medium / small DD sums at fixed power-of-two
// scales, Inf/NaN tracked by flag — see dnrm2.wgsl) only meets its
// interesting inputs here: vectors spread over many workgroups mixing
// magnitudes across the 2^-38 and 2^50 thresholds, strided x, and Inf/NaN
// (worst observed forward factor ~3, inside the fixtures' cap).
// The reference is the exact norm in float64 with compensated (Neumaier)
// summation — a plain float64 sum of 2^18 squares carries ~sqrt(n)·2^-53 of
// its own error, the same order as the double-double budget being checked.
test("dnrm2 scaled accumulation across magnitudes (regression)", async (t) => {
  const norm64 = (x, n, inc) => {
    let s = 0;
    let c = 0;
    for (let i = 0; i < n; i++) {
      const v = x[i * inc] * x[i * inc];
      const u = s + v;
      c += Math.abs(s) >= Math.abs(v) ? s - u + v : v - u + s;
      s = u;
    }
    return Math.sqrt(s + c);
  };
  const N = 1 << 18;
  const cases = [
    ["medium only", (i) => Math.sin(i) * 3],
    [
      "big + medium (1e30 every 4096th)",
      (i) => (i % 4096 === 7 ? 1e30 * (1 + Math.sin(i) / 3) : Math.cos(i)),
    ],
    [
      "near f32 max (1e37 every 65536th)",
      (i) => (i % 65536 === 3 ? 1e37 : 1 + Math.sin(i) / 7),
    ],
    [
      "small + medium",
      (i) =>
        i % 1024 === 0
          ? 1e-5 * (1 + Math.sin(i) / 5)
          : 1e-25 * (1 + (i % 7) / 3),
    ],
    // Not 1e-30: below ~2^-102 an input's own DD lo half is a denormal,
    // which the GPU flushes on load — a representation floor, not dnrm2.
    ["small only (1e-25)", (i) => 1e-25 * (1 + Math.sin(i) / 4)],
    [
      "values straddling 2^50 and 2^-38",
      (i) =>
        [
          2 ** 50 * 1.5,
          2 ** 50 * 0.75,
          2 ** -38 * 1.5,
          2 ** -38 * 0.75,
          Math.PI,
        ][i % 5],
    ],
  ];
  for (const inc of [1, 3])
    for (const [label, gen] of cases) {
      await t.test(`${label}, incx=${inc}`, async () => {
        const x = new Float64Array((N - 1) * inc + 1);
        for (let i = 0; i < N; i++) x[i * inc] = gen(i);
        const got = await dnrm2(device, N, x, inc);
        const factor = forwardFactor(got, norm64(x, N, inc));
        assert.ok(
          factor <= THRESHOLD,
          `got ${got.nrm2}, forward factor ${factor}`,
        );
      });
    }

  const base = (seed) => {
    const x = new Float64Array(N);
    for (let i = 0; i < N; i++) x[i] = Math.sin(i * seed);
    return x;
  };
  await t.test("Inf element → Infinity", async () => {
    const x = base(1);
    x[12345] = Infinity;
    assert.strictEqual((await dnrm2(device, N, x, 1)).nrm2, Infinity);
  });
  await t.test("NaN element → NaN", async () => {
    const x = base(2);
    x[54321] = NaN;
    assert.ok(Number.isNaN((await dnrm2(device, N, x, 1)).nrm2));
  });
  await t.test(
    "NaN with Inf, big and small elements present → NaN",
    async () => {
      const x = base(3);
      x[1] = 1e30;
      x[2] = 1e-30;
      x[3] = -Infinity;
      x[999] = NaN;
      assert.ok(Number.isNaN((await dnrm2(device, N, x, 1)).nrm2));
    },
  );
});
