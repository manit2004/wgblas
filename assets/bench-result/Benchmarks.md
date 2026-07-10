# Benchmarks

Per-routine GPU benchmark results. Each GPU section shows compute time (ms) and throughput (GB/s) across a range of vector sizes.

For NVIDIA GPUs, efficiency compares wgblas throughput against cuBLAS as a percentage — higher is better.

All benchmarks were run on host machines with physical GPUs — no virtual devices, emulation, or cloud GPU instances. Results reflect real hardware performance as measured on the contributor's own machine.

## Folder Structure

```
benchmarks/
  <routine>/
    benchmark.<routine>.js   — wgblas benchmark (Node + WebGPU)
    cuda/
      benchmark.c            — cuBLAS reference benchmark (C + CUDA)
      Makefile               — compiles and links against cublas
      benchmark              — compiled binary (git-ignored)
  utils/
    helpers.mjs              — shared JS utilities (median, saveResults, printRow)
    helpers.h                — shared C utilities (median, save_results, random_float_array)
  results/
    <gpu-model-slug>/
      wgblas/<routine>.json  — recorded wgblas results
      cuda/<routine>.json    — recorded cuBLAS results (NVIDIA only)
```

## Benchmarking Pattern

Both the wgblas and cuBLAS benchmarks follow the same methodology so results are directly comparable:

- **Data stays on GPU** — vectors are allocated with `GpuVector.from()` (wgblas) or `cudaMalloc` (CUDA) before the timed loop. The measured time is pure compute — no host↔device transfer cost included.
- **Warmup** — 5 iterations before timing begins, to let the GPU reach steady-state clock speeds and fill any driver/JIT caches.
- **100 timed iterations** — each iteration is timed individually; the **median** of the 100 samples is recorded. Median is used instead of mean to suppress outliers from OS scheduler preemption.
- **Sizes** — `[32, 64, 128, 512, 1024, 4096, 16384, 65536, 262144, 1048576, 4194304, 16777216]` — the same 12 sizes for both backends.
- **Throughput formula** — `bytes / 1e9 / (median_ms / 1e3)` where `bytes` is the total memory traffic for the routine (e.g. saxpy reads `x`, reads and writes `y` → `3 × n × 4` bytes).
- **`init({ benchmark: true })`** — enables WebGPU timestamp queries so the JS benchmark measures actual GPU execution time, not the CPU-side await overhead.

## Running Benchmarks

### wgblas (WebGPU)

```sh
make bench              # run all routines
make bench-saxpy        # run one routine
```

Pass `low-power` to prefer the integrated GPU on machines with dual GPUs:

```sh
make bench-saxpy ARGS=low-power
```

Results are saved automatically to `benchmarks/results/<gpu-model>/wgblas/<routine>.json`.

### cuBLAS (NVIDIA only)

Requires CUDA toolkit and `nvcc` on `PATH`.

```sh
make cuda               # compile and run all routines
make cuda-saxpy         # compile and run one routine
```

Results are saved to `benchmarks/results/<gpu-model>/cuda/<routine>.json`.

## Adding Your Results

1. Run `make bench` (and `make cuda` if on NVIDIA).
2. Commit the generated JSON files under `benchmarks/results/`.
3. Open a pull request — the benchmark tables in these docs are regenerated from the JSON files by `scripts/gen-bench-tables.py`.

## See also

- [Raw benchmark JSON results](https://github.com/manit2004/wgblas/tree/main/benchmarks/results) — the recorded output files that feed this table
