/** @module devdocs/utility-functions/workgroup */
// Fixed sizes match the shader declarations (WGS = 64 for 1D, 8×8 = 64 threads
// for 2D) — see constants.mjs, which is where both values are defined and
// where the WGSL cross-check hangs off.
import { WGS as WORKGROUP_SIZE_1D, TILE_WG_2D as WORKGROUP_SIZE_2D } from "./constants.mjs";

/**
 * Calculates the number of workgroups to dispatch, clamped to the device's
 * `maxComputeWorkgroupsPerDimension` limit (default 65535 across most devices).
 *
 * ONLY for shaders whose kernel is a grid-stride loop driven by
 * `num_workgroups` — those re-walk the whole domain regardless of how many
 * workgroups actually launch, so clamping costs a little parallelism and
 * nothing else. A shader that indexes straight off `workgroup_id` or
 * `global_invocation_id` silently drops every row past the clamp; those must
 * use {@link requireWorkgroups} / {@link requireWorkgroupCount} instead.
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
export function calcWorkgroups(device, rows, cols) {
  const max = device.limits.maxComputeWorkgroupsPerDimension;
  if (cols === undefined) {
    return Math.min(Math.ceil(rows / WORKGROUP_SIZE_1D), max);
  } else {
    return {
      x: Math.min(Math.ceil(cols / WORKGROUP_SIZE_2D), max),
      y: Math.min(Math.ceil(rows / WORKGROUP_SIZE_2D), max),
    };
  }
}

/**
 * Returns `count` unchanged if it fits the device's dispatch limit, and throws
 * otherwise. The counterpart to {@link calcWorkgroups} for shaders with no
 * grid-stride fallback: silently clamping those computes only part of the
 * result and reports success, so a refusal is the safer failure.
 *
 * @param {number} count - workgroups this dispatch requires in one dimension
 * @param {string} routine - routine name, for the error message
 * @param {string} [dim] - dimension label ("x"/"y"), for the error message
 * @returns {number} `count`
 * @throws {Error} when `count` exceeds `maxComputeWorkgroupsPerDimension`
 */
export function requireWorkgroupCount(device, count, routine, dim = "x") {
  const max = device.limits.maxComputeWorkgroupsPerDimension;
  if (count > max)
    throw new Error(
      `${routine}: this problem needs ${count} workgroups in ${dim}, but the device allows ` +
      `${max} (maxComputeWorkgroupsPerDimension). The operands are too large for this device — ` +
      `split the operation into smaller blocks.`,
    );
  return count;
}

/**
 * {@link calcWorkgroups} with the clamp replaced by a throw — same arguments
 * and same return shape, for shaders without a grid-stride fallback.
 *
 * @param {string} routine - routine name, for the error message
 * @param {number} rows - row count (1D: element count)
 * @param {number} [cols] - column count; omit for a 1D dispatch
 * @returns {number | { x: number, y: number }}
 * @throws {Error} when either dimension exceeds `maxComputeWorkgroupsPerDimension`
 */
export function requireWorkgroups(device, routine, rows, cols) {
  if (cols === undefined)
    return requireWorkgroupCount(device, Math.ceil(rows / WORKGROUP_SIZE_1D), routine);
  return {
    x: requireWorkgroupCount(device, Math.ceil(cols / WORKGROUP_SIZE_2D), routine, "x"),
    y: requireWorkgroupCount(device, Math.ceil(rows / WORKGROUP_SIZE_2D), routine, "y"),
  };
}
