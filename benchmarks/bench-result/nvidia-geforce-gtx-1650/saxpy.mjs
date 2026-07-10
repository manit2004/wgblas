/**
 * Benchmark results for saxpy on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0069 | 0.0553 | 0.0033 | 0.1165 | 47.5% |
 * | 64 | 0.0072 | 0.1071 | 0.0033 | 0.2353 | 45.5% |
 * | 128 | 0.0069 | 0.2222 | 0.0034 | 0.4571 | 48.6% |
 * | 512 | 0.0072 | 0.8571 | 0.0034 | 1.8199 | 47.1% |
 * | 1024 | 0.0072 | 1.7029 | 0.0033 | 3.7647 | 45.2% |
 * | 4096 | 0.0073 | 6.7516 | 0.0035 | 14.0917 | 47.9% |
 * | 16384 | 0.0080 | 24.4781 | 0.0039 | 49.9512 | 49.0% |
 * | 65536 | 0.0101 | 77.6493 | 0.0059 | 132.4852 | 58.6% |
 * | 262144 | 0.0246 | 128.0000 | 0.0212 | 148.1598 | 86.4% |
 * | 1048576 | 0.0778 | 161.6842 | 0.0739 | 170.2234 | 95.0% |
 * | 4194304 | 0.2924 | 172.1234 | 0.2887 | 174.3559 | 98.7% |
 * | 16777216 | 1.1528 | 174.6487 | 1.1308 | 178.0391 | 98.1% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. Higher means wgblas is closer to cuBLAS throughput.
 *
 * ## See also
 *
 * - [benchmark.saxpy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/saxpy/benchmark.saxpy.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/saxpy/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/saxpy
 */
