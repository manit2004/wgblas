/**
 * Benchmark results for scopy on Nvidia Geforce Rtx 4060 Laptop Gpu.
 *
 * ## Nvidia Geforce Rtx 4060 Laptop Gpu — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0417 | 0.0041 | 0.0625 | 66.7% |
 * | 64 | 0.0061 | 0.0833 | 0.0041 | 0.1250 | 66.7% |
 * | 128 | 0.0061 | 0.1667 | 0.0041 | 0.2500 | 66.7% |
 * | 512 | 0.0061 | 0.6667 | 0.0041 | 1.0000 | 66.7% |
 * | 1024 | 0.0061 | 1.3333 | 0.0041 | 2.0000 | 66.7% |
 * | 4096 | 0.0061 | 5.3333 | 0.0041 | 8.0000 | 66.7% |
 * | 16384 | 0.0061 | 21.3333 | 0.0041 | 32.0000 | 66.7% |
 * | 65536 | 0.0072 | 73.1429 | 0.0041 | 128.0000 | 57.1% |
 * | 262144 | 0.0102 | 204.8000 | 0.0061 | 341.3333 | 60.0% |
 * | 1048576 | 0.0236 | 356.1739 | 0.0132 | 633.1981 | 56.2% |
 * | 4194304 | 0.0768 | 436.9067 | 0.0512 | 655.3600 | 66.7% |
 * | 16777216 | 0.5714 | 234.8961 | 0.6748 | 198.9000 | 118.1% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![scopy-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/scopy/gbps-default.svg)
 *
 * ![scopy-default ms chart](../../../assets/benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/scopy/ms-default.svg)
 *
 * ## See also
 *
 * - [scopy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/scopy/wgblas/scopy.js) — WebGPU benchmark script
 * - [scopy.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/scopy/cuda/scopy.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/scopy
 */
