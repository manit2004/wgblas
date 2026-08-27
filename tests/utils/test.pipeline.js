// Shader compilation and pipeline caching.
//
// getPipeline memoizes compiled pipelines in a WeakMap keyed by GPUDevice, so
// they are released when the device is. The cache key is shader-name(s) plus
// entry point. loadShader compiles on the device it is *given* — it previously
// read the module-level singleton instead, which meant a second device would
// cache a pipeline compiled for the first one under its own key, and WebGPU
// rejects mixing pipelines and bind groups across devices.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { getPipeline, loadShader } from "../../src/util/pipeline.mjs";
import { uploadBuffer, createParamsBuffer, destroyBuffers } from "../../src/util/buffer.mjs";
import { createBindGroup } from "../../src/util/bindgroup.mjs";
import { getPowerPreference } from "../helpers/device.js";

const primaryPref = getPowerPreference();
const secondaryPref = primaryPref === "low-power" ? "high-performance" : "low-power";

let device;
let secondary = null;
let skipReason = null;

before(async () => {
  device = await init({ powerPreference: primaryPref });
  try {
    const other = await init({ powerPreference: secondaryPref });
    if (other === device) skipReason = "both preferences resolved to the same device";
    else secondary = other;
  } catch (err) {
    skipReason = err.message;
  }
});
after(() => cleanup());

test("compiles a shader into a compute pipeline", async () => {
  const pipeline = await getPipeline(device, "sscal");
  assert.ok(pipeline, "expected a pipeline");
  assert.ok(pipeline.getBindGroupLayout(0), "pipeline should expose a derived bind group layout");
});

test("the same shader on the same device is returned from cache", async () => {
  const a = await getPipeline(device, "sscal");
  const b = await getPipeline(device, "sscal");
  assert.equal(b, a, "expected the identical cached pipeline object");
});

test("different shaders get different pipelines", async () => {
  const sscal = await getPipeline(device, "sscal");
  const saxpy = await getPipeline(device, "saxpy");
  assert.notEqual(saxpy, sscal, "distinct shaders must not share a cache entry");
});

test("concatenated shader lists are cached under their combined key", async () => {
  // WGSL has no #include, so a shader reusing another's helpers is compiled by
  // concatenating sources; the cache key must cover the whole list.
  const deps = ["f64/dekker", "f64/utils/abs", "f64/utils/add"];
  const combined = await getPipeline(device, [...deps, "dasum"]);
  const again = await getPipeline(device, [...deps, "dasum"]);
  assert.equal(again, combined, "the same list should hit the cache");
  // A different tail over the same deps is a different program.
  const other = await getPipeline(device, [...deps, "reduction/sumF64"]);
  assert.notEqual(other, combined, "a list must be keyed by its whole contents");
});

test("the cache is keyed per device", async (t) => {
  if (!secondary) {
    t.skip(`second device unavailable: ${skipReason}`);
    return;
  }
  // The regression this guards: a pipeline compiled for `device` must never be
  // handed back for `secondary`.
  const onPrimary = await getPipeline(device, "sscal");
  const onSecondary = await getPipeline(secondary, "sscal");
  assert.notEqual(onSecondary, onPrimary, "each device needs its own compiled pipeline");
  // ...and each device's entry stays stable.
  assert.equal(await getPipeline(device, "sscal"), onPrimary);
  assert.equal(await getPipeline(secondary, "sscal"), onSecondary);
});

test("loadShader compiles on the device it is given, not a cached one", async (t) => {
  if (!secondary) {
    t.skip(`second device unavailable: ${skipReason}`);
    return;
  }
  // A layout belongs to the device that compiled it, and building a bind group
  // from it on any other device is a validation error. So: ask loadShader for a
  // pipeline on `secondary`, then build a fully valid bind group for it *on
  // secondary*. That must be clean. If loadShader ignored its device argument
  // and compiled on the singleton instead, the layout would belong to `device`
  // and this would fault — which is exactly the bug being guarded.
  const pipeline = await loadShader(secondary, ["sscal"]);
  assert.ok(pipeline, "expected a pipeline from the secondary device");

  const x = uploadBuffer(secondary, new Float32Array([1, 2, 3]), "pipe-x", true);
  const params = createParamsBuffer(secondary, [
    { value: 3, type: "u32" }, { value: 2, type: "f32" }, { value: 1, type: "u32" },
  ], "pipe-params");
  try {
    secondary.pushErrorScope("validation");
    createBindGroup(secondary, pipeline.getBindGroupLayout(0), [x, params]);
    const err = await secondary.popErrorScope();
    assert.equal(err, null, "the layout must belong to the device loadShader was given");
  } finally {
    destroyBuffers(x, params);
  }
});

test("an unknown shader name fails loudly", async () => {
  await assert.rejects(
    () => getPipeline(device, "definitely-not-a-shader"),
    "expected a missing shader to reject rather than return undefined",
  );
});
