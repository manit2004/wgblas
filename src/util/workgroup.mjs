/** @module devdocs/utility-functions/workgroup */
import { getDevice } from "../init.mjs";

// Fixed sizes match the shader declarations (WGS = 64 for 1D, 8×8 = 64 threads for 2D).
const WORKGROUP_SIZE_1D = 64;
const WORKGROUP_SIZE_2D = 8;

/**
 * Calculates the number of workgroups to dispatch, clamped to the device's
 * `maxComputeWorkgroupsPerDimension` limit (default 65535 across most devices).
 *
 * - 1D (pass only `rows`): returns a single count for `dispatchWorkgroups(n)`.
 * - 2D (pass both `rows` and `cols`): returns `{ x, y }` for `dispatchWorkgroups(x, y)`.
 *   `rows` maps to the y dimension and `cols` maps to the x dimension.
 *
 * @param {number} rows - row count (1D: element count)
 * @param {number} [cols] - column count; omit for a 1D dispatch
 * @returns {number | { x: number, y: number }}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUSupportedLimits GPUSupportedLimits} (`maxComputeWorkgroupsPerDimension`)
 */
export function calcWorkgroups(rows, cols) {
  const max = getDevice().limits.maxComputeWorkgroupsPerDimension;
  if (cols === undefined) {
    return Math.min(Math.ceil(rows / WORKGROUP_SIZE_1D), max);
  } else {
    return {
      x: Math.min(Math.ceil(cols / WORKGROUP_SIZE_2D), max),
      y: Math.min(Math.ceil(rows / WORKGROUP_SIZE_2D), max),
    };
  }
}
