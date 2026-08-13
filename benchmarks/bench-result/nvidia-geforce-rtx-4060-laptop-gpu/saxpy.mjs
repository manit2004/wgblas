/**
 * Benchmark results for saxpy on Nvidia Geforce Rtx 4060 Laptop Gpu.
 *
 * ## Nvidia Geforce Rtx 4060 Laptop Gpu — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0625 | 0.0041 | 0.0938 | 66.6% |
 * | 64 | 0.0072 | 0.1071 | 0.0041 | 0.1875 | 57.1% |
 * | 128 | 0.0072 | 0.2143 | 0.0041 | 0.3750 | 57.1% |
 * | 512 | 0.0072 | 0.8571 | 0.0041 | 1.5000 | 57.1% |
 * | 1024 | 0.0072 | 1.7143 | 0.0041 | 3.0000 | 57.1% |
 * | 4096 | 0.0072 | 6.8571 | 0.0041 | 12.0000 | 57.1% |
 * | 16384 | 0.0072 | 27.4286 | 0.0041 | 48.0000 | 57.1% |
 * | 65536 | 0.0092 | 85.3333 | 0.0041 | 191.2529 | 44.6% |
 * | 262144 | 0.0133 | 236.3077 | 0.0061 | 512.0000 | 46.2% |
 * | 1048576 | 0.0266 | 472.6154 | 0.0153 | 820.9103 | 57.6% |
 * | 4194304 | 0.0870 | 578.2588 | 0.0528 | 954.1183 | 60.6% |
 * | 16777216 | 0.8970 | 224.4384 | 1.0158 | 198.1936 | 113.2% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![saxpy-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/saxpy/gbps-default.svg)
 *
 * ![saxpy-default ms chart](../../../assets/benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/saxpy/ms-default.svg)
 *
 * ## See also
 *
 * - [saxpy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/saxpy/wgblas/saxpy.js) — WebGPU benchmark script
 * - [saxpy.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/saxpy/cuda/saxpy.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/saxpy
 */
