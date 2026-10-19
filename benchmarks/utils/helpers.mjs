/**
 * Shared utilities for wgblas benchmark scripts — a JS module and a
 * parallel C header covering the same operations for the cuBLAS benchmarks.
 *
 * ## JS — `helpers.mjs`
 *
 * Used by every `benchmarks/<routine>/benchmark.<routine>.js` for timing,
 * result persistence, table formatting, and GPU clock warm-up
 * ({@link warmClocks}, called before every measured configuration).
 *
 * ## C — `helpers.h`
 *
 * A header-only C counterpart used by every `benchmarks/<routine>/cuda/benchmark.c`.
 * All functions are `static` so each translation unit gets its own copy.
 *
 * | Function | Signature | What it does |
 * |---|---|---|
 * | `get_gpu_model` | `(char *dst, int maxlen) → void` | Fills `dst` with the CUDA device name normalised to the same slug format as `getGpuModel()` |
 * | `random_float_array` | `(int n, float low, float high) → float*` | Heap-allocates `n` random floats in `[low, high]`; caller must `free()` |
 * | `median` | `(float *arr, int n) → float` | Returns the median of `arr`; copies before sorting so original is unchanged |
 * | `save_results` | `(const char *routine, const char *gpu_model, int *sizes, float *med_times, float *gbs_vals, int n) → void` | Writes JSON to `benchmarks/results/<gpu>/cuda/<routine>.json` in the same schema as `saveResults()` |
 * | `warm_clocks` | `(cublasHandle_t handle) → void` | Brings the GPU to full clocks before a measurement — the counterpart of `warmClocks()` |
 *
 * @module benchmarks/utils
 */

import { writeFileSync, mkdirSync } from "fs";
import { getAdapter } from "../../src/init.mjs";

/**
 * Returns the current GPU's model name normalised to a filesystem-safe slug
 * (lowercase, non-alphanumeric runs replaced with `-`, leading/trailing `-`
 * stripped). Used as the directory name under `benchmarks/results/`.
 * @returns the slug string, or `null` if the adapter exposes no device name
 */
export function getGpuModel() {
  const device = getAdapter().info.device;
  if (!device) return null;
  // normalise: lowercase, non-alphanumeric → '-' (spec doesn't guarantee format)
  return device
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Writes `results` to `benchmarks/results/<gpuModel>/wgblas/<routineName>.json`,
 * creating the directory if needed. No-ops with a warning when `gpuModel` is null.
 *
 * Routines with more than one benchmark variant (e.g. a stride sweep
 * alongside the main unit-stride one) pass `folder` to nest both under
 * `benchmarks/results/<gpuModel>/wgblas/<folder>/` instead, and `fileName`
 * to give each variant its own file within it — e.g.
 * `saveResults("saxpy", gpuModel, strideRecords, { folder: "saxpy", fileName: "stride.saxpy" })`
 * writes `.../wgblas/saxpy/stride.saxpy.json`. Omitting both keeps the
 * original flat layout every other routine still uses.
 *
 * @param routineName - e.g. `"saxpy"`
 * @param gpuModel - slug from {@link getGpuModel}
 * @param results - array of `{ n, compute_ms, compute_GBs }` records
 * @param {{ folder?: string, fileName?: string }} [options]
 * @param options.folder - subfolder under `wgblas/` to nest the file in (default: none, flat layout)
 * @param options.fileName - file name without `.json` (default: `routineName`)
 */
export function saveResults(routineName, gpuModel, results, options = {}) {
  const { folder, fileName } = options;
  if (!gpuModel) {
    console.warn("Warning: couldn't fetch GPU model — skipping result save.");
    return;
  }
  const outDir = folder
    ? `benchmarks/results/${gpuModel}/wgblas/${folder}`
    : `benchmarks/results/${gpuModel}/wgblas`;
  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    `${outDir}/${fileName ?? routineName}.json`,
    JSON.stringify(results, null, 2),
  ); // 2-space indent for human-readable diffs in git
}

/**
 * Transposes a flat row-major rows×cols array into flat column-major storage
 * (lda = rows) — column-major storage of A is just row-major storage of Aᵀ.
 * Used so the Level 2 benchmarks can feed genuinely column-major data to
 * `GpuMatrix.from(..., "column-major")`, matching cuBLAS's native layout.
 * @param A - Float32Array, row-major, rows×cols, densely packed (lda = cols)
 * @param rows - number of logical rows
 * @param cols - number of logical columns
 * @returns Float32Array, column-major, rows×cols, densely packed (lda = rows)
 */
export function toColumnMajor(A, rows, cols) {
  const out = new A.constructor(rows * cols);
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++) out[j * rows + i] = A[i * cols + j];
  return out;
}

