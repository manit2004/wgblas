/** @module devdocs/utility-functions/bindgroup */
import { getDevice } from "../init.mjs";

/**
 * Creates a `GPUBindGroup` by mapping each buffer to sequential binding indices
 * (startBinding, startBinding + 1, …). The order of `buffers` must match the `@binding`s
 * declared in the shader.
 * @param {GPUBindGroupLayout} layout - from `pipeline.getBindGroupLayout(0)`; the layout is derived automatically from the shader because `loadShader` uses `layout: "auto"`
 * @param {(GPUBuffer|{buffer: GPUBuffer, offset: number, size: number})[]} buffers - input and
 *   intermediate buffers in binding order; a plain `GPUBuffer` binds the whole buffer, or pass
 *   `{buffer, offset, size}` to bind a sub-range — e.g. many small per-call param structs packed
 *   into one shared buffer instead of allocating a separate tiny buffer per call
 * @param {number} [startBinding=0] - binding index of `buffers[0]`; nonzero only when a shader's
 *   own bindings don't start at 0 — e.g. a module built by concatenating two `.wgsl` files where
 *   the second file's bindings continue after the first's own bindings (if any)
 * @returns {GPUBindGroup}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createBindGroup GPUDevice.createBindGroup()}
 */
export function createBindGroup(layout, buffers, startBinding = 0) {
  const device = getDevice();
  const entries = buffers.map((buffer, i) => ({
    binding: startBinding + i,
    resource: buffer instanceof GPUBuffer ? { buffer } : buffer,
  }));
  return device.createBindGroup({ layout, entries });
}
