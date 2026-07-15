/** @module devdocs/utility-functions/pipeline */
import { getDevice } from "../init.mjs";

// WeakMap keyed by GPUDevice so pipelines are released automatically when the device is destroyed.
const _pipelines = new WeakMap();

/**
 * Returns a cached `GPUComputePipeline` for the given shader, compiling it on first use.
 * Pipelines are cached per device so reinitialization (new device) always recompiles.
 * @param {GPUDevice} device
 * @param {string} shaderName - filename without `.wgsl` extension (e.g. `"sscal"`)
 * @returns {Promise<GPUComputePipeline>}
 */
export async function getPipeline(device, shaderName) {
  if (!_pipelines.has(device)) {
    _pipelines.set(device, new Map());
  }
  const byName = _pipelines.get(device);
  if (!byName.has(shaderName)) {
    byName.set(shaderName, await loadShader(shaderName));
  }
  return byName.get(shaderName);
}

/**
 * Loads WGSL source for `shaderName`. In the browser, reads from the inline bundle
 * (`browser-shaders.mjs`); in Node.js, reads the `.wgsl` file directly from disk.
 * @param {string} shaderName
 * @returns {Promise<string>}
 */
async function loadCode(shaderName) {
  // Check for Node.js explicitly — `window` is undefined in Web Workers too, so it's not a reliable signal.
  if (typeof process === "undefined" || !process.versions?.node) {
    const { shaderSources } = await import("../shaders/browser-shaders.mjs");
    const src = shaderSources[shaderName];
    if (!src) throw new Error(`Shader "${shaderName}" not found in browser bundle.`);
    return src;
  } else {
    const { readFileSync } = await import("fs");
    const { fileURLToPath } = await import("url");
    const { dirname, join } = await import("path");
    const dir = dirname(fileURLToPath(import.meta.url));
    return readFileSync(join(dir, `../shaders/${shaderName}.wgsl`), "utf8");
  }
}

/**
 * Compiles a WGSL shader into a `GPUComputePipeline`. Throws with line-level detail if compilation fails, rather than surfacing a raw GPU error.
 * Uses `layout: "auto"` so the pipeline derives its bind group layout from the shader —
 * no manual layout definition needed.
 * @param {string} shaderName
 * @returns {Promise<GPUComputePipeline>}
 * @throws {Error} if the shader has compilation errors
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createShaderModule GPUDevice.createShaderModule()}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUShaderModule/getCompilationInfo GPUShaderModule.getCompilationInfo()}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createComputePipeline GPUDevice.createComputePipeline()}
 */
export async function loadShader(shaderName) {
  const device = getDevice();
  const code = await loadCode(shaderName);

  const shaderModule = device.createShaderModule({ label: shaderName, code });

  const info = await shaderModule.getCompilationInfo();
  // GPUCompilationMessage: https://developer.mozilla.org/en-US/docs/Web/API/GPUCompilationMessage
  const errors = info.messages.filter((m) => m.type === "error");
  if (errors.length > 0) {
    throw new Error(
      `Shader "${shaderName}" compilation failed:\n${errors.map((m) => `  line ${m.lineNum}: ${m.message}`).join("\n")}`,
    );
  }

  const pipeline = device.createComputePipeline({
    label: shaderName,
    layout: "auto",
    compute: { module: shaderModule },
  });

  pipeline._shaderModule = shaderModule; // anchor — GC'd shaderModule crashes native pipeline

  return pipeline;
}
