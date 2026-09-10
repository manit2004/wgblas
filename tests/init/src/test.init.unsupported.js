// Simulates a browser with no WebGPU support at all (navigator.gpu missing)
// to exercise init()'s final `if (!_gpu) throw` — the case where the browser
// branch runs but there's nothing to fall back to. See
// test.init.browser.js's header for why this needs its own file: the
// `if (!_gpu)` block is only reachable as the literal first init() call in
// the process, and this test's fake `navigator` (no `gpu` property)
// permanently leaves the module's `_gpu` unset, so nothing here can share a
// process with a test that needs a real device.
import { test } from "node:test";
import assert from "node:assert/strict";
import { init } from "wgblas";

test("init() throws when neither Node nor the browser expose WebGPU", async () => {
  const originalNavigator = Object.getOwnPropertyDescriptor(
    globalThis,
    "navigator",
  );
  Object.defineProperty(globalThis, "window", {
    value: {},
    configurable: true,
  });
  // No `gpu` property at all — the browser branch's `_gpu = navigator.gpu`
  // assigns undefined, so init() falls through to the final `if (!_gpu)`.
  Object.defineProperty(globalThis, "navigator", {
    value: {},
    configurable: true,
  });

  try {
    await assert.rejects(
      () => init(),
      /WebGPU not supported in this environment/,
    );
  } finally {
    delete globalThis.window;
    if (originalNavigator) {
      Object.defineProperty(globalThis, "navigator", originalNavigator);
    } else {
      delete globalThis.navigator;
    }
  }
});
