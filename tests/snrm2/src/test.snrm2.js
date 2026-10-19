import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, randomFloat32Array } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";
import { snrm2 } from "wgblas/snrm2";
import { loadParam, runValidation } from "../../helpers/validation.js";
import { runFixtures, ulpDiff } from "../../helpers/fixtures.js";
import { snrm2Reference as stdlibReference } from "../../helpers/stdlib.js";
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
  n: loadParam("n"),
  incx: loadParam("incx"),
  x: loadParam("x"),
};

test("snrm2 validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => snrm2(a.device, a.n, a.x, a.incx),
    { device },
  );
});

test("snrm2 fixtures", async (t) => {
  await runFixtures(
    t, // node:test context
    "snrm2", // routine name — used in the diagnostic label
    device, // WebGPU device instance
    NUM_RUNS, // 100 random inputs
    50, // threshold 50 ULP — GPU uses tree reduction, CPU is sequential; rounding order differs
    validationSpecs, // param specs used to generate random inputs
    async (dev, a) => snrm2(dev, a.n, a.x, a.incx), // GPU call
    stdlibReference, // CPU reference
    (gpu, ref) => ulpDiff(gpu.nrm2, ref), // raw ULP difference between scalar results
  );
});

// Small hand-picked scenarios loaded from edge-cases.json. Expected output is
// computed live from stdlib, not hardcoded.
test("snrm2 edge cases", async (t) => {
  for (const c of edgeCases) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n, // vector length
        x: new Float32Array(c.x), // input vector
        incx: c.incx, // stride through x
      };
      const { nrm2: got } = await snrm2(
        device, // GPU device
        a.n, // vector length
        a.x, // input vector
        a.incx, // stride through x
      );
      const expected = stdlibReference(a);
      assert.strictEqual(got, expected);
    });
  }
});

// n=0 has zero logical elements to touch, so the only correct norm is
// exactly 0. The edge-cases block above only asserts "does not throw" for
// n<=0 entries, so an implementation that mishandles n=0 (e.g. dispatches a
// pass over stale buffer contents) could still pass everything above.
test("snrm2 zero-dimension (regression)", async () => {
  const x = randomFloat32Array(8, -1, 1, 300);

  const { nrm2: got } = await snrm2(device, 0, x, 1);

  assert.strictEqual(got, 0);
});

// Edge cases are 1-3 elements and fixtures are random [-1,1] data, so the
// three-accumulator path (big / medium / small sums with fixed power-of-two
// scales — see snrm2.wgsl) only meets its interesting inputs here: vectors
// spread over many workgroups mixing magnitudes across the 2^-63 and 2^50
// thresholds, a medium sum large enough to stress f32, strided x, and
// Inf/NaN propagation. Reference: the exact norm in float64 (nothing here
// overflows or underflows f64 squaring), within the fixtures' 50-ULP budget.
test("snrm2 scaled accumulation across magnitudes (regression)", async (t) => {
  const norm64 = (x, n, inc) => {
    let s = 0;
    for (let i = 0; i < n; i++) s += x[i * inc] * x[i * inc];
    return Math.sqrt(s);
  };
  const N = 1 << 20;
  const cases = [
    ["medium only, large n", (i) => Math.sin(i) * 3],
    [
      "big + medium (1e30 every 4096th)",
      (i) => (i % 4096 === 7 ? 1e30 : Math.cos(i)),
    ],
    ["near f32 max (1e37 every 65536th)", (i) => (i % 65536 === 3 ? 1e37 : 1)],
    [
      "small + medium (1e-25 mostly, 1e-5 every 1024th)",
      (i) => (i % 1024 === 0 ? 1e-5 : 1e-25 * (1 + (i % 7))),
    ],
    ["small only (1e-30)", (i) => 1e-30 * (1 + (i % 5))],
    [
      "values straddling 2^50 and 2^-63",
      (i) =>
        [2 ** 50 * 1.5, 2 ** 50 * 0.75, 2 ** -63 * 1.5, 2 ** -63 * 0.75, 1][
          i % 5
        ],
    ],
  ];
  for (const inc of [1, 3])
    for (const [label, gen] of cases) {
      await t.test(`${label}, incx=${inc}`, async () => {
        const x = new Float32Array((N - 1) * inc + 1);
        for (let i = 0; i < N; i++) x[i * inc] = gen(i);
        const { nrm2: got } = await snrm2(device, N, x, inc);
        const want = Math.fround(norm64(x, N, inc));
        assert.ok(Number.isFinite(got), `got ${got}`);
        const ulps = ulpDiff(got, want);
        assert.ok(ulps <= 50, `got ${got}, want ${want} (${ulps} ULP)`);
      });
    }

  await t.test("Inf element → Infinity", async () => {
    const x = randomFloat32Array(N, -1, 1, 7);
    x[12345] = Infinity;
    const { nrm2: got } = await snrm2(device, N, x, 1);
    assert.strictEqual(got, Infinity);
  });
  await t.test("NaN element → NaN", async () => {
    const x = randomFloat32Array(N, -1, 1, 8);
    x[54321] = NaN;
    const { nrm2: got } = await snrm2(device, N, x, 1);
    assert.ok(Number.isNaN(got), `got ${got}`);
  });
  await t.test("NaN with big and small elements present → NaN", async () => {
    const x = randomFloat32Array(N, -1, 1, 9);
    x[1] = 1e30;
    x[2] = 1e-30;
    x[999] = NaN;
    const { nrm2: got } = await snrm2(device, N, x, 1);
    assert.ok(Number.isNaN(got), `got ${got}`);
  });
});
