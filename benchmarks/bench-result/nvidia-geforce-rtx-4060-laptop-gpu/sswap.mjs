/**
 * Benchmark results for sswap on Nvidia Geforce Rtx 4060 Laptop Gpu.
 *
 * ## Nvidia Geforce Rtx 4060 Laptop Gpu — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0833 | 0.0041 | 0.1250 | 66.7% |
 * | 64 | 0.0061 | 0.1667 | 0.0041 | 0.2500 | 66.7% |
 * | 128 | 0.0061 | 0.3333 | 0.0051 | 0.4000 | 83.3% |
 * | 512 | 0.0061 | 1.3333 | 0.0046 | 1.7840 | 74.7% |
 * | 1024 | 0.0061 | 2.6667 | 0.0051 | 3.2201 | 82.8% |
 * | 4096 | 0.0061 | 10.6667 | 0.0051 | 12.8000 | 83.3% |
 * | 16384 | 0.0072 | 36.5714 | 0.0040 | 65.0159 | 56.2% |
 * | 65536 | 0.0072 | 146.2857 | 0.0041 | 256.0000 | 57.1% |
 * | 262144 | 0.0113 | 372.3636 | 0.0082 | 512.0000 | 72.7% |
 * | 1048576 | 0.0246 | 682.6667 | 0.0276 | 606.8148 | 112.5% |
 * | 4194304 | 0.1085 | 618.2642 | 0.1331 | 504.1230 | 122.6% |
 * | 16777216 | 1.2063 | 222.5331 | 1.1935 | 224.9198 | 98.9% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![sswap-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/sswap/gbps-default.svg)
 *
 * ![sswap-default ms chart](../../../assets/benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/sswap/ms-default.svg)
 *
 * ## See also
 *
 * - [sswap.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sswap/wgblas/sswap.js) — WebGPU benchmark script
 * - [sswap.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sswap/cuda/sswap.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/sswap
 */
