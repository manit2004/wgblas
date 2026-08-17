/**
 * Benchmark results for ssymm on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0142 | 1.7336 | 0.0069 | 3.5804 | 48.4% |
 * | 64 | 0.0184 | 5.3333 | 0.0108 | 9.0888 | 58.7% |
 * | 128 | 0.0324 | 12.1243 | 0.0310 | 12.7008 | 95.5% |
 * | 256 | 0.1432 | 10.9874 | 0.1412 | 11.1380 | 98.6% |
 * | 512 | 0.4669 | 13.4737 | 0.3285 | 19.1532 | 70.3% |
 * | 1024 | 3.2935 | 7.6410 | 4.9656 | 5.0680 | 150.8% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![ssymm-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-default.svg)
 *
 * ![ssymm-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-default.svg)
 *
 * ## See also
 *
 * - [ssymm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/wgblas/ssymm.js) — WebGPU benchmark script
 * - [ssymm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/cuda/ssymm.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/ssymm
 */
