/**
 * Benchmark results for isamax on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0205 | 0.0063 | 0.0170 | 0.0075 | 83.3% |
 * | 64 | 0.0206 | 0.0125 | 0.0170 | 0.0151 | 82.5% |
 * | 128 | 0.0205 | 0.0250 | 0.0173 | 0.0296 | 84.5% |
 * | 512 | 0.0204 | 0.1005 | 0.0172 | 0.1190 | 84.4% |
 * | 1024 | 0.0205 | 0.2002 | 0.0170 | 0.2415 | 82.9% |
 * | 4096 | 0.0203 | 0.8063 | 0.0180 | 0.9094 | 88.7% |
 * | 16384 | 0.0209 | 3.1339 | 0.0187 | 3.4979 | 89.6% |
 * | 65536 | 0.0216 | 12.1633 | 0.0180 | 14.5248 | 83.7% |
 * | 262144 | 0.0285 | 36.7973 | 0.0202 | 51.8071 | 71.0% |
 * | 1048576 | 0.0472 | 88.8022 | 0.0404 | 103.6962 | 85.6% |
 * | 4194304 | 0.1178 | 142.4309 | 0.1083 | 154.8857 | 92.0% |
 * | 16777216 | 0.4053 | 165.5864 | 0.4051 | 165.6453 | 100.0% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. Higher means wgblas is closer to cuBLAS throughput.
 *
 * ## See also
 *
 * - [benchmark.isamax.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/isamax/benchmark.isamax.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/isamax/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/isamax
 */
