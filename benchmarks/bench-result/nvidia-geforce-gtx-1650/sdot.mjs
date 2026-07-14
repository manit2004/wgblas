/**
 * Benchmark results for sdot on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0186 | 0.0138 | 0.0189 | 0.0136 | 101.2% |
 * | 64 | 0.0187 | 0.0274 | 0.0188 | 0.0273 | 100.5% |
 * | 128 | 0.0182 | 0.0562 | 0.0188 | 0.0546 | 102.9% |
 * | 512 | 0.0185 | 0.2218 | 0.0189 | 0.2166 | 102.4% |
 * | 1024 | 0.0184 | 0.4452 | 0.0189 | 0.4339 | 102.6% |
 * | 4096 | 0.0186 | 1.7655 | 0.0189 | 1.7356 | 101.7% |
 * | 16384 | 0.0192 | 6.8438 | 0.0189 | 6.9424 | 98.6% |
 * | 65536 | 0.0203 | 25.8016 | 0.0188 | 27.9114 | 92.4% |
 * | 262144 | 0.0321 | 65.3074 | 0.0281 | 74.6849 | 87.4% |
 * | 1048576 | 0.0669 | 125.4578 | 0.0639 | 131.2689 | 95.6% |
 * | 4194304 | 0.2043 | 164.2120 | 0.1976 | 169.8511 | 96.7% |
 * | 16777216 | 0.7497 | 179.0181 | 0.7353 | 182.5237 | 98.1% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. Higher means wgblas is closer to cuBLAS throughput.
 *
 * ## See also
 *
 * - [benchmark.sdot.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sdot/benchmark.sdot.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sdot/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sdot
 */
