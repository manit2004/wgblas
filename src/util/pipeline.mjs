/** @module devdocs/utility-functions/pipeline */
import { getDevice } from "../init.mjs";

// WeakMap keyed by GPUDevice so pipelines are released automatically when the device is destroyed.
const _pipelines = new WeakMap();

/**
 * Returns a cached `GPUComputePipeline` for the given shader, compiling it on first use.
 * Pipelines are cached per device so reinitialization (new device) always recompiles.
 * @param {GPUDevice} device
 * @param {string|string[]} shaderName - filename without `.wgsl` extension (e.g. `"sscal"`),
 *   or an array of filenames whose source gets concatenated into one module — WGSL has no
 *   `#include`, so this is how one shader's helper functions (e.g. f64add.wgsl's decode/
 *   encode/computeSum) get reused from another (e.g. dasum.wgsl) without duplicating them.
 * @param {string} [entryPoint="main"] - which `@compute` function to run; only needed when
 *   concatenating shaders whose entry points aren't both named "main"
 * @returns {Promise<GPUComputePipeline>}
 */
export async function getPipeline(device, shaderName, entryPoint = "main") {
  if (!_pipelines.has(device)) {
    _pipelines.set(device, new Map());
  }
  const byName = _pipelines.get(device);
  const names = Array.isArray(shaderName) ? shaderName : [shaderName];
  const key = `${names.join("+")}::${entryPoint}`;
  if (!byName.has(key)) {
    byName.set(key, await loadShader(names, entryPoint));
  }
  return byName.get(key);
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
 * Compiles one or more WGSL shaders (concatenated, in order, into a single module) into a
 * `GPUComputePipeline`. Throws with line-level detail if compilation fails, rather than
 * surfacing a raw GPU error. Uses `layout: "auto"` so the pipeline derives its bind group
 * layout from the shader — no manual layout definition needed.
 * @param {string[]} shaderNames - filenames without `.wgsl`, concatenated in array order
 * @param {string} [entryPoint="main"] - which `@compute` function in the combined module to run
 * @returns {Promise<GPUComputePipeline>}
 * @throws {Error} if the shader has compilation errors
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createShaderModule GPUDevice.createShaderModule()}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUShaderModule/getCompilationInfo GPUShaderModule.getCompilationInfo()}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createComputePipeline GPUDevice.createComputePipeline()}
 */
export async function loadShader(shaderNames, entryPoint = "main") {
  const device = getDevice();
  const label = shaderNames.join("+");
  const code = (await Promise.all(shaderNames.map(loadCode))).join("\n");

  const shaderModule = device.createShaderModule({ label, code });

  const info = await shaderModule.getCompilationInfo();
  // GPUCompilationMessage: https://developer.mozilla.org/en-US/docs/Web/API/GPUCompilationMessage
  const errors = info.messages.filter((m) => m.type === "error");
  if (errors.length > 0) {
    throw new Error(
      `Shader "${label}" compilation failed:\n${errors.map((m) => `  line ${m.lineNum}: ${m.message}`).join("\n")}`,
    );
  }

  // Omit entryPoint when it's the default "main" rather than always passing it explicitly —
  // this project's WebGPU backend is unstable (intermittent multi-minute hangs and wrong
  // results, confirmed by bisection) when entryPoint is set explicitly, even to the shader's
  // only/correct entry point. Auto-detecting the single entry point is the stable path.
  const compute = entryPoint === "main" ? { module: shaderModule } : { module: shaderModule, entryPoint };
  const pipeline = device.createComputePipeline({
    label,
    layout: "auto",
    compute,
  });

  pipeline._shaderModule = shaderModule; // anchor — GC'd shaderModule crashes native pipeline

  return pipeline;
}
