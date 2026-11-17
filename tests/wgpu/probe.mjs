// Run by run.mjs in its own Deno process, before the tests: can this GPU hold
// two WebGPU devices at once? On some setups (wgpu on an NVIDIA GTX 1650,
// Linux) the second device comes back broken and takes the first down with
// it, which poisons the rest of the process, so this can't run inside a test
// file. Prints "ok" or "broken". Argument: the power preference, as in
// WGBLAS_POWER_PREFERENCE.
const powerPreference =
  globalThis.Deno.args[0] === "low-power" ? "low-power" : "high-performance";

async function bufferWorks(device) {
  device.pushErrorScope("out-of-memory");
  device.pushErrorScope("validation");
  device.createBuffer({ size: 16, usage: GPUBufferUsage.STORAGE });
  const validation = await device.popErrorScope();
  const oom = await device.popErrorScope();
  return !validation && !oom;
}

async function newDevice() {
  const adapter = await navigator.gpu.requestAdapter({ powerPreference });
  return adapter.requestDevice();
}

let ok;
try {
  const first = await newDevice();
  const second = await newDevice();
  ok = (await bufferWorks(second)) && (await bufferWorks(first));
} catch {
  ok = false;
}
console.log(ok ? "ok" : "broken");
