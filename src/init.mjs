import { benchmarkMode } from "./util/benchmark.mjs";

let _device = null;
let _adapter = null;
let _gpu = null; // eslint-disable-line no-unused-vars
let _benchmarkEnabled = false;


// ── Public API ───────────────────────────────────────────────────────────────

export async function init({
  powerPreference = "high-performance",
  benchmark = false,
} = {}) {
  if (_device) {
    return _device;
  }

  let gpu;
  // Browser exposes WebGPU natively via navigator.gpu.
  // Node.js has no navigator, so we polyfill using the "webgpu" npm package which also
  // injects WebGPU globals (GPUBufferUsage, GPUShaderStage, etc.) into globalThis.
  if (typeof window === "undefined") {
    const { create, globals } = await import("webgpu");
    Object.assign(globalThis, globals);
    gpu = create([]);
    _gpu = gpu;
  } else {
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

