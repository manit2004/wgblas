import { getDevice } from "../init.mjs";

export function createBindGroup(layout, buffers, resultBuffer = null) {
  const device = getDevice();
  const allBuffers = resultBuffer ? [...buffers, resultBuffer] : [...buffers];
  const entries = allBuffers.map((buffer, i) => ({
    binding: i,
    resource: { buffer },
  }));
  return device.createBindGroup({ layout, entries });
}
