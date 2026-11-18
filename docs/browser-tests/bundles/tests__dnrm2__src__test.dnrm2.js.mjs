import { edge_cases_default, forwardFactor } from "./chunk-WF3S3BSE.mjs";
import {
  argsInF32Range,
  assertIeeeMatch,
  saturate,
  values,
  withValues,
} from "./chunk-VGOUGUHQ.mjs";
import { dnrm2Reference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures, runValidation } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, dnrm2, init } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/dnrm2/src/test.dnrm2.js
var NUM_RUNS = 100;
var THRESHOLD = 10;
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
  x: loadParam("x64"),
};
var fixtureSpecs = {
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
    t,
    // node:test context
    "dnrm2",
    // routine name — used in the diagnostic label
    device,
    // WebGPU device instance
    NUM_RUNS,
    // 100 random inputs
    THRESHOLD,
    // forward error factor cap — see above
    fixtureSpecs,
    // param specs used to generate random inputs
    async (dev, a) => dnrm2(dev, a.n, a.x, a.incx),
    // GPU call
    dnrm2Reference,
    // CPU reference
    (gpu, ref) => forwardFactor(gpu, ref),
    // eps * |ref| — see helpers.js
  );
});
test("dnrm2 edge cases", async (t) => {
  for (const c of edge_cases_default) {
    await t.test(c.label, async () => {
      const a = {
        n: c.n,
        // vector length
        x: new Float64Array(c.x),
        // input vector
        incx: c.incx,
        // stride through x
      };
      const got = await dnrm2(
        device,
        // GPU device
        a.n,
        // vector length
        a.x,
        // input vector
        a.incx,
        // stride through x
      );
      const expected = dnrm2Reference(a);
      const factor = forwardFactor(got, expected);
      assert_default.ok(
        factor <= THRESHOLD,
        `${c.label}: got ${got.nrm2}, expected ${expected} (forward factor ${factor} > ${THRESHOLD})`,
      );
    });
  }
});
test("dnrm2 zero-dimension (regression)", async () => {
  const got = await dnrm2(device, 0, new Float64Array([1, 2, 3]), 1);
  assert_default.equal(got.nrm2, 0);
});
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
        assert_default.ok(
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
  await t.test("Inf element \u2192 Infinity", async () => {
    const x = base(1);
    x[12345] = Infinity;
    assert_default.strictEqual((await dnrm2(device, N, x, 1)).nrm2, Infinity);
  });
  await t.test("NaN element \u2192 NaN", async () => {
    const x = base(2);
    x[54321] = NaN;
    assert_default.ok(Number.isNaN((await dnrm2(device, N, x, 1)).nrm2));
  });
  await t.test(
    "NaN with Inf, big and small elements present \u2192 NaN",
    async () => {
      const x = base(3);
      x[1] = 1e30;
      x[2] = 1e-30;
      x[3] = -Infinity;
      x[999] = NaN;
      assert_default.ok(Number.isNaN((await dnrm2(device, N, x, 1)).nrm2));
    },
  );
});
test("dnrm2 IEEE special values (regression)", async () => {
  for (const [entries, n] of [
    [{ 2: Infinity }, 7],
    [{ 3: -Infinity }, 5e3],
    [{ 2: NaN }, 7],
    [{ 4e3: NaN }, 5e3],
  ]) {
    const a = { n, x: withValues(values(n, 1), entries), incx: 1 };
    const got = await dnrm2(device, a.n, a.x, a.incx);
    assertIeeeMatch(got.nrm2, dnrm2Reference(a), `n=${n} nrm2`);
  }
});
test("dnrm2 f32 exponent range (regression)", async (t) => {
  for (const [label, x] of [
    ["inputs past f32's range", new Float64Array([1e150, 1e150, 1e150, 1e150])],
    [
      "inputs below f32's range",
      new Float64Array([1e-155, 1e-155, 1e-155, 1e-155]),
    ],
    ["one input below f32's range", new Float64Array([3, 1e-50, 4])],
  ])
    await t.test(label, async () => {
      const a = { n: x.length, x, incx: 1 };
      const got = await dnrm2(device, a.n, a.x, a.incx);
      assertIeeeMatch(
        got.nrm2,
        saturate(dnrm2Reference(argsInF32Range(a))),
        "nrm2",
      );
    });
});
