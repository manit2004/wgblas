/**
 * Benchmark results for sdot on Nvidia Geforce Rtx 4060 Laptop Gpu.
 *
 * ## Nvidia Geforce Rtx 4060 Laptop Gpu — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0154 | 0.0167 | 0.0143 | 0.0179 | 93.1% |
 * | 64 | 0.0164 | 0.0313 | 0.0143 | 0.0358 | 87.3% |
 * | 128 | 0.0174 | 0.0588 | 0.0143 | 0.0716 | 82.2% |
 * | 512 | 0.0174 | 0.2353 | 0.0138 | 0.2970 | 79.2% |
 * | 1024 | 0.0174 | 0.4706 | 0.0132 | 0.6229 | 75.5% |
 * | 4096 | 0.0184 | 1.7778 | 0.0152 | 2.1603 | 82.3% |
 * | 16384 | 0.0164 | 8.0000 | 0.0138 | 9.4815 | 84.4% |
 * | 65536 | 0.0154 | 34.1333 | 0.0154 | 34.1333 | 100.0% |
 * | 262144 | 0.0174 | 120.4706 | 0.0232 | 90.2700 | 133.5% |
 * | 1048576 | 0.0225 | 372.3636 | 0.0241 | 348.5957 | 106.8% |
 * | 4194304 | 0.0543 | 618.2642 | 0.0411 | 815.6950 | 75.8% |
 * | 16777216 | 0.6318 | 212.4344 | 0.5581 | 240.4715 | 88.3% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![sdot-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/sdot/gbps-default.svg)
 *
 * ![sdot-default ms chart](../../../assets/benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/sdot/ms-default.svg)
 *
 * ## See also
 *
 * - [sdot.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sdot/wgblas/sdot.js) — WebGPU benchmark script
 * - [sdot.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sdot/cuda/sdot.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/sdot
 */
