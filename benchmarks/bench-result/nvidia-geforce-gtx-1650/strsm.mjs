/**
 * Benchmark results for strsm on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | order | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0926 | 0.4439 | 0.0105 | 3.9206 | 11.3% |
 * | 128 | 0.1271 | 0.7755 | 0.0223 | 4.4285 | 17.5% |
 * | 256 | 0.2265 | 1.1596 | 0.0634 | 4.1413 | 28.0% |
 * | 512 | 0.4833 | 1.6294 | 0.1473 | 5.3443 | 30.5% |
 * | 1024 | 1.0300 | 2.5470 | 0.3574 | 7.3406 | 34.7% |
 * | 2048 | 2.4944 | 3.7849 | 1.5066 | 6.2667 | 60.4% |
 * | 4096 | 6.7320 | 5.2970 | 5.6108 | 6.3556 | 83.3% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![strsm-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/gbps-default.svg)
 *
 * ![strsm-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/ms-default.svg)
 *
 * ## See also
 *
 * - [strsm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsm/wgblas/strsm.js) — WebGPU benchmark script
 * - [strsm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsm/cuda/strsm.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/strsm
 */
