/**
 * Benchmark results for strsm on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 *
 *
 * ## See also
 *
 * - [strsm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsm/wgblas/strsm.js) — WebGPU benchmark script
 * - [strsm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsm/cuda/strsm.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/strsm
 */
