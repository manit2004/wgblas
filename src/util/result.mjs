/** @module devdocs/utility-functions/result */

/**
 * Maps `readBuffer` for CPU access, copies its contents into a new typed array, then unmaps.
 * The `.slice()` is required — `getMappedRange()` returns a view into the mapped GPU memory
 * which becomes invalid after `unmap()`, so we copy it out before unmapping.
 * @param {GPUBuffer} readBuffer - a `MAP_READ` buffer produced by `stageReadback`
 * @param {typeof Float32Array | typeof Uint32Array} [readbackType=Float32Array] - typed array constructor for the result
 * @returns {Promise<Float32Array | Uint32Array>}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUBuffer/mapAsync GPUBuffer.mapAsync()}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUBuffer/getMappedRange GPUBuffer.getMappedRange()}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUBuffer/unmap GPUBuffer.unmap()}
 */
export async function extractResult(readBuffer, readbackType = Float32Array) {
  await readBuffer.mapAsync(GPUMapMode.READ);
  const result = new readbackType(readBuffer.getMappedRange().slice());
  readBuffer.unmap();
  readBuffer.destroy();
  return result;
}
