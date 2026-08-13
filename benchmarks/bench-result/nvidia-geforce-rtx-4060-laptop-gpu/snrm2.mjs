/**
 * Benchmark results for snrm2 on Nvidia Geforce Rtx 4060 Laptop Gpu.
 *
 * ## Nvidia Geforce Rtx 4060 Laptop Gpu — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0154 | 0.0083 | 0.0212 | 0.0060 | 138.9% |
 * | 64 | 0.0154 | 0.0167 | 0.0216 | 0.0118 | 141.2% |
 * | 128 | 0.0154 | 0.0333 | 0.0216 | 0.0237 | 140.6% |
 * | 512 | 0.0154 | 0.1333 | 0.0222 | 0.0923 | 144.5% |
 * | 1024 | 0.0154 | 0.2667 | 0.0231 | 0.1770 | 150.7% |
 * | 4096 | 0.0154 | 1.0667 | 0.0216 | 0.7596 | 140.4% |
 * | 16384 | 0.0154 | 4.2667 | 0.0226 | 2.9008 | 147.1% |
 * | 65536 | 0.0154 | 17.0667 | 0.0235 | 11.1380 | 153.2% |
 * | 262144 | 0.0164 | 64.0000 | 0.0234 | 44.8569 | 142.7% |
 * | 1048576 | 0.0215 | 195.0476 | 0.0236 | 177.7247 | 109.7% |
 * | 4194304 | 0.0369 | 455.1111 | 0.0401 | 417.9258 | 108.9% |
 * | 16777216 | 0.3338 | 201.0307 | 0.2949 | 227.5803 | 88.3% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![snrm2-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/snrm2/gbps-default.svg)
 *
 * ![snrm2-default ms chart](../../../assets/benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/snrm2/ms-default.svg)
 *
 * ## See also
 *
 * - [snrm2.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/snrm2/wgblas/snrm2.js) — WebGPU benchmark script
 * - [snrm2.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/snrm2/cuda/snrm2.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/snrm2
 */
