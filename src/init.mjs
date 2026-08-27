import { benchmarkMode } from "./util/benchmark.mjs";

// One WebGPU instance for the whole process, never released. A GPUAdapter
// yields at most one working device, so a second device needs a second
// adapter — but creating a second *instance* aborts Dawn during native
// teardown (std::system_error), whether the instances overlap or are made one
// after another. So the instance is built once and every adapter comes from
// it; cleanup() releases devices, not this.
let _gpu = null;
let _dumpShaders = false; // instance-level Dawn toggle, fixed when _gpu is made

// Resolved-options key -> GPUDevice. init() returns the cached device for a
// given option set and creates one per distinct set, so a process can drive
// several GPUs at once (e.g. discrete via "high-performance", integrated via
// "low-power").
const _devices = new Map();
// GPUDevice -> { adapter, benchmark, options }. Benchmark support is a
// property of the device (its requiredFeatures), not of the library.
const _meta = new WeakMap();
// The device from the first init(); what getDevice() returns for callers that
// never mention one (GpuVector.from(data), GpuMatrix.from(data, ...)).
let _primary = null;

const optionsKey = ({ powerPreference, benchmark }) => `${powerPreference}::${benchmark}`;

// ── Public API ───────────────────────────────────────────────────────────────

export async function init({
  powerPreference = "high-performance",
  benchmark = false,
  dumpShaders = false,
} = {}) {
  const options = { powerPreference, benchmark, dumpShaders };
  const key = optionsKey(options);

  // Same options: idempotent, hand back the device already built for them.
  const cached = _devices.get(key);
  if (cached) return cached;

  // Browser exposes WebGPU natively via navigator.gpu.
  // Node.js has no navigator, so we polyfill using the "webgpu" npm package which also
  // injects WebGPU globals (GPUBufferUsage, GPUShaderStage, etc.) into globalThis.
  if (!_gpu) {
    if (typeof window === "undefined") {
      const { create, globals } = await import("webgpu");
      Object.assign(globalThis, globals);
      // dumpShaders forwards Dawn's own debug toggle — prints each pipeline's
      // WGSL and compiled backend IR to stderr. Node-only; see index.d.mts.
      const toggles = dumpShaders
        ? ["enable-dawn-features=dump_shaders,disable_symbol_renaming"]
        : [];
      _gpu = create(toggles);
      _dumpShaders = dumpShaders;
    } else {
      if (dumpShaders)
        console.warn("dumpShaders has no effect in the browser — see init()'s docs.");
      _gpu = navigator.gpu;
    }
  } else if (dumpShaders !== _dumpShaders && typeof window === "undefined") {
    // Unlike powerPreference and benchmark, dumpShaders is a toggle on the Dawn
    // instance rather than the device, and the instance is shared, so a later
    // init() cannot change it.
    console.warn(
      `dumpShaders: ${dumpShaders} was requested, but the WebGPU instance was already created with ` +
      `dumpShaders: ${_dumpShaders}. The first init() call fixes this for the process.`,
    );
  }

  if (!_gpu) {
    throw new Error("WebGPU not supported in this environment.");
  }

  // A fresh adapter per device: requesting a device consumes its adapter, so
  // reusing one would hand back an already-lost device.
  const adapter =
    (await _gpu.requestAdapter({ powerPreference })) ??
    (await _gpu.requestAdapter());
  if (!adapter) {
    throw new Error("No WebGPU adapter found.");
  }

  const bmConfig = benchmarkMode(adapter, benchmark);
  const features = [...(bmConfig.requiredFeatures ?? [])];
  const device = await adapter.requestDevice({ requiredFeatures: features });
  // Fires for any GPU error not caught by a pushErrorScope/popErrorScope pair — surfaces silent GPU failures to the console.
  // See: https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/uncapturederror_event
  device.addEventListener("uncapturederror", (e) => {
    console.error("Uncaptured GPU error:", e.error.message);
  });

  // benchmarkMode() drops the feature when the adapter can't do timestamp
  // queries, so record what was actually granted rather than what was asked
  // for — otherwise beginTimestamp() would build a query set on a device that
  // never requested the feature.
  const benchmarkGranted = features.includes("timestamp-query");
  _meta.set(device, { adapter, benchmark: benchmarkGranted, options });
  _devices.set(key, device);
  if (!_primary) _primary = device;

  return device;
}

export function cleanup(device) {
  if (device === undefined) {
    for (const d of _devices.values()) d.destroy();
    _devices.clear();
    _primary = null;
    return;
  }

  // Releasing one device of several. Unknown or already-released devices are a
  // no-op so teardown paths can call this unguarded.
  const meta = _meta.get(device);
  if (!meta) return;
  _devices.delete(optionsKey(meta.options));
  _meta.delete(device);
  device.destroy();

  // getDevice() must keep answering while any device is left, so promote a
  // survivor when the primary is the one being released.
  if (_primary === device) _primary = _devices.values().next().value ?? null;
}

export function gpuName(device = _primary) {
  const meta = device && _meta.get(device);
  if (!meta) {
    throw new Error("WebGPU adapter not initialized — call init() first.");
  }
  const { device: deviceName, description } = meta.adapter.info;
  return {
    description: description || "unknown",
    device: deviceName || "unknown",
  };
}

// ── Library internals (not part of the public API) ───────────────────────────

/**
 * Whether benchmark mode is active for `device` — i.e. it was created with
 * `benchmark: true` *and* its adapter actually supports timestamp queries.
 * @param {GPUDevice} [device] - defaults to the first-initialized device
 * @returns {boolean}
 */
export function isBenchmarkEnabled(device = _primary) {
  return _meta.get(device)?.benchmark ?? false;
}

/**
 * Returns the device from the first `init()` call — the default for callers
 * that don't name one. Throws if `init()` has not been called.
 * @returns {GPUDevice}
 * @throws {Error} if no device is initialized
 */
export function getDevice() {
  if (!_primary) {
    throw new Error("WebGPU device not initialized — call init() first.");
  }
  return _primary;
}

/**
 * Returns the `GPUAdapter` backing `device`. Throws if it isn't initialized.
 * @param {GPUDevice} [device] - defaults to the first-initialized device
 * @returns {GPUAdapter}
 * @throws {Error} if the adapter is not initialized
 */
export function getAdapter(device = _primary) {
  const meta = device && _meta.get(device);
  if (!meta) {
    throw new Error("WebGPU adapter not initialized — call init() first.");
  }
  return meta.adapter;
}
