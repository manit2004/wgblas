// tests/helpers/device.js
var env = globalThis.process?.env ?? {};
var dawnOnly = globalThis.Deno
  ? "Dawn only (running on wgpu)"
  : typeof window !== "undefined"
    ? "the webgpu npm package's Dawn only (running in a browser)"
    : false;
var nodeOnly =
  typeof window !== "undefined"
    ? "fakes a browser in Node; a real browser's window can't be replaced"
    : false;
var multiDevice = env.WGBLAS_SINGLE_DEVICE
  ? "a second device breaks wgpu on this GPU (tests/wgpu/probe.mjs)"
  : false;
function getPowerPreference() {
  return env.WGBLAS_POWER_PREFERENCE === "low-power"
    ? "low-power"
    : "high-performance";
}

export { dawnOnly, nodeOnly, multiDevice, getPowerPreference };
