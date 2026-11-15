// Every shader compiles under Dawn (Chrome/Edge's WebGPU, and the `webgpu`
// package Node runs on): the WGSL module, then its compute pipeline, which is
// where binding and workgroup-storage limits are checked. Routine tests only
// compile the pipelines their inputs reach; this covers every shader once.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { loadShader } from "../../../src/util/pipeline.mjs";
import { getPowerPreference } from "../../helpers/device.js";
import { shaderModules } from "../helpers.js";

let device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => {
  cleanup();
});

test("shaders compile under Dawn", async (t) => {
  for (const { name, files } of shaderModules) {
    await t.test(name, async () => {
      // loadShader throws on shader compile errors (with file:line); pipeline
      // validation errors don't throw, so catch them in an error scope.
      device.pushErrorScope("validation");
      const result = await loadShader(device, files).catch((err) => err);
      const scopeError = await device.popErrorScope();
      if (result instanceof Error) throw result;
      assert.equal(scopeError, null, scopeError?.message);
    });
  }
});
