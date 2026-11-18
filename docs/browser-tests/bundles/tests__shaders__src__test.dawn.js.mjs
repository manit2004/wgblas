import { shaderModules } from "./chunk-32RUOGEA.mjs";
import { cleanup, init, loadShader } from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/shaders/src/test.dawn.js
var device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => {
  cleanup();
});
test("shaders compile under Dawn", async (t) => {
  for (const { name, files } of shaderModules) {
    await t.test(name, async () => {
      device.pushErrorScope("validation");
      const result = await loadShader(device, files).catch((err) => err);
      const scopeError = await device.popErrorScope();
      if (result instanceof Error) throw result;
      assert_default.equal(scopeError, null, scopeError?.message);
    });
  }
});
