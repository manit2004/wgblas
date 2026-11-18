import { TILE_WG_2D, WGS } from "./chunk-2ZD6UYXN.mjs";

// src/util/workgroup.mjs
function calcWorkgroups(device, rows, cols) {
  const max = device.limits.maxComputeWorkgroupsPerDimension;
  if (cols === void 0) {
    return Math.min(Math.ceil(rows / WGS), max);
  } else {
    return {
      x: Math.min(Math.ceil(cols / TILE_WG_2D), max),
      y: Math.min(Math.ceil(rows / TILE_WG_2D), max),
    };
  }
}
function requireWorkgroupCount(device, count, routine, dim = "x") {
  const max = device.limits.maxComputeWorkgroupsPerDimension;
  if (count > max)
    throw new Error(
      `${routine}: this problem needs ${count} workgroups in ${dim}, but the device allows ${max} (maxComputeWorkgroupsPerDimension). The operands are too large for this device \u2014 split the operation into smaller blocks.`,
    );
  return count;
}
function requireWorkgroups(device, routine, rows, cols) {
  if (cols === void 0)
    return requireWorkgroupCount(device, Math.ceil(rows / WGS), routine);
  return {
    x: requireWorkgroupCount(
      device,
      Math.ceil(cols / TILE_WG_2D),
      routine,
      "x",
    ),
    y: requireWorkgroupCount(
      device,
      Math.ceil(rows / TILE_WG_2D),
      routine,
      "y",
    ),
  };
}

export { calcWorkgroups, requireWorkgroupCount, requireWorkgroups };
