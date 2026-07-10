/**
 * Per-routine GPU benchmarks for wgblas — a WebGPU (JS) benchmark and a
 * cuBLAS (C/CUDA) reference benchmark for each of the 10 BLAS Level 1 routines.
 *
 * ## Folder Structure
 *
 * ```
 * benchmarks/
 *   <routine>/
 *     benchmark.<routine>.js   — wgblas benchmark (Node + WebGPU)
 *     cuda/
 *       benchmark.c            — cuBLAS reference benchmark
 *       Makefile               — compiles and links against cublas
 *   utils/
 *     helpers.mjs              — JS utilities: median, saveResults, printRow, getGpuModel
 *     helpers.h                — C utilities: median, save_results, random_float_array
 *   results/
 *     <gpu-model-slug>/
 *       wgblas/<routine>.json  — recorded wgblas results
 *       cuda/<routine>.json    — recorded cuBLAS results (NVIDIA only)
 * ```
 *
 * ## Benchmarking Pattern
 *
 * Both the wgblas and cuBLAS benchmarks follow the same methodology so results
 * are directly comparable:
 *
 * - **Data stays on GPU** — vectors are allocated with `GpuVector.from()` (JS)
 *   or `cudaMalloc` (C) before the timed loop. The measured time is pure
 *   compute; no host↔device transfer is included.
 * - **Warmup** — 5 un-timed iterations before the loop, to reach steady-state
 *   clock speed and fill driver/JIT caches.
 * - **100 timed iterations** — each individually timed; the **median** is
 *   recorded. Median suppresses outliers from OS scheduler preemption better
 *   than mean.
 * - **Sizes** — `[32, 64, 128, 512, 1024, 4096, 16384, 65536, 262144, 1048576,
 *   4194304, 16777216]` — the same 12 sizes for both backends.
 * - **Throughput** — `bytes / 1e9 / (median_ms / 1e3)` where `bytes` is the
 *   total memory traffic for the routine (e.g. saxpy reads `x`, reads and
 *   writes `y` → `3 × n × 4 bytes`).
 * - **`init({ benchmark: true })`** — enables WebGPU timestamp queries so the
 *   JS benchmark measures actual GPU execution time, not the CPU-side await
 *   overhead.
 *
 * ## Make Commands
 *
 * | Command | What it does |
 * |---|---|
 * | `make bench` | Runs all wgblas benchmarks in sequence |
 * | `make bench-<routine>` | Runs one wgblas benchmark, e.g. `make bench-saxpy` |
 * | `make cuda` | Compiles and runs all cuBLAS benchmarks (NVIDIA only) |
 * | `make cuda-<routine>` | Compiles and runs one cuBLAS benchmark, e.g. `make cuda-saxpy` |
 *
 * Pass `ARGS=low-power` to prefer the integrated GPU on dual-GPU machines:
 * `make bench-saxpy ARGS=low-power`.
 *
 * Results are saved automatically to
 * `benchmarks/results/<gpu-model>/wgblas/<routine>.json` (JS) or
 * `benchmarks/results/<gpu-model>/cuda/<routine>.json` (CUDA).
 *
 * ## Table Generation — `gen-bench-tables.py`
 *
 * `scripts/gen-bench-tables.py` reads GPU folder names from the local
 * `benchmarks/results/` directory to discover which GPUs have results, then
 * **fetches the JSON files from GitHub** (not local disk) so that
 * skip-worktree'd local files are never used.
 *
 * For each GPU × routine pair it generates a markdown table at
 * `assets/bench-result/Benchmarks/<gpu>/<routine>.md`. On NVIDIA GPUs the
 * table includes cuBLAS columns and an efficiency column
 * (`wgblas GB/s ÷ cuBLAS GB/s × 100`); on other GPUs it shows wgblas only.
 *
 * ## Contributing Results
 *
 * 1. Run `make bench` (and `make cuda` on NVIDIA).
 * 2. Commit the generated JSON files under `benchmarks/results/`.
 * 3. Open a pull request — CI runs `gen-bench-tables.py` and the tables in
 *    these docs update automatically.
 *
 * @module benchmarks
 */
