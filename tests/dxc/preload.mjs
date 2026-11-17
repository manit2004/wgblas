// Loaded before the tests (NODE_OPTIONS=--import=./tests/dxc/preload.mjs) to
// run the suite the way Chrome on Windows compiles shaders: with DXC, not
// FXC. The "webgpu" package compiles HLSL with FXC (the d3dcompiler_47.dll it
// ships); Dawn's use_dxc toggle switches to DXC, but only when dxcompiler.dll
// and dxil.dll can be found, and otherwise silently stays on FXC. So
// check.mjs confirms which compiler ran before the suite is trusted.
//
// init() takes an existing navigator.gpu over building its own Dawn
// instance, so setting one here is enough; the library is unchanged.
// WGBLAS_DXC_DUMP=1 adds Dawn's dump_shaders, which check.mjs relies on.
import { create, globals } from "webgpu";

Object.assign(globalThis, globals);
const features = ["use_dxc"];
if (process.env.WGBLAS_DXC_DUMP === "1") features.push("dump_shaders");
Object.defineProperty(globalThis.navigator, "gpu", {
  value: create([`enable-dawn-features=${features.join(",")}`]),
  configurable: true,
});
