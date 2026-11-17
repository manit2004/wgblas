// Run with preload.mjs and WGBLAS_DXC_DUMP=1: compiles and runs one
// double-double kernel (ddot), then exits non-zero unless Dawn's shader dump
// shows DXC compiled it. Dawn prints "DXC compile flags" or "FXC compile
// flags" with each D3D12 shader, so a silent fallback to FXC (DXC's DLLs not
// found, or a device without shader model 6) fails here instead of passing
// the suite on the wrong compiler.
//
// The dump goes to this process's stdout, so a child runs the kernel and
// this process reads what it printed.
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

if (process.argv[2] === "--kernel") {
  const { init, cleanup, gpuName, ddot } = await import("wgblas");
  const { getAdapter } = await import("../../src/init.mjs");
  const device = await init();
  console.log("adapter:", gpuName(device).description);
  // Dawn offers these on D3D12 only with DXC loaded (subgroups also needs
  // shader model 6.0, shader-f16 6.2): a hint at why a run fell back to FXC.
  const features = getAdapter(device).features;
  console.log(
    "adapter: subgroups",
    features.has("subgroups"),
    "shader-f16",
    features.has("shader-f16"),
  );
  const r = await ddot(
    device,
    2,
    new Float64Array([1, 2]),
    1,
    new Float64Array([3, 4]),
    1,
  );
  console.log("ddot:", r.dot);
  cleanup();
  process.exit(r.dot === 11 ? 0 : 1);
}

// A file: URL, not a path: --import resolves like import(), and a Windows
// path (D:\...) reads as a URL with scheme "d:".
const preload = new URL("./preload.mjs", import.meta.url).href;
const run = spawnSync(
  process.execPath,
  [`--import=${preload}`, fileURLToPath(import.meta.url), "--kernel"],
  { env: { ...process.env, WGBLAS_DXC_DUMP: "1" }, encoding: "utf8" },
);
const out = `${run.stdout}\n${run.stderr}`;
const lines = out.split("\n");
for (const line of lines)
  if (/^(adapter|ddot):|compile flags/.test(line)) console.log(line);

if (run.status !== 0) {
  console.error(out);
  console.error("The ddot kernel failed (exit status " + run.status + ").");
  process.exit(1);
}
if (!out.includes("DXC compile flags")) {
  console.error(
    out.includes("FXC compile flags")
      ? "Dawn compiled with FXC, not DXC: use_dxc found no dxcompiler.dll/dxil.dll (subgroups false above), or the device lacks shader model 6."
      : "No D3D12 shader dump: is this Dawn on D3D12?",
  );
  process.exit(1);
}
console.log("Dawn compiled with DXC.");
