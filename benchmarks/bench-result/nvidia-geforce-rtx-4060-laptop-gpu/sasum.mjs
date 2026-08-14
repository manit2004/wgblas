/**
 * Benchmark results for sasum on Nvidia Geforce Rtx 4060 Laptop Gpu.
 *
 * ## Nvidia Geforce Rtx 4060 Laptop Gpu — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0154 | 0.0083 | 0.0144 | 0.0089 | 93.6% |
 * | 64 | 0.0174 | 0.0147 | 0.0144 | 0.0178 | 82.6% |
 * | 128 | 0.0184 | 0.0278 | 0.0142 | 0.0361 | 76.9% |
 * | 512 | 0.0174 | 0.1176 | 0.0144 | 0.1427 | 82.4% |
 * | 1024 | 0.0174 | 0.2353 | 0.0142 | 0.2876 | 81.8% |
 * | 4096 | 0.0174 | 0.9412 | 0.0169 | 0.9679 | 97.2% |
 * | 16384 | 0.0184 | 3.5556 | 0.0160 | 4.1083 | 86.5% |
 * | 65536 | 0.0184 | 14.2222 | 0.0141 | 18.5760 | 76.6% |
 * | 262144 | 0.0205 | 51.2000 | 0.0216 | 48.6533 | 105.2% |
 * | 1048576 | 0.0241 | 174.2979 | 0.0240 | 174.6462 | 99.8% |
 * | 4194304 | 0.0369 | 455.1111 | 0.0338 | 496.4848 | 91.7% |
 * | 16777216 | 0.3338 | 201.0307 | 0.3303 | 203.1533 | 99.0% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![sasum-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/sasum/gbps-default.svg)
 *
 * ![sasum-default ms chart](../../../assets/benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/sasum/ms-default.svg)
 *
 * ## See also
 *
 * - [sasum.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sasum/wgblas/sasum.js) — WebGPU benchmark script
 * - [sasum.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sasum/cuda/sasum.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/sasum
 */
