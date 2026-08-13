/**
 * Benchmark results for sgemv on Nvidia Geforce Rtx 4060 Laptop Gpu.
 *
 * ## Nvidia Geforce Rtx 4060 Laptop Gpu — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 0.5469 | 0.0051 | 0.8750 | 62.5% |
 * | 64 | 0.0082 | 2.0938 | 0.0051 | 3.3500 | 62.5% |
 * | 128 | 0.0082 | 8.1875 | 0.0051 | 13.1000 | 62.5% |
 * | 256 | 0.0092 | 28.7778 | 0.0061 | 43.1667 | 66.7% |
 * | 512 | 0.0102 | 103.0000 | 0.0061 | 171.6667 | 60.0% |
 * | 1024 | 0.0148 | 283.3103 | 0.0092 | 456.4444 | 62.1% |
 * | 1280 | 0.0164 | 400.9375 | 0.0123 | 534.5833 | 75.0% |
 * | 2048 | 0.0266 | 631.0769 | 0.0215 | 781.3333 | 80.8% |
 * | 4096 | 0.3174 | 211.5613 | 0.3164 | 212.2459 | 99.7% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![sgemv-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/sgemv/gbps-default.svg)
 *
 * ![sgemv-default ms chart](../../../assets/benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/sgemv/ms-default.svg)
 *
 * ## See also
 *
 * - [sgemv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemv/wgblas/sgemv.js) — WebGPU benchmark script
 * - [sgemv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemv/cuda/sgemv.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/sgemv
 */
