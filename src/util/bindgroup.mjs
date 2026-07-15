/** @module devdocs/utility-functions/bindgroup */
import { getDevice } from "../init.mjs";

/**
 * Creates a `GPUBindGroup` by mapping each buffer to sequential binding indices (0, 1, 2 …).
 * The order of `buffers` must match the `@binding` indices declared in the shader.
 * @param {GPUBindGroupLayout} layout - from `pipeline.getBindGroupLayout(0)`; the layout is derived automatically from the shader because `loadShader` uses `layout: "auto"`
 * @param {GPUBuffer[]} buffers - input and intermediate buffers in binding order
 * @returns {GPUBindGroup}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createBindGroup GPUDevice.createBindGroup()}
 */
export function createBindGroup(layout, buffers) {
  const device = getDevice();
  const entries = buffers.map((buffer, i) => ({
    binding: i,
    resource: { buffer },
  }));
  return device.createBindGroup({ layout, entries });
}
