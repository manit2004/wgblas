/**
 * Benchmark results for sasum on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0185 | 0.0069 | 0.0183 | 0.0070 | 99.0% |
 * | 64 | 0.0186 | 0.0138 | 0.0189 | 0.0136 | 101.3% |
 * | 128 | 0.0184 | 0.0278 | 0.0220 | 0.0232 | 119.7% |
 * | 512 | 0.0184 | 0.1112 | 0.0214 | 0.0957 | 116.2% |
 * | 1024 | 0.0180 | 0.2278 | 0.0189 | 0.2169 | 105.0% |
 * | 4096 | 0.0184 | 0.8912 | 0.0186 | 0.8797 | 101.3% |
 * | 16384 | 0.0185 | 3.5341 | 0.0189 | 3.4741 | 101.7% |
 * | 65536 | 0.0198 | 13.2236 | 0.0195 | 13.4737 | 98.1% |
 * | 262144 | 0.0308 | 34.0624 | 0.0215 | 48.6894 | 70.0% |
 * | 1048576 | 0.0679 | 61.7681 | 0.0446 | 93.9584 | 65.7% |
 * | 4194304 | 0.2204 | 76.1327 | 0.1410 | 118.9806 | 64.0% |
 * | 16777216 | 0.8648 | 77.6019 | 0.5677 | 118.2093 | 65.6% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. Higher means wgblas is closer to cuBLAS throughput.
 *
 * ## See also
 *
 * - [benchmark.sasum.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sasum/benchmark.sasum.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sasum/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sasum
 */
