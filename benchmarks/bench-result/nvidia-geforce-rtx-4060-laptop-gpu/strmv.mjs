/**
 * Benchmark results for strmv on Nvidia Geforce Rtx 4060 Laptop Gpu.
 *
 * ## Nvidia Geforce Rtx 4060 Laptop Gpu — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.3854 | 0.0051 | 0.4654 | 82.8% |
 * | 64 | 0.0061 | 1.4375 | 0.0061 | 1.4375 | 100.0% |
 * | 128 | 0.0072 | 4.7500 | 0.0092 | 3.6944 | 128.6% |
 * | 256 | 0.0072 | 18.6429 | 0.0256 | 5.2200 | 357.1% |
 * | 512 | 0.0092 | 57.4444 | 0.0635 | 8.3387 | 688.9% |
 * | 1024 | 0.0133 | 158.3077 | 0.2340 | 9.0066 | 1757.7% |
 * | 1280 | 0.0154 | 214.1667 | 0.1341 | 24.5229 | 873.3% |
 * | 2048 | 0.0236 | 357.0435 | 0.2150 | 39.1048 | 913.0% |
 * | 4096 | 0.0942 | 356.6087 | 0.2386 | 140.8069 | 253.3% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![strmv-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/strmv/gbps-default.svg)
 *
 * ![strmv-default ms chart](../../../assets/benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/strmv/ms-default.svg)
 *
 * ## See also
 *
 * - [strmv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmv/wgblas/strmv.js) — WebGPU benchmark script
 * - [strmv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmv/cuda/strmv.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/strmv
 */
