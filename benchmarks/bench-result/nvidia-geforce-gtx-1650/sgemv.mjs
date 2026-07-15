/**
 * Benchmark results for sgemv on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 0.5469 | 0.0060 | 0.7447 | 73.4% |
 * | 64 | 0.0083 | 2.0695 | 0.0060 | 2.8360 | 73.0% |
 * | 128 | 0.0091 | 7.3415 | 0.0061 | 10.9167 | 67.3% |
 * | 256 | 0.0111 | 23.8161 | 0.0088 | 30.2482 | 78.7% |
 * | 512 | 0.0164 | 64.3750 | 0.0102 | 103.0000 | 62.5% |
 * | 1024 | 0.0359 | 117.3191 | 0.0367 | 114.6085 | 102.4% |
 * | 1280 | 0.0485 | 135.4983 | 0.0451 | 145.5887 | 93.1% |
 * | 2048 | 0.1042 | 161.1837 | 0.1042 | 161.1837 | 100.0% |
 * | 4096 | 0.3727 | 180.1758 | 0.3736 | 179.7745 | 100.2% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. Higher means wgblas is closer to cuBLAS throughput.
 *
 * ## See also
 *
 * - [benchmark.sgemv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemv/benchmark.sgemv.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemv/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sgemv
 */
