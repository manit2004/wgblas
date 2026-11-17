// Diagnostic, not part of the suite. Eight test files crash wgpu (Deno) on
// D3D12 WARP with 0xC0000005, an access violation in native code, around the
// kernels below — which pass on wgpu's Vulkan and Metal and on Dawn's D3D12.
// This compiles one kernel's pipeline, then runs its routine once, printing a
// marker before and after each, so the last marker before a crash says
// whether compiling (naga's HLSL through the shader compiler and WARP's JIT)
// or running is where it dies.
//
//   deno run -A --unstable-webgpu --no-lock --node-modules-dir=manual \
//     tests/wgpu/diagnostics/crash.diag.mjs <case>
//
// Cases: the keys of CASES. dgemv_n passes in the suite: a control.
import {
  init,
  cleanup,
  dgemv,
  dsymv,
  ssymv,
  strsv,
  dtrsv,
} from "../../../index.mjs";
import { getPipeline } from "../../../src/util/pipeline.mjs";

const F64 = ["f64/dekker", "f64/utils/add", "f64/utils/multiply"];
const BATCH = "f64/utils/batch";
const DIVIDE = "f64/utils/divide";

// A well-conditioned n×n matrix (row-major): n + 1 on the diagonal, small
// values elsewhere. The results aren't checked — only whether it crashes.
function matrix(Type, n) {
  const A = new Type(n * n);
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      A[i * n + j] = i === j ? n + 1 : 0.01 * ((i + j) % 7);
  return A;
}
const vector = (Type, n) => new Type(n).map((_, i) => 1 + (i % 5));

// Each case: the pipeline the crashing test reaches first (shader files,
// entry point) and a routine call that runs it.
const CASES = {
  dgemv_n: {
    pipeline: [[...F64, BATCH, "dgemv_n"], "dgemv_n_main"],
    run: (d) =>
      dgemv(
        d,
        "no-transpose",
        64,
        64,
        1,
        matrix(Float64Array, 64),
        64,
        vector(Float64Array, 64),
        1,
        0,
        vector(Float64Array, 64),
        1,
      ),
  },
  dgemv_t: {
    pipeline: [[...F64, BATCH, "dgemv_t"], "dgemv_t_main"],
    run: (d) =>
      dgemv(
        d,
        "transpose",
        64,
        64,
        1,
        matrix(Float64Array, 64),
        64,
        vector(Float64Array, 64),
        1,
        0,
        vector(Float64Array, 64),
        1,
      ),
  },
  dsymv_tile: {
    // dsymv takes the tiled kernel from n = 256 up.
    pipeline: [[...F64, BATCH, "dsymv_tile"], "dsymv_tile_main"],
    run: (d) =>
      dsymv(
        d,
        "lower",
        256,
        1,
        matrix(Float64Array, 256),
        256,
        vector(Float64Array, 256),
        1,
        0,
        vector(Float64Array, 256),
        1,
      ),
  },
  ssymv: {
    pipeline: [["ssymv"], "main"],
    run: (d) =>
      ssymv(
        d,
        "lower",
        64,
        1,
        matrix(Float32Array, 64),
        64,
        vector(Float32Array, 64),
        1,
        0,
        vector(Float32Array, 64),
        1,
      ),
  },
  // n = 300: five 64-row blocks, past the substitution path's two, so the
  // block-inverse path with both of these kernels.
  strsv_invert_block: {
    pipeline: [["strsv_invert_block"], "main"],
    run: (d) =>
      strsv(
        d,
        "lower",
        "no-transpose",
        "non-unit",
        300,
        matrix(Float32Array, 300),
        300,
        vector(Float32Array, 300),
        1,
      ),
  },
  strsv_step: {
    pipeline: [["strsv_step"], "main"],
    run: (d) =>
      strsv(
        d,
        "lower",
        "no-transpose",
        "non-unit",
        300,
        matrix(Float32Array, 300),
        300,
        vector(Float32Array, 300),
        1,
      ),
  },
  // n = 37: one block, dtrsv_small alone.
  dtrsv_small: {
    pipeline: [[...F64, DIVIDE, "dtrsv_small"], "dtrsv_small_main"],
    run: (d) =>
      dtrsv(
        d,
        "lower",
        "no-transpose",
        "non-unit",
        37,
        matrix(Float64Array, 37),
        37,
        vector(Float64Array, 37),
        1,
      ),
  },
  dtrsv_step: {
    pipeline: [[...F64, DIVIDE, BATCH, "dtrsv_step"], "dtrsv_step_main"],
    run: (d) =>
      dtrsv(
        d,
        "lower",
        "no-transpose",
        "non-unit",
        300,
        matrix(Float64Array, 300),
        300,
        vector(Float64Array, 300),
        1,
      ),
  },
};

const { Deno } = globalThis; // Deno only
const name = Deno.args[0];
const testCase = CASES[name];
if (!testCase) {
  console.error(`usage: crash.diag.mjs <${Object.keys(CASES).join("|")}>`);
  Deno.exit(2);
}
// stderr, unbuffered: what's printed before a crash survives it.
// With seconds since the last marker, to tell slow compiles from slow runs.
let last = performance.now();
const say = (message) => {
  const now = performance.now();
  console.error(`[${name}] ${message} (+${((now - last) / 1000).toFixed(1)}s)`);
  last = now;
};

const device = await init();
say("compiling the pipeline");
await getPipeline(device, ...testCase.pipeline);
say("compiled");
say("running the routine");
await testCase.run(device);
say("ran");
cleanup();
Deno.exit(0);
