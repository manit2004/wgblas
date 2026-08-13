/**
 * Benchmark results for srot on Nvidia Geforce Rtx 4060 Laptop Gpu.
 *
 * ## Nvidia Geforce Rtx 4060 Laptop Gpu — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0833 | 0.0041 | 0.1255 | 66.4% |
 * | 64 | 0.0072 | 0.1429 | 0.0041 | 0.2500 | 57.1% |
 * | 128 | 0.0072 | 0.2857 | 0.0040 | 0.5079 | 56.3% |
 * | 512 | 0.0072 | 1.1429 | 0.0041 | 2.0000 | 57.1% |
 * | 1024 | 0.0072 | 2.2857 | 0.0040 | 4.0960 | 55.8% |
 * | 4096 | 0.0072 | 9.1429 | 0.0041 | 16.0000 | 57.1% |
 * | 16384 | 0.0082 | 32.0000 | 0.0041 | 64.0000 | 50.0% |
 * | 65536 | 0.0092 | 113.7778 | 0.0051 | 204.8000 | 55.6% |
 * | 262144 | 0.0133 | 315.0769 | 0.0102 | 409.6000 | 76.9% |
 * | 1048576 | 0.0266 | 630.1538 | 0.0297 | 565.2700 | 111.5% |
 * | 4194304 | 0.0963 | 697.1915 | 0.1526 | 439.8389 | 158.5% |
 * | 16777216 | 1.2580 | 213.3854 | 1.4033 | 191.2827 | 111.6% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![srot-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/srot/gbps-default.svg)
 *
 * ![srot-default ms chart](../../../assets/benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/srot/ms-default.svg)
 *
 * ## See also
 *
 * - [srot.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/srot/wgblas/srot.js) — WebGPU benchmark script
 * - [srot.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/srot/cuda/srot.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/srot
 */
