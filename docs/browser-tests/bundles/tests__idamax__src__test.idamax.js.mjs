import { edge_cases_default } from "./chunk-DKLOUELP.mjs";
import { argsInF32Range, values, withValues } from "./chunk-VGOUGUHQ.mjs";
import { idamaxReference } from "./chunk-3I5F4OKA.mjs";
import { loadParam, runFixtures, runValidation } from "./chunk-LZO66Q5W.mjs";
import "./chunk-AKOZLLM3.mjs";
import "./chunk-MPINAVL4.mjs";
import "./chunk-FJ5NEZFH.mjs";
import { cleanup, idamax, init } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/idamax/src/test.idamax.js
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
  x: loadParam("x64"),
};
test("idamax validation", async (t) => {
  await runValidation(
    t,
    validationSpecs,
    (a) => idamax(a.device, a.n, a.x, a.incx),
    { device },
  );
});
test("idamax fixtures", async (t) => {
  await runFixtures(
    t,
    // node:test context
    "idamax",
    // routine name — used in the diagnostic label
    device,
    // WebGPU device instance
    NUM_RUNS,
    // 100 random inputs
    0,
    // threshold 0 — index must match exactly.
    validationSpecs,
    // param specs used to generate random inputs
    async (dev, a) => idamax(dev, a.n, a.x, a.incx),
    // GPU call
    idamaxReference,
    // CPU reference
    (gpu, ref) => (gpu.index === ref ? 0 : 1),
    // 0 if correct, 1 if wrong
  );
});
test("idamax edge cases", async (t) => {
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
      const { index: got } = await idamax(
        device,
        // GPU device
        a.n,
        // vector length
        a.x,
        // input vector
        a.incx,
        // stride through x
      );
      const expected = idamaxReference(a);
      assert_default.strictEqual(got, expected);
    });
  }
});
test("idamax zero-dimension (regression)", async () => {
  const { index: got } = await idamax(
    device,
    0,
    new Float64Array([1, 2, 3, 4]),
    1,
  );
  assert_default.strictEqual(got, -1);
  for (const n of [0, -3])
    assert_default.strictEqual(
      (await idamax(device, n, new Float64Array([1, 2]), 1)).index,
      idamaxReference({ n, x: new Float64Array([1, 2]), incx: 1 }),
    );
});
test("idamax NaN handling", async (t) => {
  const run = async (arr) =>
    (await idamax(device, arr.length, new Float64Array(arr), 1)).index;
  const N = NaN,
    Inf = Infinity;
  await t.test("NaN elements are skipped, not selected", async () => {
    assert_default.equal(await run([1, N, 7, 3]), 2);
    assert_default.equal(await run([1, 2, 3, N]), 2);
  });
  await t.test("an all-NaN vector returns index 0", async () => {
    assert_default.equal(await run([N, N, N, N]), 0);
  });
  await t.test(
    "a leading NaN is skipped \u2014 documented divergence from CBLAS",
    async () => {
      assert_default.equal(await run([N, 5, 2, 3]), 1);
      assert_default.equal(await run([N, Inf, 2, 3]), 1);
    },
  );
  await t.test("infinities compare normally", async () => {
    assert_default.equal(await run([1, Inf, 2, 3]), 1);
    assert_default.equal(await run([1, -Inf, 2, 3]), 1);
  });
});
test("idamax IEEE special values (regression)", async () => {
  for (const [entries, n] of [
    [{ 2: Infinity }, 7],
    [{ 3: -Infinity, 5: Infinity }, 7],
    [{ 4e3: -Infinity }, 5e3],
  ]) {
    const a = { n, x: withValues(values(n, 1), entries), incx: 1 };
    const got = await idamax(device, a.n, a.x, a.incx);
    assert_default.equal(got.index, idamaxReference(a), `n=${n} index`);
  }
});
test("idamax f32 exponent range (regression)", async () => {
  for (const x of [
    new Float64Array([1e300, 1e301, 5]),
    new Float64Array([1e-50, 0.5]),
  ]) {
    const a = { n: x.length, x, incx: 1 };
    const got = await idamax(device, a.n, a.x, a.incx);
    assert_default.equal(got.index, idamaxReference(argsInF32Range(a)));
  }
});
