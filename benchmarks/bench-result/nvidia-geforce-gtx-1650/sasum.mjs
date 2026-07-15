/**
 * Benchmark results for sasum on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0193 | 0.0066 | 0.0187 | 0.0068 | 97.3% |
 * | 64 | 0.0196 | 0.0131 | 0.0185 | 0.0139 | 94.1% |
 * | 128 | 0.0195 | 0.0263 | 0.0183 | 0.0279 | 94.1% |
 * | 512 | 0.0197 | 0.1039 | 0.0182 | 0.1125 | 92.4% |
 * | 1024 | 0.0197 | 0.2081 | 0.0186 | 0.2207 | 94.3% |
 * | 4096 | 0.0195 | 0.8393 | 0.0186 | 0.8790 | 95.5% |
 * | 16384 | 0.0201 | 3.2663 | 0.0188 | 3.4830 | 93.8% |
 * | 65536 | 0.0205 | 12.8000 | 0.0183 | 14.3468 | 89.2% |
 * | 262144 | 0.0267 | 39.2666 | 0.0191 | 55.0260 | 71.4% |
 * | 1048576 | 0.0468 | 89.5301 | 0.0444 | 94.4323 | 94.8% |
 * | 4194304 | 0.1167 | 143.7193 | 0.1402 | 119.6458 | 120.1% |
 * | 16777216 | 0.4055 | 165.4819 | 0.5659 | 118.5904 | 139.5% |
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
