import { edge_cases_default } from "./chunk-7VO7HCHQ.mjs";
import { isamaxReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures, runValidation } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, init, isamax } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/isamax/src/test.isamax.js
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
test("isamax validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => isamax(a.device, a.n, a.x, a.incx),
    { device },
  );
});
test("isamax fixtures", async (t) => {
  await runFixtures(
    t,
    // node:test context
    "isamax",
    // routine name — used in the diagnostic label
    device,
    // WebGPU device instance
    NUM_RUNS,
    // 100 random inputs
    0,
    // threshold 0 — index must match exactly.
    validationSpecs,
    // param specs used to generate random inputs
    async (dev, a) => isamax(dev, a.n, a.x, a.incx),
    // GPU call
    isamaxReference,
    // CPU reference
    (gpu, ref) => (gpu.index === ref ? 0 : 1),
    // 0 if correct, 1 if wrong
  );
});
test("isamax edge cases", async (t) => {
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
      const { index: got } = await isamax(
        device,
        // GPU device
        a.n,
        // vector length
        a.x,
        // input vector
        a.incx,
        // stride through x
      );
      const expected = isamaxReference(a);
      assert_default.strictEqual(got, expected);
    });
  }
});
test("isamax zero-dimension (regression)", async () => {
  const { index: got } = await isamax(
    device,
    0,
    new Float32Array([1, 2, 3, 4]),
    1,
  );
  assert_default.strictEqual(got, -1);
  for (const n of [0, -3])
    assert_default.strictEqual(
      (await isamax(device, n, new Float32Array([1, 2]), 1)).index,
      isamaxReference({ n, x: new Float32Array([1, 2]), incx: 1 }),
    );
});
test("isamax NaN handling", async (t) => {
  const run = async (arr) =>
    (await isamax(device, arr.length, new Float32Array(arr), 1)).index;
  const N = NaN,
    Inf = Infinity;
  await t.test("NaN elements are skipped, not selected", async () => {
    assert_default.equal(
      await run([1, N, 7, 3]),
      2,
      "the largest non-NaN element should win",
    );
    assert_default.equal(
      await run([1, 2, 3, N]),
      2,
      "a trailing NaN must not be selected",
    );
  });
  await t.test("an all-NaN vector returns index 0", async () => {
    assert_default.equal(await run([N, N, N, N]), 0);
  });
  await t.test(
    "a leading NaN is skipped \u2014 documented divergence from CBLAS",
    async () => {
      assert_default.equal(
        await run([N, 5, 2, 3]),
        1,
        "should find the largest finite element",
      );
      assert_default.equal(await run([N, Inf, 2, 3]), 1);
    },
  );
  await t.test("infinities compare normally", async () => {
    assert_default.equal(
      await run([1, Inf, 2, 3]),
      1,
      "+Infinity is the maximum",
    );
    assert_default.equal(
      await run([1, -Inf, 2, 3]),
      1,
      "|-Infinity| is the maximum",
    );
  });
});
