/**
 * Benchmark results for srotm on Nvidia Geforce Rtx 4060 Laptop Gpu.
 *
 * ## Nvidia Geforce Rtx 4060 Laptop Gpu — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0833 | 0.0051 | 0.1000 | 83.3% |
 * | 64 | 0.0061 | 0.1667 | 0.0041 | 0.2500 | 66.7% |
 * | 128 | 0.0051 | 0.4000 | 0.0041 | 0.5000 | 80.0% |
 * | 512 | 0.0051 | 1.6000 | 0.0041 | 2.0000 | 80.0% |
 * | 1024 | 0.0051 | 3.2000 | 0.0041 | 4.0000 | 80.0% |
 * | 4096 | 0.0051 | 12.8000 | 0.0041 | 16.0000 | 80.0% |
 * | 16384 | 0.0061 | 42.6667 | 0.0041 | 64.0000 | 66.7% |
 * | 65536 | 0.0072 | 146.2857 | 0.0072 | 146.6130 | 99.8% |
 * | 262144 | 0.0102 | 409.6000 | 0.0092 | 455.1111 | 90.0% |
 * | 1048576 | 0.0215 | 780.1905 | 0.0307 | 546.1334 | 142.9% |
 * | 4194304 | 0.0911 | 736.3596 | 0.1516 | 442.8108 | 166.3% |
 * | 16777216 | 1.2575 | 213.4723 | 1.3834 | 194.0370 | 110.0% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![srotm-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/srotm/gbps-default.svg)
 *
 * ![srotm-default ms chart](../../../assets/benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/srotm/ms-default.svg)
 *
 * ## See also
 *
 * - [srotm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/srotm/wgblas/srotm.js) — WebGPU benchmark script
 * - [srotm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/srotm/cuda/srotm.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/srotm
 */
