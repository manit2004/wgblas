/** @module devdocs/utility-functions/result */

import { releaseReadback } from "./buffer.mjs";

/**
 * Maps `readBuffer` for CPU access, copies its contents into a new typed array, then unmaps.
 * The `.slice()` is required — `getMappedRange()` returns a view into the mapped GPU memory
 * which becomes invalid after `unmap()`, so we copy it out before unmapping.
 * The buffer then goes back to its device's readback pool (see `stageReadback`)
 * — only after a clean unmap; if mapping fails it is destroyed instead.
 * @param {GPUBuffer} readBuffer - a `MAP_READ` buffer produced by `stageReadback`
 * @param {typeof Float32Array | typeof Uint32Array} [readbackType=Float32Array] - typed array constructor for the result
 * @returns {Promise<Float32Array | Uint32Array>}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUBuffer/mapAsync GPUBuffer.mapAsync()}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUBuffer/getMappedRange GPUBuffer.getMappedRange()}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUBuffer/unmap GPUBuffer.unmap()}
 */
export async function extractResult(readBuffer, readbackType = Float32Array) {
  let unmapped = false;
  try {
    await readBuffer.mapAsync(GPUMapMode.READ);
    const result = new readbackType(readBuffer.getMappedRange().slice());
    readBuffer.unmap();
    unmapped = true;
    return result;
  } finally {
    if (unmapped) releaseReadback(readBuffer);
    else readBuffer.destroy();
  }
}
