import { benchmarkMode } from "./util/benchmark.mjs";

let _device = null;
let _adapter = null;
let _gpu = null; // eslint-disable-line no-unused-vars
let _benchmarkEnabled = false;
let _initOptions = null; // options the live device was actually created with


// ── Public API ───────────────────────────────────────────────────────────────

export async function init({
  powerPreference = "high-performance",
  benchmark = false,
  dumpShaders = false,
} = {}) {
  const requested = { powerPreference, benchmark, dumpShaders };

  if (_device) {
    // Same options: idempotent. Different options: refuse — requiredFeatures
    // are fixed at requestDevice(), so silently returning the cached device
    // left init({ benchmark: true }) reporting gpuTimeMs undefined forever.
    const changed = Object.keys(requested).filter((key) => requested[key] !== _initOptions[key]);
    if (changed.length > 0) {
      const diff = changed
        .map((key) => `${key}: ${JSON.stringify(_initOptions[key])} -> ${JSON.stringify(requested[key])}`)
        .join(", ");
      throw new Error(
        `init() was already called with different options (${diff}). The device is created once ` +
        "and its features are fixed at creation, so the new options cannot take effect. " +
        "Call cleanup() first if you need to re-initialize with different options.",
      );
    }
    return _device;
  }

  let gpu;
  // Browser exposes WebGPU natively via navigator.gpu.
  // Node.js has no navigator, so we polyfill using the "webgpu" npm package which also
  // injects WebGPU globals (GPUBufferUsage, GPUShaderStage, etc.) into globalThis.
  if (typeof window === "undefined") {
    const { create, globals } = await import("webgpu");
    Object.assign(globalThis, globals);
    // dumpShaders forwards Dawn's own debug toggle — prints each pipeline's
    // WGSL and compiled backend IR to stderr. Node-only; see index.d.mts.
    const toggles = dumpShaders
      ? ["enable-dawn-features=dump_shaders,disable_symbol_renaming"]
      : [];
    gpu = create(toggles);
    _gpu = gpu;
  } else {
    if (dumpShaders)
      console.warn("dumpShaders has no effect in the browser — see init()'s docs.");
    gpu = navigator.gpu;
  }

  if (!gpu) {
    throw new Error("WebGPU not supported in this environment.");
  }

  _adapter =
    (await gpu.requestAdapter({ powerPreference })) ??
    (await gpu.requestAdapter());
  if (!_adapter) {
    throw new Error("No WebGPU adapter found.");
  }

  _initOptions = requested;
  _benchmarkEnabled = benchmark;
  const bmConfig = benchmarkMode(_adapter, benchmark);
  const features = [...(bmConfig.requiredFeatures ?? [])];
  _device = await _adapter.requestDevice({ requiredFeatures: features });
  // Fires for any GPU error not caught by a pushErrorScope/popErrorScope pair — surfaces silent GPU failures to the console.
  // See: https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/uncapturederror_event
  _device.addEventListener("uncapturederror", (e) => {
    console.error("Uncaptured GPU error:", e.error.message);
  });

  return _device;
}

export function cleanup() {
  if (_device) {
    _device.destroy();
    _device = null;
  }
  _adapter = null;
  _gpu = null;
  _benchmarkEnabled = false;
  _initOptions = null;
}

export function gpuName() {
  if (!_adapter) {
    throw new Error("WebGPU adapter not initialized — call init() first.");
  }
  const { device, description } = _adapter.info;
  return {
    description: description || "unknown",
    device: device || "unknown",
  };
}

// ── Library internals (not part of the public API) ───────────────────────────

/** @returns {boolean} whether benchmark mode was enabled in the last `init()` call */
export function isBenchmarkEnabled() {
  return _benchmarkEnabled;
}

/**
 * Returns the active `GPUDevice`. Throws if `init()` has not been called.
 * @returns {GPUDevice}
 * @throws {Error} if the device is not initialized
 */
export function getDevice() {
  if (!_device) {
    throw new Error("WebGPU device not initialized — call init() first.");
  }
  return _device;
}

/**
 * Returns the active `GPUAdapter`. Throws if `init()` has not been called.
 * @returns {GPUAdapter}
 * @throws {Error} if the adapter is not initialized
 */
export function getAdapter() {
  if (!_adapter) {
    throw new Error("WebGPU adapter not initialized — call init() first.");
  }
  return _adapter;
}

