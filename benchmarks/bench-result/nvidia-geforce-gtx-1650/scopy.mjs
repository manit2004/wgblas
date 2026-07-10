/**
 * Benchmark results for scopy on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0058 | 0.0438 | 0.0028 | 0.0930 | 47.1% |
 * | 64 | 0.0058 | 0.0882 | 0.0027 | 0.1928 | 45.7% |
 * | 128 | 0.0058 | 0.1768 | 0.0027 | 0.3832 | 46.1% |
 * | 512 | 0.0060 | 0.6863 | 0.0027 | 1.5148 | 45.3% |
 * | 1024 | 0.0059 | 1.3875 | 0.0027 | 3.0118 | 46.1% |
 * | 4096 | 0.0060 | 5.4759 | 0.0028 | 11.8382 | 46.3% |
 * | 16384 | 0.0063 | 20.7919 | 0.0038 | 34.4202 | 60.4% |
 * | 65536 | 0.0082 | 64.2510 | 0.0048 | 109.9597 | 58.4% |
 * | 262144 | 0.0186 | 112.8958 | 0.0157 | 133.3387 | 84.7% |
 * | 1048576 | 0.0594 | 141.2414 | 0.0532 | 157.5385 | 89.7% |
 * | 4194304 | 0.2171 | 154.5660 | 0.2031 | 165.1951 | 93.6% |
 * | 16777216 | 0.8154 | 164.5987 | 0.8068 | 166.3515 | 98.9% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. Higher means wgblas is closer to cuBLAS throughput.
 *
 * ## See also
 *
 * - [benchmark.scopy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/scopy/benchmark.scopy.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/scopy/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/scopy
 */
