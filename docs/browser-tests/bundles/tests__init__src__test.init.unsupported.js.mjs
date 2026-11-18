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

// tests/init/src/test.init.unsupported.js
test(
  "init() throws when neither Node nor the browser expose WebGPU",
  { skip: nodeOnly },
  async () => {
    const originalNavigator = Object.getOwnPropertyDescriptor(
      globalThis,
      "navigator",
    );
    Object.defineProperty(globalThis, "window", {
      value: {},
      configurable: true,
    });
    Object.defineProperty(globalThis, "navigator", {
      value: {},
      configurable: true,
    });
    try {
      await assert_default.rejects(
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
  },
);
