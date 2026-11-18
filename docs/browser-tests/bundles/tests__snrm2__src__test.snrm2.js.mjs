import { edge_cases_default } from "./chunk-2E5YOZ4J.mjs";
import { snrm2Reference } from "./chunk-3I5F4OKA.mjs";
import {
  loadParam,
  runFixtures,
  runValidation,
  ulpDiff,
} from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, init, snrm2 } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import { randomFloat32Array } from "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/snrm2/src/test.snrm2.js
var NUM_RUNS = 100;
var device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => {
  cleanup();
});
var validationSpecs = {
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
    t,
    // node:test context
    "snrm2",
    // routine name — used in the diagnostic label
    device,
    // WebGPU device instance
    NUM_RUNS,
    // 100 random inputs
    50,
    // threshold 50 ULP — GPU uses tree reduction, CPU is sequential; rounding order differs
    validationSpecs,
    // param specs used to generate random inputs
    async (dev, a) => snrm2(dev, a.n, a.x, a.incx),
    // GPU call
    snrm2Reference,
    // CPU reference
    (gpu, ref) => ulpDiff(gpu.nrm2, ref),
    // raw ULP difference between scalar results
  );
});
test("snrm2 edge cases", async (t) => {
  for (const c of edge_cases_default) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,
        // vector length
        x: new Float32Array(c.x),
        // input vector
        incx: c.incx,
        // stride through x
      };
      const { nrm2: got } = await snrm2(
        device,
        // GPU device
        a.n,
        // vector length
        a.x,
        // input vector
        a.incx,
        // stride through x
      );
      const expected = snrm2Reference(a);
      assert_default.strictEqual(got, expected);
    });
  }
});
test("snrm2 zero-dimension (regression)", async () => {
  const x = randomFloat32Array(8, -1, 1, 300);
  const { nrm2: got } = await snrm2(device, 0, x, 1);
  assert_default.strictEqual(got, 0);
});
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
        assert_default.ok(Number.isFinite(got), `got ${got}`);
        const ulps = ulpDiff(got, want);
        assert_default.ok(ulps <= 50, `got ${got}, want ${want} (${ulps} ULP)`);
      });
    }
  await t.test("Inf element \u2192 Infinity", async () => {
    const x = randomFloat32Array(N, -1, 1, 7);
    x[12345] = Infinity;
    const { nrm2: got } = await snrm2(device, N, x, 1);
    assert_default.strictEqual(got, Infinity);
  });
  await t.test("NaN element \u2192 NaN", async () => {
    const x = randomFloat32Array(N, -1, 1, 8);
    x[54321] = NaN;
    const { nrm2: got } = await snrm2(device, N, x, 1);
    assert_default.ok(Number.isNaN(got), `got ${got}`);
  });
  await t.test(
    "NaN with big and small elements present \u2192 NaN",
    async () => {
      const x = randomFloat32Array(N, -1, 1, 9);
      x[1] = 1e30;
      x[2] = 1e-30;
      x[999] = NaN;
      const { nrm2: got } = await snrm2(device, N, x, 1);
      assert_default.ok(Number.isNaN(got), `got ${got}`);
    },
  );
});
