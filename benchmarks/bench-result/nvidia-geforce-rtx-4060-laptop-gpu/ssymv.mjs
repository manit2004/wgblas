/**
 * Benchmark results for ssymv on Nvidia Geforce Rtx 4060 Laptop Gpu.
 *
 * ## Nvidia Geforce Rtx 4060 Laptop Gpu — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.4062 | 0.0041 | 0.6094 | 66.7% |
 * | 64 | 0.0061 | 1.4792 | 0.0041 | 2.2188 | 66.7% |
 * | 128 | 0.0072 | 4.8214 | 0.0051 | 6.7500 | 71.4% |
 * | 256 | 0.0082 | 16.4375 | 0.0061 | 21.9167 | 75.0% |
 * | 512 | 0.0102 | 51.9000 | 0.0092 | 57.6667 | 90.0% |
 * | 1024 | 0.0215 | 98.1905 | 0.0164 | 128.8750 | 76.2% |
 * | 1280 | 0.0297 | 110.9483 | 0.0256 | 128.7000 | 86.2% |
 * | 2048 | 0.0584 | 144.2105 | 0.0287 | 293.5714 | 49.1% |
 * | 4096 | 0.4731 | 71.0476 | 0.1239 | 271.2727 | 26.2% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![ssymv-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/ssymv/gbps-default.svg)
 *
 * ![ssymv-default ms chart](../../../assets/benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/ssymv/ms-default.svg)
 *
 * ## See also
 *
 * - [ssymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/wgblas/ssymv.js) — WebGPU benchmark script
 * - [ssymv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/cuda/ssymv.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/ssymv
 */
