import { init } from "./chunk-DRWHW5N5.mjs";
import { nodeOnly } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { assert_default, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/init/src/test.init.browser.js
test(
  "init() in a simulated browser environment uses navigator.gpu and warns on dumpShaders",
  { skip: nodeOnly },
  async () => {
    let calls = 0;
    const originalNavigator = Object.getOwnPropertyDescriptor(
      globalThis,
      "navigator",
    );
    Object.defineProperty(globalThis, "window", {
      value: {},
      configurable: true,
    });
    Object.defineProperty(globalThis, "navigator", {
      value: {
        gpu: {
          requestAdapter: async () => {
            calls++;
            return null;
          },
        },
      },
      configurable: true,
    });
    const warnings = [];
    const originalWarn = console.warn;
    console.warn = (...args) => warnings.push(args.join(" "));
    try {
      await assert_default.rejects(
        () => init({ dumpShaders: true }),
        /No WebGPU adapter found/,
      );
    } finally {
      console.warn = originalWarn;
      delete globalThis.window;
      if (originalNavigator) {
        Object.defineProperty(globalThis, "navigator", originalNavigator);
      } else {
        delete globalThis.navigator;
      }
    }
    assert_default.ok(
      warnings.some((w) =>
        w.includes("dumpShaders has no effect in the browser"),
      ),
      `expected a browser dumpShaders warning, got: ${JSON.stringify(warnings)}`,
    );
    assert_default.equal(
      calls,
      2,
      "expected both the powerPreference and fallback requestAdapter calls",
    );
  },
);
