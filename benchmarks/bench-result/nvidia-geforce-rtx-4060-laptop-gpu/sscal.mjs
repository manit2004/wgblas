/**
 * Benchmark results for sscal on Nvidia Geforce Rtx 4060 Laptop Gpu.
 *
 * ## Nvidia Geforce Rtx 4060 Laptop Gpu — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0417 | 0.0174 | 0.0147 | 283.4% |
 * | 64 | 0.0051 | 0.1000 | 0.0051 | 0.1000 | 100.0% |
 * | 128 | 0.0051 | 0.2000 | 0.0051 | 0.2000 | 100.0% |
 * | 512 | 0.0051 | 0.8000 | 0.0051 | 0.8000 | 100.0% |
 * | 1024 | 0.0051 | 1.6000 | 0.0051 | 1.6000 | 100.0% |
 * | 4096 | 0.0051 | 6.4000 | 0.0051 | 6.4000 | 100.0% |
 * | 16384 | 0.0061 | 21.3333 | 0.0051 | 25.6000 | 83.3% |
 * | 65536 | 0.0072 | 73.1429 | 0.0051 | 102.4000 | 71.4% |
 * | 262144 | 0.0102 | 204.8000 | 0.0061 | 341.3333 | 60.0% |
 * | 1048576 | 0.0236 | 356.1739 | 0.0123 | 682.6666 | 52.2% |
 * | 4194304 | 0.0788 | 425.5584 | 0.0410 | 819.2000 | 51.9% |
 * | 16777216 | 0.5571 | 240.9412 | 0.6789 | 197.6953 | 121.9% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![sscal-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/sscal/gbps-default.svg)
 *
 * ![sscal-default ms chart](../../../assets/benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/sscal/ms-default.svg)
 *
 * ## See also
 *
 * - [sscal.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sscal/wgblas/sscal.js) — WebGPU benchmark script
 * - [sscal.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sscal/cuda/sscal.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/sscal
 */
