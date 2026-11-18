import {
  GpuMatrix,
  GpuVector,
  cleanup,
  gpuName,
  init,
  saxpy,
  sgemm,
  sscal,
} from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/utils/test.device.js
var primaryPref = getPowerPreference();
var secondaryPref =
  primaryPref === "low-power" ? "high-performance" : "low-power";
var primary;
var secondary = null;
var skipReason = null;
function needsTwoDevices(t) {
  if (secondary) return false;
  t.skip(`second device unavailable: ${skipReason}`);
  return true;
}
before(async () => {
  primary = await init({ powerPreference: primaryPref });
  try {
    const other = await init({ powerPreference: secondaryPref });
    if (other === primary)
      skipReason = `both preferences resolved to the same device`;
    else secondary = other;
  } catch (err) {
    skipReason = err.message;
  }
});
after(() => cleanup());
test("init() yields two distinct devices for two option sets", (t) => {
  if (needsTwoDevices(t)) return;
  assert_default.notEqual(
    secondary,
    primary,
    "expected a second, independent device",
  );
  assert_default.ok(
    gpuName(primary).description,
    "primary adapter should report a description",
  );
  assert_default.ok(
    gpuName(secondary).description,
    "secondary adapter should report a description",
  );
});
test("a Level 1 routine is correct on each device", async (t) => {
  if (needsTwoDevices(t)) return;
  const mk = () => new Float32Array([1, 2, 3, 4, 5]);
  const expected = new Float32Array([3, 6, 9, 12, 15]);
  assert_default.deepEqual(
    (await sscal(primary, 5, 3, mk(), 1)).x,
    expected,
    "primary",
  );
  assert_default.deepEqual(
    (await sscal(secondary, 5, 3, mk(), 1)).x,
    expected,
    "secondary",
  );
});
test("a Level 3 routine is correct on each device", async (t) => {
  if (needsTwoDevices(t)) return;
  const A = new Float32Array([1, 2, 3, 4]);
  const I = new Float32Array([1, 0, 0, 1]);
  const run = (dev) =>
    sgemm(
      dev,
      "no-transpose",
      "no-transpose",
      2,
      2,
      2,
      1,
      A,
      2,
      I,
      2,
      0,
      new Float32Array(4),
      2,
    );
  assert_default.deepEqual((await run(primary)).C, A, "primary");
  assert_default.deepEqual((await run(secondary)).C, A, "secondary");
});
test("both devices run concurrently without cross-talk", async (t) => {
  if (needsTwoDevices(t)) return;
  const mk = () => new Float32Array([1, 2, 3, 4]);
  const [a, b] = await Promise.all([
    sscal(primary, 4, 2, mk(), 1),
    sscal(secondary, 4, 5, mk(), 1),
  ]);
  assert_default.deepEqual(a.x, new Float32Array([2, 4, 6, 8]), "primary");
  assert_default.deepEqual(b.x, new Float32Array([5, 10, 15, 20]), "secondary");
});
test("an operand from the other device is refused, naming it", async (t) => {
  if (needsTwoDevices(t)) return;
  const v = GpuVector.from(secondary, new Float32Array([1, 2, 3]));
  try {
    await assert_default.rejects(
      () => sscal(primary, 3, 2, v, 1),
      (err) => {
        assert_default.match(
          err.message,
          /^sscal: x belongs to a different GPUDevice/,
        );
        assert_default.match(err.message, /cannot be shared across devices/);
        return true;
      },
    );
  } finally {
    v.destroy();
  }
});
test("the guard names whichever operand is foreign", async (t) => {
  if (needsTwoDevices(t)) return;
  const x = GpuVector.from(primary, new Float32Array([1, 2, 3]));
  const y = GpuVector.from(secondary, new Float32Array([1, 2, 3]));
  try {
    await assert_default.rejects(
      () => saxpy(primary, 3, 2, x, 1, y, 1),
      (err) => {
        assert_default.match(
          err.message,
          /^saxpy: y belongs to a different GPUDevice/,
        );
        return true;
      },
    );
  } finally {
    x.destroy();
    y.destroy();
  }
});
test("GPU-resident handles record the device that owns them", () => {
  const v = GpuVector.from(primary, new Float32Array([1, 2, 3]));
  const m = GpuMatrix.from(primary, new Float32Array([1, 2, 3, 4]), 2, 2);
  assert_default.equal(v.device, primary);
  assert_default.equal(m.device, primary);
  v.destroy();
  m.destroy();
});
test("the device-less call form still resolves to the first init", () => {
  const v = GpuVector.from(new Float32Array([1, 2, 3]));
  assert_default.equal(v.device, primary);
  v.destroy();
});
test("the cross-device guard does not fire on matching devices", async () => {
  const v = GpuVector.from(primary, new Float32Array([1, 2, 3]));
  try {
    await sscal(primary, 3, 2, v, 1);
    assert_default.deepEqual(await v.read(), new Float32Array([2, 4, 6]));
  } finally {
    v.destroy();
  }
});