/**
 * Returns the median value of a numeric array.
 * Copies the array before sorting so the original is not mutated.
 * @param arr - array of numbers
 * @returns the median value
 */
export function median(arr) {
  const sorted = arr.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function colWidth(label) {
  return Math.max(label.length + 2, 12);
}

/**
 * Prints a formatted table header row followed by a separator row.
 * @param labels - column label strings, e.g. `["n", "compute_ms", "compute_GBs"]`
 */
export function printHeader(labels) {
  console.log(labels.map((l) => l.padEnd(colWidth(l))).join("  "));
  console.log(labels.map((l) => "-".repeat(colWidth(l))).join("  "));
}

/**
 * Prints one table data row. Floats are formatted to 4 decimal places;
 * integers are printed as-is. Column widths match those used by {@link printHeader}.
 * @param labels - column labels (used only for width calculation)
 * @param values - values to print, in the same order as `labels`
 */
export function printRow(labels, values) {
  console.log(
    labels
      .map((l, i) => {
        const v = values[i];
        const s =
          typeof v === "number" && !Number.isInteger(v)
            ? v.toFixed(4)
            : String(v);
        return s.padEnd(colWidth(l));
      })
      .join("  "),
  );
}

// --- GPU clock warm-up -------------------------------------------------------

// Lazily built per device: a memory-bound kernel over a 64 MB buffer, and the
// fastest batch time seen so far (the full-clock reference).
const WARM_FLOATS = 16 * 1024 * 1024;
const WARM_BATCH = 8; // dispatches per timed batch (~6 ms of work at full clocks)
const warmState = new WeakMap();

function warmKernel(device) {
  let st = warmState.get(device);
  if (st) return st;
  const buffer = device.createBuffer({
    label: "bench-warm",
    size: WARM_FLOATS * 4,
    usage: GPUBufferUsage.STORAGE,
  });
  const pipeline = device.createComputePipeline({
    layout: "auto",
    compute: {
      module: device.createShaderModule({
        label: "bench-warm",
        code: `
@group(0) @binding(0) var<storage, read_write> b: array<f32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) g: vec3u) {
  let i = g.y * 32768u * 256u + g.x;
  if (i < arrayLength(&b)) { b[i] = b[i] * 0.5 + 1.0; }
}`,
      }),
      entryPoint: "main",
    },
  });
  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [{ binding: 0, resource: { buffer } }],
  });
  st = { pipeline, bindGroup, bestBatchMs: Infinity, calls: 0 };
  warmState.set(device, st);
  return st;
}

/**
 * Brings the GPU to its full-performance power state before a measurement.
 *
 * The benchmarks await every call, so with short kernels the GPU idles most
 * of the time and the driver drops to a low-power state — on a GTX 1650, P5
 * (memory clock 810 MHz) or P8 (405 MHz) instead of P0 (6000 MHz). Memory-
 * bound kernels then run up to ~16× slower at whichever configurations a
 * sweep happens to reach while downclocked (e.g. sgemv 1024×2048 transposed:
 * 0.975 ms at P8, 0.060 ms at P0). Locking clocks fixes it but needs root.
 *
 * This runs a memory-bound burst in timed batches until a batch is within
 * 10% of the fastest batch seen so far, twice in a row — i.e. the memory
 * clock is back at its peak. Promotion from idle takes up to ~200 ms, and
 * the driver demotes again within about a second of light load, so it's
 * called right before each configuration's warmup; once the GPU is already
 * at full clocks it returns in ~12 ms. The first call per device runs at
 * least 300 ms to establish the full-clock reference.
 * @param {GPUDevice} device
 * @param {{ maxMs?: number }} [options] - give up after this long (default 1000 ms)
 */
export async function warmClocks(device, { maxMs = 1000 } = {}) {
  const st = warmKernel(device);
  const minMs = st.calls++ === 0 ? 300 : 0;
  const t0 = performance.now();
  let streak = 0;
  for (;;) {
    const b0 = performance.now();
    for (let k = 0; k < WARM_BATCH; k++) {
      const encoder = device.createCommandEncoder();
      const pass = encoder.beginComputePass();
      pass.setPipeline(st.pipeline);
      pass.setBindGroup(0, st.bindGroup);
      pass.dispatchWorkgroups(32768, WARM_FLOATS / 256 / 32768);
      pass.end();
      device.queue.submit([encoder.finish()]);
    }
    await device.queue.onSubmittedWorkDone();
    const batchMs = performance.now() - b0;
    st.bestBatchMs = Math.min(st.bestBatchMs, batchMs);
    const elapsed = performance.now() - t0;
    if (elapsed >= minMs && batchMs <= st.bestBatchMs * 1.1) {
      if (++streak >= 2) return;
    } else {
      streak = 0;
    }
    if (elapsed >= maxMs) return;
  }
}
