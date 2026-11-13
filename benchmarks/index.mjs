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
 *       <routine>.js          — wgblas benchmark (Node + WebGPU): the base
 *                                run and every parameter sweep, as one
 *                                runBenchmark spec (see "Parameter Sweeps" below)
 *     cuda/
 *       <routine>.c           — cuBLAS reference benchmark, plus the same
 *                                sweeps as wgblas/ above
 *       Makefile               — compiles and links against cublas
 *       bin/                    — build output (gitignored)
 *   roofline/wgblas/
 *     fma.js                   — peak FP32 throughput probe (the compute roof)
 *     bandwidth.js             — peak memory bandwidth probe (the memory roof)
 *   utils/
 *     helpers.mjs              — JS utilities: warmClocks, median, saveResults,
 *                                printHeader, printRow, getGpuModel, toColumnMajor
 *     helpers.h                — C utilities: warm_clocks, median, save_results*,
 *                                random_float_array, get_gpu_model, host_bytes_available
 *   results/
 *     <gpu-model-slug>/
 *       wgblas/<routine>/<routine>.json        — base benchmark
 *       wgblas/<routine>/<sweep>.<routine>.json  — one JSON per sweep
 *       wgblas/roofline/                       — fma.json, bandwidth.json, roofline.json
 *       cuda/...                               — same layout, cuBLAS results (NVIDIA only)
 *   bench-result/<gpu-model-slug>/              — generated docs pages (don't edit)
 *   bench.mk                   — the make targets below
 * ```
 *
 * ## Benchmarking Pattern
 *
 * A wgblas benchmark and its cuBLAS counterpart share the same
 * `WARMUP_ITERS`/`BENCH_ITERS`/`SIZES` for that one routine, so the two are
 * directly comparable — but those numbers scale down by BLAS level, since
 * work grows from O(n) to O(n²) to O(n³) and a Level 3 sweep at Level 1's
 * iteration count would take far too long to run:
 *
 * | | Level 1 (vector) | Level 2 (matrix-vector) | Level 3 (matrix-matrix) |
 * |---|---|---|---|
 * | Warmup iterations | 5 | 5 | 3 |
 * | Timed iterations | 100 | 100 | 20 |
 * | Sizes | `n` — 12 element counts, `32` to `16777216` | `m=n` — 9 square dimensions, `32` to `4096`, including `1280` (4096² ≈ 16.8M elements, matching Level 1's max) | `m=n=k` — 6 square dimensions, `32` to `1024` |
 *
 * That's the default per level, not a hard rule — a routine whose
 * performance profile doesn't fit gets its own numbers. `strsm`, for
 * instance, is dispatch-count-dominated (sequential block dependency in the
 * triangular solve) rather than compute-bound like `sgemm`, so it uses
 * `WARMUP_ITERS=5`, `BENCH_ITERS=30`, and its own `SIZES` (`64` to `4096`).
 * It also reports GB/s only, no GFLOP/s, unlike every other Level 3
 * routine. `strsv`/`dtrsv` keep Level 2's iteration counts but drop the
 * `1280` size. Check the routine's own `wgblas/<routine>.js` for its actual
 * constants rather than assuming the table above.
 *
 * Not every wgblas benchmark has a cuBLAS counterpart: the `layout` sweeps
 * are wgblas-only (cuBLAS has no row-major), and so is all of `sgemmtr`,
 * which cuBLAS doesn't provide. Those tables show wgblas numbers alone.
 *
 * ## Measurement
 *
 * What's common across every routine at every level, regardless of that
 * table:
 *
 * - **Data stays on GPU** — vectors/matrices are allocated with
 *   `GpuVector.from()`/`GpuMatrix.from()` (JS) or `cudaMalloc` (C) before the
 *   timed loop. The measured time is pure compute; no host↔device transfer
 *   is included.
 * - **GPU time, not wall time** — `init({ benchmark: true })` enables WebGPU
 *   timestamp queries, and each call returns its `gpuTimeMs`, so the JS
 *   benchmark measures GPU execution, not the CPU-side await overhead. The
 *   cuBLAS side times each call with a `cudaEventRecord` pair. Reductions
 *   (`dot`/`asum`/`nrm2`/`iamax`) run in device pointer mode
 *   (`cublasSetPointerMode(…, CUBLAS_POINTER_MODE_DEVICE)`), so their result
 *   stays on the GPU — in the default host mode the scalar's copy back to the
 *   host and the implicit sync would land inside the event window, while the
 *   wgblas timestamps exclude readback.
 * - **Full clocks before every configuration** — each size (and each sweep
 *   value) calls `warmClocks(device)` (JS) / `warm_clocks(handle)` (C) just
 *   before its warmup loop. The timed loops wait on every call, so with short
 *   kernels the GPU is mostly idle and the driver drops to a low-power state
 *   mid-sweep — on a GTX 1650, memory-bound configurations ran up to ~16×
 *   slower downclocked (sgemv 1024×2048 transposed: 0.975 ms vs 0.060 ms).
 *   Locking clocks would fix it but needs root; instead a memory-bound burst
 *   runs until two timed batches in a row are within 10% of the fastest seen,
 *   i.e. the memory clock is back at its peak. See `helpers.mjs` for details.
 * - **Timed iterations are individually timed; the median is recorded.**
 *   Median suppresses outliers from OS scheduler preemption better than mean.
 *   An iteration whose timestamp comes back non-finite or zero is dropped.
 * - **Configurations that don't fit are skipped, not failed** — where a
 *   buffer could outgrow the device (large strides, padded leading
 *   dimensions, f64), the JS side checks `maxStorageBufferBindingSize` and
 *   the C side `cudaMemGetInfo` plus, for the f64 routines that stage two
 *   host copies, available host RAM. A skip is printed and leaves a gap in
 *   the results rather than a crash.
 * - **Throughput** — `bytes / 1e9 / (median_ms / 1e3)` where `bytes` is the
 *   total memory traffic for the routine (e.g. saxpy reads `x`, reads and
 *   writes `y` → `3 × n × 4 bytes`). Level 3 routines are compute-bound, not
 *   just memory-bound, so they additionally report GFLOP/s: sgemm's is
 *   `(2×m×n×k + 2×m×n) / 1e9 / (median_ms / 1e3)`.
 * - **Efficiency** — the results tables compare against cuBLAS as
 *   `wgblas GB/s ÷ cuBLAS GB/s × 100`. Both sides count the same bytes, so
 *   this is just the ratio of median times: 100% is parity, above 100% means
 *   wgblas was faster.
 *
 * ## Parameter Sweeps
 *
 * The base benchmark varies only the problem size, with every other argument
 * fixed at a typical value (unit stride, no transpose, tight leading
 * dimensions, column-major). A sweep varies one other argument across its
 * own, usually smaller, set of sizes — a named sweep in the routine's
 * benchmark file, with its own `<sweep>.<routine>.json` result. A routine
 * only has the sweeps where that argument could
 * plausibly change the kernel's behaviour:
 *
 * | Sweep | What varies | Routines |
 * |---|---|---|
 * | `stride` | `incx`/`incy`, including non-power-of-two strides | every Level 1 and Level 2 routine |
 * | `lda` / `ldb` / `ldc` | padding added to that leading dimension | Level 2 and 3 routines where that matrix's padding was worth isolating |
 * | `trans` | `trans`, or for gemm all four `transA` × `transB` combinations | gemm, gemv, trmv, trsv, syrk, syr2k |
| `transA` / `transB` | that one transpose flag | sgemmtr (both), strmm and strsm (`transA`) |
 * | `uplo` | upper vs lower triangle | the symmetric and triangular routines |
 * | `diag` | unit vs non-unit diagonal | trmv, trsv, trmm, trsm |
 * | `side` | left vs right | ssymm, strmm, strsm |
 * | `layout` | column-major vs row-major (wgblas only — cuBLAS has no row-major) | Level 2 and 3 matrix routines |
 * | `alpha` / `beta` | scalar values, including `0` and `1` (and for `alpha` a denormal-producing `1e-38`) — the values a kernel *could* special-case | routines taking that scalar |
 * | `cosine` / `sine` | the rotation's `c` / `s` | srot, drot |
 *
 * Each sweep's section in the results pages says what was found, including
 * measured nulls (a flat sweep is recorded, not discarded).
 *
 * ## Roofline
 *
 * `scripts/roofline.py` places every routine at its arithmetic intensity
 * (FLOPs per byte of compulsory traffic) against what it achieved, under a
 * memory roof and a compute roof. Both roofs are measured, never typed in
 * from a datasheet: `roofline/wgblas/bandwidth.js` takes the best of three
 * vec4 access patterns, and `roofline/wgblas/fma.js` runs independent FMA
 * chains out of registers. They're deliberately separate kernels — taking a
 * roof from the routines being measured against it would be circular (sgemm
 * would score 100% of a roof sgemm defined).
 *
 * Intensity comes from each routine's base benchmark at its largest size:
 * `compute_GFLOPs / compute_GBs` where both are recorded, otherwise the
 * standard BLAS FLOP count supplied by `roofline.py` (Level 1 and most of
 * Level 2 record bytes only). It assumes perfect caching, so it's exact for
 * the streaming Level 1 and 2 kernels and an upper bound for tiled Level 3
 * ones. A GPU without both probe results is skipped.
 *
 * ## Make Commands
 *
 * | Command | What it does |
 * |---|---|
 * | `make bench` | Runs every wgblas benchmark — every routine, every sweep, and the roofline probes |
 * | `make bench-<routine>` | Runs every benchmark that routine has (base and sweeps), e.g. `make bench-sgemm` |
 * | `make bench-roofline` | Runs just the two roofline probes |
 * | `make cuda` | Compiles and runs every cuBLAS benchmark (NVIDIA only) |
 * | `make cuda-<routine>` | Compiles and runs every cuBLAS benchmark that routine has |
 *
 * To run only some sweeps, name them:
 * `node benchmarks/sgemm/wgblas/sgemm.js --sweeps=alpha,beta`. `--plan`
 * lists a file's points without a GPU, and `--check` compares them with the
 * committed results.
 *
 * Pass `ARGS=low-power` to prefer the integrated GPU on dual-GPU machines:
 * `make bench-saxpy ARGS=low-power`.
 *
 * Results are saved automatically under `benchmarks/results/<gpu-model>/`,
 * following the layout above.
 *
 * ## From Results to These Pages
 *
 * - `python3 scripts/roofline.py --svg` reads the results tree and writes
 *   `results/<gpu>/wgblas/roofline/roofline.json` and the roofline chart.
 * - `make bench-tables` (`scripts/gen-bench-tables.py`) generates the
 *   per-GPU pages in `bench-result/` and their charts — the tables in this
 *   module's results pages. It reads the results from GitHub, not local
 *   disk, so it shows what's been pushed (`--local` uses the working tree).
 * - The `GPU Benchmarks (Kaggle)` GitHub Actions workflow, triggered by hand,
 *   runs `make bench` on a Kaggle GPU and commits the results back.
 *
 * ## Contributing Results
 *
 * 1. Run `make bench` (and `make cuda` on NVIDIA).
 * 2. Commit the generated JSON files under `benchmarks/results/`.
 * 3. Open a pull request — a maintainer will run `scripts/roofline.py` and
 *    `scripts/gen-bench-tables.py` and commit the generated `.mjs`/`.svg`
 *    files before merging. See the `scripts` module for what those scripts
 *    do and their arguments.
 *
 * @module benchmarks
 */
