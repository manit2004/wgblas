/**
 * Benchmark results for strsv on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0470 | 0.0504 | 0.0100 | 0.2357 | 21.4% |
 * | 64 | 0.0869 | 0.1016 | 0.0123 | 0.7188 | 14.1% |
 * | 128 | 0.1065 | 0.3197 | 0.0172 | 1.9795 | 16.2% |
 * | 256 | 0.1700 | 0.7861 | 0.0265 | 5.0496 | 15.6% |
 * | 512 | 0.3482 | 1.5206 | 0.0449 | 11.7877 | 12.9% |
 * | 1024 | 0.7417 | 2.8413 | 0.0983 | 21.4375 | 13.3% |
 * | 2048 | 1.6872 | 4.9840 | 0.1948 | 43.1749 | 11.5% |
 * | 4096 | 3.6253 | 9.2669 | 0.4223 | 79.5556 | 11.6% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![strsv-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-default.svg)
 *
 * ![strsv-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-default.svg)
 *
 * ## See also
 *
 * - [strsv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/wgblas/strsv.js) — WebGPU benchmark script
 * - [strsv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/cuda/strsv.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/strsv
 */
