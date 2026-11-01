/**
 * Shared utilities for wgblas benchmark scripts — a JS module and a
 * parallel C header covering the same operations for the cuBLAS benchmarks.
 *
 * ## JS — `helpers.mjs`
 *
 * Used by every `benchmarks/<routine>/wgblas/*.js` (and the roofline probes)
 * for GPU clock warm-up, timing, result persistence and table formatting.
 * Every function is documented individually below:
 *
 * - {@link warmClocks} — full clocks before every measured configuration
 * - {@link median} — the recorded statistic
 * - {@link saveResults} — writes the result JSON
 * - {@link getGpuModel} — the GPU slug that names the results folder
 * - {@link toColumnMajor} — feeds matrix benchmarks cuBLAS's native layout
 * - {@link printHeader} / {@link printRow} — the console table while a run is in progress
 *
 * ## C — `helpers.h`
 *
 * A header-only C counterpart used by every `benchmarks/<routine>/cuda/*.c`.
 * All functions are `static` so each translation unit gets its own copy. It
 * also defines `CUDA_CHECK` / `CUBLAS_CHECK`, which print the failing
 * file:line and exit on any non-success status.
 *
 * | Function | Signature | What it does |
 * |---|---|---|
 * | `warm_clocks` | `(cublasHandle_t handle) → void` | Brings the GPU to full clocks before a measurement — the counterpart of `warmClocks()`, using `cublasSscal` bursts over a zeroed 64 MB buffer since these files define no kernels of their own |
 * | `median` | `(float *arr, int n) → float` | Returns the median of `arr`; copies before sorting so the original is unchanged |
 * | `save_results` | `(const char *gpu_model, const char *folder, const char *file_name, const record_field *fields, int n_fields, float *med_times, float *gbs_vals, float *gflops_vals, int n) → void` | Writes `benchmarks/results/<gpu>/cuda/<folder>/<file_name>.json` in the same schema as `saveResults()`. Each `record_field` (`{ name, type, values }`, type `FIELD_INT`/`FIELD_FLOAT`/`FIELD_STRING`) is one swept key, written before the fixed `compute_ms`/`compute_GFLOPs`/`compute_GBs` fields, so any record shape needs no new function; pass `gflops_vals = NULL` to omit `compute_GFLOPs` |
 * | `save_results_ex`, `_stride`, `_pad`, `_pad_ex`, `_uplo`, `_trans`, `_flag`, `_scalar` | — | Thin wrappers over `save_results` for the record shapes older call sites use: `{n}`, `{stride, n}`, `{pad, n}` (`_pad_ex` adds GFLOP/s), `{uplo, n}`, `{trans, n}`, and a caller-named string (`_flag`) or float (`_scalar`) key with optional GFLOP/s. New benchmarks should call `save_results` directly |
 * | `get_gpu_model` | `(char *dst, int maxlen) → void` | Fills `dst` with the CUDA device name as a slug, so wgblas and cuBLAS results land in the same `benchmarks/results/<gpu>/` folder |
 * | `random_float_array` | `(int n, float low, float high) → float*` | Heap-allocates `n` random floats in `[low, high]`; caller must `free()` |
 * | `host_bytes_available` | `(void) → size_t` | Available host RAM from `/proc/meminfo`, for benchmarks that stage large host copies (the f64 routines stage two); returns 0 if unknown, which callers treat as "don't skip" |
 *
 * The C slug in `get_gpu_model` maps each non-alphanumeric character to `-`
 * one at a time, while `getGpuModel()` collapses runs and trims the ends —
 * identical for every GPU benchmarked so far, but a name with consecutive or
 * edge punctuation would split into two folders (tracked in `TODO.md`).
 *
 * @module benchmarks/utils
 */

import { writeFileSync, mkdirSync } from "fs";
import { getAdapter } from "../../src/init.mjs";

/**
 * Returns the current GPU's model name normalised to a filesystem-safe slug
 * (lowercase, non-alphanumeric runs replaced with `-`, leading/trailing `-`
 * stripped). Used as the directory name under `benchmarks/results/`.
 * @returns {string | null} the slug string, or `null` if the adapter exposes no device name
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
 * writes `.../wgblas/saxpy/stride.saxpy.json`. Every routine now has at
 * least one sweep, so every benchmark passes both; omitting them still writes
 * the original flat `wgblas/<routineName>.json`.
 *
 * @param {string} routineName - e.g. `"saxpy"`
 * @param {string | null} gpuModel - slug from {@link getGpuModel}
 * @param {Array<Record<string, number | string>>} results - array of `{ n, compute_ms, compute_GBs }` records,
 *   plus the swept key(s) for a sweep (e.g. `stride`, `uplo`) and `compute_GFLOPs` where recorded
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
 * Used so the Level 2 and 3 benchmarks can feed genuinely column-major data to
 * `GpuMatrix.from(..., "column-major")`, matching cuBLAS's native layout.
 * @template {Float32Array | Float64Array} T
 * @param {T} A - row-major, rows×cols, densely packed (lda = cols)
 * @param {number} rows - number of logical rows
 * @param {number} cols - number of logical columns
 * @returns {T} the same array type, column-major, rows×cols, densely packed (lda = rows)
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
 * @param {number[]} arr - array of numbers
 * @returns {number} the median value
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
 * @param {string[]} labels - column label strings, e.g. `["n", "compute_ms", "compute_GBs"]`
 */
export function printHeader(labels) {
  console.log(labels.map((l) => l.padEnd(colWidth(l))).join("  "));
  console.log(labels.map((l) => "-".repeat(colWidth(l))).join("  "));
}

/**
 * Prints one table data row. Floats are formatted to 4 decimal places;
 * integers are printed as-is. Column widths match those used by {@link printHeader}.
 * @param {string[]} labels - column labels (used only for width calculation)
 * @param {Array<number | string>} values - values to print, in the same order as `labels`
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
 * @param {GPUDevice} device - the device the benchmark will measure on
 * @param {{ maxMs?: number }} [options] - give up after this long (default 1000 ms)
 * @returns {Promise<void>} resolves once clocks are at peak, or after `maxMs`
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
