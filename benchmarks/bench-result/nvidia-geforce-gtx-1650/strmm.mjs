/**
 * Benchmark results for strmm on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0143 | 2.2857 | 0.0060 | 5.4180 | 42.2% |
 * | 64 | 0.0184 | 7.1111 | 0.0121 | 10.7931 | 65.9% |
 * | 128 | 0.0325 | 16.1498 | 0.0310 | 16.9169 | 95.5% |
 * | 256 | 0.1417 | 14.7970 | 0.0772 | 27.1821 | 54.4% |
 * | 512 | 0.4657 | 18.0131 | 0.3379 | 24.8242 | 72.6% |
 * | 1024 | 3.2832 | 10.2201 | 1.2431 | 26.9918 | 37.9% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![strmm-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/gbps-default.svg)
 *
 * ![strmm-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/ms-default.svg)
 *
 * ## See also
 *
 * - [strmm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmm/wgblas/strmm.js) — WebGPU benchmark script
 * - [strmm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmm/cuda/strmm.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/strmm
 */
