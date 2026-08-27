// Two GPUs, one process.
//
// init() caches a device per distinct option set, so the two powerPreference
// values resolve to separate adapters (on a dual-GPU machine: discrete and
// integrated). Every internal helper takes the caller's device rather than
// reading a module singleton, so routines dispatch to whichever device they
// were handed.
//
// Portability: a second device is not guaranteed. On a single-GPU host the two
// preferences usually still yield two distinct GPUDevices backed by the same
// hardware, which exercises everything here — but a CI runner may refuse the
// second adapter outright, and some hosts hand back the very same device. Both
// cases skip the two-device tests instead of failing; the single-device
// assertions always run. Nothing here asserts *which* adapter gets picked.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup, gpuName, sscal, saxpy, sgemm, GpuVector, GpuMatrix } from "wgblas";
import { getPowerPreference } from "../../helpers/device.js";

// Honour WGBLAS_POWER_PREFERENCE for the primary, as every other suite does,
// and ask for the opposite preference to get a second device.
const primaryPref = getPowerPreference();
const secondaryPref = primaryPref === "low-power" ? "high-performance" : "low-power";

let primary;
let secondary = null;
let skipReason = null;

/** Marks a test skipped when this host could not provide a second device. */
function needsTwoDevices(t) {
  if (secondary) return false;
  t.skip(`second device unavailable: ${skipReason}`);
  return true;
}

before(async () => {
  primary = await init({ powerPreference: primaryPref });
  try {
    const other = await init({ powerPreference: secondaryPref });
    if (other === primary) skipReason = `both preferences resolved to the same device`;
    else secondary = other;
  } catch (err) {
    skipReason = err.message;
  }
});
after(() => cleanup());

test("init() yields two distinct devices for two option sets", (t) => {
  if (needsTwoDevices(t)) return;
  assert.notEqual(secondary, primary, "expected a second, independent device");
  assert.ok(gpuName(primary).description, "primary adapter should report a description");
  assert.ok(gpuName(secondary).description, "secondary adapter should report a description");
});

test("a Level 1 routine is correct on each device", async (t) => {
  if (needsTwoDevices(t)) return;
  const mk = () => new Float32Array([1, 2, 3, 4, 5]);
  const expected = new Float32Array([3, 6, 9, 12, 15]);
  assert.deepEqual((await sscal(primary, 5, 3, mk(), 1)).x, expected, "primary");
  assert.deepEqual((await sscal(secondary, 5, 3, mk(), 1)).x, expected, "secondary");
});

test("a Level 3 routine is correct on each device", async (t) => {
  if (needsTwoDevices(t)) return;
  // sgemm exercises pipeline compilation, a 2D dispatch and readback — the
  // paths that would silently have used the singleton before the refactor.
  const A = new Float32Array([1, 2, 3, 4]);
  const I = new Float32Array([1, 0, 0, 1]);
  const run = (dev) =>
    sgemm(dev, "no-transpose", "no-transpose", 2, 2, 2, 1, A, 2, I, 2, 0, new Float32Array(4), 2);
  assert.deepEqual((await run(primary)).C, A, "primary");
  assert.deepEqual((await run(secondary)).C, A, "secondary");
});

test("both devices run concurrently without cross-talk", async (t) => {
  if (needsTwoDevices(t)) return;
  // Different alpha per device: if either had leaked onto the other's queue or
  // buffers, one of these results would be wrong.
  const mk = () => new Float32Array([1, 2, 3, 4]);
  const [a, b] = await Promise.all([
    sscal(primary, 4, 2, mk(), 1),
    sscal(secondary, 4, 5, mk(), 1),
  ]);
  assert.deepEqual(a.x, new Float32Array([2, 4, 6, 8]), "primary");
  assert.deepEqual(b.x, new Float32Array([5, 10, 15, 20]), "secondary");
});

test("an operand from the other device is refused, naming it", async (t) => {
  if (needsTwoDevices(t)) return;
  const v = GpuVector.from(secondary, new Float32Array([1, 2, 3]));
  try {
    await assert.rejects(
      () => sscal(primary, 3, 2, v, 1),
      (err) => {
        assert.match(err.message, /^sscal: x belongs to a different GPUDevice/);
        assert.match(err.message, /cannot be shared across devices/);
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
    await assert.rejects(
      () => saxpy(primary, 3, 2, x, 1, y, 1),
      (err) => {
        assert.match(err.message, /^saxpy: y belongs to a different GPUDevice/);
        return true;
      },
    );
  } finally {
    x.destroy();
    y.destroy();
  }
});

// ── Single-device assertions: these run everywhere ───────────────────────────

test("GPU-resident handles record the device that owns them", () => {
  const v = GpuVector.from(primary, new Float32Array([1, 2, 3]));
  const m = GpuMatrix.from(primary, new Float32Array([1, 2, 3, 4]), 2, 2);
  assert.equal(v.device, primary);
  assert.equal(m.device, primary);
  v.destroy();
  m.destroy();
});

test("the device-less call form still resolves to the first init", () => {
  // 234 existing call sites use this form; it must keep working.
  const v = GpuVector.from(new Float32Array([1, 2, 3]));
  assert.equal(v.device, primary);
  v.destroy();
});

test("the cross-device guard does not fire on matching devices", async () => {
  const v = GpuVector.from(primary, new Float32Array([1, 2, 3]));
  try {
    await sscal(primary, 3, 2, v, 1);
    assert.deepEqual(await v.read(), new Float32Array([2, 4, 6]));
  } finally {
    v.destroy();
  }
});
