// Simulates a browser environment (typeof window !== "undefined") to exercise
// init()'s navigator.gpu branch — real Node-based tests can never reach it,
// since `window` is always undefined in Node. See src/init.mjs's `if (!_gpu)`
// browser branch.
//
// This has to be its own file: that branch is only reachable as the literal
// first init() call in the process (_gpu is a module-level singleton, set
// once and never reset), and it permanently swaps _gpu for the fake
// navigator.gpu below — so it can't share a process with any test that needs
// a real working device afterward. Every other init() test lives in
// test.init.js instead.
import { test } from "node:test";
import assert from "node:assert/strict";
import { init } from "wgblas";

test("init() in a simulated browser environment uses navigator.gpu and warns on dumpShaders", async () => {
  // requestAdapter always resolves null — exercises both sides of the
  // `?? await _gpu.requestAdapter()` fallback and the "No WebGPU adapter
  // found" throw, without needing a real adapter.
  let calls = 0;
  // Modern Node already defines a read-only `navigator` global (Web-API
  // compat, e.g. navigator.userAgent) — plain assignment throws "has only a
  // getter", so both globals go through defineProperty instead.
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
    await assert.rejects(
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

  assert.ok(
    warnings.some((w) =>
      w.includes("dumpShaders has no effect in the browser"),
    ),
    `expected a browser dumpShaders warning, got: ${JSON.stringify(warnings)}`,
  );
  assert.equal(
    calls,
    2,
    "expected both the powerPreference and fallback requestAdapter calls",
  );
});
