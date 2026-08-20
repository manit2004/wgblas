/**
 * Per-routine GPU benchmarks for wgblas — a WebGPU (JS) benchmark and a
 * cuBLAS (C/CUDA) reference benchmark for BLAS Level 1, 2,
 * and 3 routines.
 *
 * ## Folder Structure
 *
 * ```
 * benchmarks/
 *   <routine>/
 *     wgblas/
 *       <routine>.js          — wgblas benchmark (Node + WebGPU)
 *       stride.<routine>.js   — optional stride-sweep companion
 *       trans.<routine>.js    — optional trans-sweep companion
 *       lda.<routine>.js      — optional lda-sweep companion
 *       ldb.<routine>.js      — optional ldb-sweep companion (sgemm only)
 *       uplo.<routine>.js     — optional uplo-sweep companion
 *     cuda/
 *       <routine>.c           — cuBLAS reference benchmark, plus the same
 *                                sweep companions as wgblas/ above
 *       Makefile               — compiles and links against cublas
 *       bin/                    — build output (gitignored)
 *   utils/
 *     helpers.mjs              — JS utilities: median, saveResults, printRow, getGpuModel
 *     helpers.h                — C utilities: median, save_results, random_float_array
 *   results/
 *     <gpu-model-slug>/
 *       wgblas/<routine>.json           — simple routines (no sweep companions)
 *       wgblas/<routine>/<routine>.json — routines with sweeps, nested alongside
 *       wgblas/<routine>/stride.<routine>.json  — ...one JSON per sweep companion
 *       cuda/...                        — same layout, cuBLAS results (NVIDIA only)
 * ```
 *
 * Not every routine has every sweep companion — they exist only where that
 * parameter was actually worth isolating (e.g. `trans.strmv` and `lda.strmv`
 * exist; `ldb.<routine>` currently exists only for `sgemm`, where `transB`/
 * `ldb` turned out to matter but `transA`/`lda` didn't).
 *
 * ## Benchmarking Pattern
 *
 * A wgblas benchmark and its cuBLAS counterpart always share the same
 * `WARMUP_ITERS`/`BENCH_ITERS`/`SIZES` for that one routine, so the two are
 * directly comparable — but those numbers scale down by BLAS level, since
 * work grows from O(n) to O(n²) to O(n³) and a Level 3 sweep at Level 1's
 * iteration count would take far too long to run:
 *
 * | | Level 1 (vector) | Level 2 (matrix-vector) | Level 3 (matrix-matrix) |
 * |---|---|---|---|
 * | Warmup iterations | 5 | 5 | 3 |
 * | Timed iterations | 100 | 100 | 20 |
 * | Sizes | `n` — 12 element counts, `32` to `16777216` | `m=n` — 9 square dimensions, `32` to `4096` (4096² ≈ 16.8M elements, matching Level 1's max) | `m=n=k` — 6 square dimensions, `32` to `1024` |
 *
 * That's the default per level, not a hard rule — a routine whose
 * performance profile doesn't fit gets its own numbers. `strsm`, for
 * instance, is dispatch-count-dominated (sequential block dependency in the
 * triangular solve) rather than compute-bound like `sgemm`, so it uses
 * `WARMUP_ITERS=5`, `BENCH_ITERS=30`, and its own `SIZES` — the same reasoning
 * `strsv` applied at Level 2 to decide which parameters get a dedicated sweep,
 * even though `strsv` itself keeps Level 2's standard iteration counts. It
 * also reports GB/s only, no GFLOP/s, unlike every other Level 3 routine —
 * see below. Check the routine's own `wgblas/<routine>.js` for its actual
 * constants rather than assuming the table above.
 *
 * What's common across every routine at every level, regardless of that
 * table:
 *
 * - **Data stays on GPU** — vectors/matrices are allocated with
 *   `GpuVector.from()`/`GpuMatrix.from()` (JS) or `cudaMalloc` (C) before the
 *   timed loop. The measured time is pure compute; no host↔device transfer
 *   is included.
 * - **Timed iterations are individually timed; the median is recorded.**
 *   Median suppresses outliers from OS scheduler preemption better than mean.
 * - **Throughput** — `bytes / 1e9 / (median_ms / 1e3)` where `bytes` is the
 *   total memory traffic for the routine (e.g. saxpy reads `x`, reads and
 *   writes `y` → `3 × n × 4 bytes`). Level 3 routines are compute-bound, not
 *   just memory-bound, so they additionally report GFLOP/s: sgemm's is
 *   `(2×m×n×k + 2×m×n) / 1e9 / (median_ms / 1e3)`.
 * - **`init({ benchmark: true })`** — enables WebGPU timestamp queries so the
 *   JS benchmark measures actual GPU execution time, not the CPU-side await
 *   overhead.
 *
 * ## Make Commands
 *
 * | Command | What it does |
 * |---|---|
 * | `make bench` | Runs every `wgblas/*.js` benchmark (base + all sweep companions) in sequence |
 * | `make bench-<routine>` | Runs one routine's base wgblas benchmark, e.g. `make bench-saxpy` |
 * | `make bench-stride-<routine>` | Runs that routine's stride-sweep companion |
 * | `make bench-trans-<routine>` | Runs that routine's trans-sweep companion |
 * | `make bench-lda-<routine>` | Runs that routine's lda-sweep companion |
 * | `make bench-ldb-<routine>` | Runs that routine's ldb-sweep companion |
 * | `make bench-uplo-<routine>` | Runs that routine's uplo-sweep companion |
 * | `make cuda` | Compiles and runs every cuBLAS benchmark (NVIDIA only) |
 * | `make cuda-<routine>` | Compiles and runs one routine's base cuBLAS benchmark |
 * | `make cuda-stride-<routine>` / `-trans-` / `-lda-` / `-ldb-` / `-uplo-` | Same sweep companions, cuBLAS side |
 *
 * Pass `ARGS=low-power` to prefer the integrated GPU on dual-GPU machines:
 * `make bench-saxpy ARGS=low-power`.
 *
 * Results are saved automatically under `benchmarks/results/<gpu-model>/`,
 * following the same `wgblas/` vs `cuda/`, flat-vs-nested layout described
 * above.
 *
 * ## Contributing Results
 *
 * 1. Run `make bench` (and `make cuda` on NVIDIA).
 * 2. Commit the generated JSON files under `benchmarks/results/`.
 * 3. Open a pull request — a maintainer will run `scripts/gen-bench-tables.py`
 *    and commit the generated `.mjs`/`.svg` files before merging. See the
 *    `scripts` module for what that script does and its arguments.
 *
 * @module benchmarks
 */
