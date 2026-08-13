/**
 * Benchmark results for isamax on Nvidia Geforce Rtx 4060 Laptop Gpu.
 *
 * ## Nvidia Geforce Rtx 4060 Laptop Gpu — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0164 | 0.0078 | 0.0125 | 0.0102 | 76.6% |
 * | 64 | 0.0164 | 0.0156 | 0.0123 | 0.0209 | 74.8% |
 * | 128 | 0.0164 | 0.0313 | 0.0122 | 0.0419 | 74.6% |
 * | 512 | 0.0164 | 0.1250 | 0.0123 | 0.1667 | 75.0% |
 * | 1024 | 0.0164 | 0.2500 | 0.0120 | 0.3400 | 73.5% |
 * | 4096 | 0.0164 | 1.0000 | 0.0173 | 0.9455 | 105.8% |
 * | 16384 | 0.0164 | 4.0000 | 0.0215 | 3.0499 | 131.2% |
 * | 65536 | 0.0164 | 16.0000 | 0.0222 | 11.7955 | 135.6% |
 * | 262144 | 0.0184 | 56.8889 | 0.0239 | 43.8075 | 129.9% |
 * | 1048576 | 0.0236 | 178.0870 | 0.0239 | 175.5820 | 101.4% |
 * | 4194304 | 0.0389 | 431.1579 | 0.0329 | 510.0078 | 84.5% |
 * | 16777216 | 0.3348 | 200.4159 | 0.3302 | 203.2419 | 98.6% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![isamax-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/isamax/gbps-default.svg)
 *
 * ![isamax-default ms chart](../../../assets/benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/isamax/ms-default.svg)
 *
 * ## See also
 *
 * - [isamax.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/isamax/wgblas/isamax.js) — WebGPU benchmark script
 * - [isamax.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/isamax/cuda/isamax.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/isamax
 */
