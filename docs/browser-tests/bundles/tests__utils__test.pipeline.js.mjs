import {
  cleanup,
  createBindGroup,
  createParamsBuffer,
  destroyBuffers,
  getPipeline,
  init,
  loadShader,
  uploadBuffer,
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

// tests/utils/test.pipeline.js
var primaryPref = getPowerPreference();
var secondaryPref =
  primaryPref === "low-power" ? "high-performance" : "low-power";
var device;
var secondary = null;
var skipReason = null;
before(async () => {
  device = await init({ powerPreference: primaryPref });
  try {
    const other = await init({ powerPreference: secondaryPref });
    if (other === device)
      skipReason = "both preferences resolved to the same device";
    else secondary = other;
  } catch (err) {
    skipReason = err.message;
  }
});
after(() => cleanup());
test("compiles a shader into a compute pipeline", async () => {
  const pipeline = await getPipeline(device, "sscal");
  assert_default.ok(pipeline, "expected a pipeline");
  assert_default.ok(
    pipeline.getBindGroupLayout(0),
    "pipeline should expose a derived bind group layout",
  );
});
test("the same shader on the same device is returned from cache", async () => {
  const a = await getPipeline(device, "sscal");
  const b = await getPipeline(device, "sscal");
  assert_default.equal(b, a, "expected the identical cached pipeline object");
});
test("different shaders get different pipelines", async () => {
  const sscal = await getPipeline(device, "sscal");
  const saxpy = await getPipeline(device, "saxpy");
  assert_default.notEqual(
    saxpy,
    sscal,
    "distinct shaders must not share a cache entry",
  );
});
test("concatenated shader lists are cached under their combined key", async () => {
  const deps = ["f64/dekker", "f64/utils/abs", "f64/utils/add"];
  const combined = await getPipeline(device, [...deps, "dasum"]);
  const again = await getPipeline(device, [...deps, "dasum"]);
  assert_default.equal(again, combined, "the same list should hit the cache");
  const other = await getPipeline(device, [...deps, "reduction/sumF64"]);
  assert_default.notEqual(
    other,
    combined,
    "a list must be keyed by its whole contents",
  );
});
test("the cache is keyed per device", async (t) => {
  if (!secondary) {
    t.skip(`second device unavailable: ${skipReason}`);
    return;
  }
  const onPrimary = await getPipeline(device, "sscal");
  const onSecondary = await getPipeline(secondary, "sscal");
  assert_default.notEqual(
    onSecondary,
    onPrimary,
    "each device needs its own compiled pipeline",
  );
  assert_default.equal(await getPipeline(device, "sscal"), onPrimary);
  assert_default.equal(await getPipeline(secondary, "sscal"), onSecondary);
});
test("loadShader compiles on the device it is given, not a cached one", async (t) => {
  if (!secondary) {
    t.skip(`second device unavailable: ${skipReason}`);
    return;
  }
  const pipeline = await loadShader(secondary, ["sscal"]);
  assert_default.ok(pipeline, "expected a pipeline from the secondary device");
  const x = uploadBuffer(
    secondary,
    new Float32Array([1, 2, 3]),
    "pipe-x",
    true,
  );
  const params = createParamsBuffer(
    secondary,
    [
      { value: 3, type: "u32" },
      { value: 2, type: "f32" },
      { value: 1, type: "u32" },
    ],
    "pipe-params",
  );
  try {
    secondary.pushErrorScope("validation");
    createBindGroup(secondary, pipeline.getBindGroupLayout(0), [x, params]);
    const err = await secondary.popErrorScope();
    assert_default.equal(
      err,
      null,
      "the layout must belong to the device loadShader was given",
    );
  } finally {
    destroyBuffers(x, params);
  }
});
test("an unknown shader name fails loudly", async () => {
  await assert_default.rejects(
    () => getPipeline(device, "definitely-not-a-shader"),
    "expected a missing shader to reject rather than return undefined",
  );
});
var fixturesOnDisk =
  typeof window !== "undefined"
    ? "fixture shaders are on disk; the browser bundle has only the library's"
    : false;
test(
  "a compile error maps back to its own file and local line number",
  { skip: fixturesOnDisk },
  async () => {
    await assert_default.rejects(
      () => loadShader(device, ["__test_pipeline_a", "__test_pipeline_b"]),
      (err) => {
        assert_default.match(err.message, /__test_pipeline_b\.wgsl:2/);
        return true;
      },
    );
  },
);
