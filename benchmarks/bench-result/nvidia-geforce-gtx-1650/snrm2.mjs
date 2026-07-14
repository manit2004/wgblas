/**
 * Benchmark results for snrm2 on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0190 | 0.0067 | 0.0181 | 0.0071 | 94.7% |
 * | 64 | 0.0192 | 0.0133 | 0.0182 | 0.0141 | 94.6% |
 * | 128 | 0.0185 | 0.0277 | 0.0181 | 0.0283 | 97.9% |
 * | 512 | 0.0189 | 0.1086 | 0.0180 | 0.1136 | 95.6% |
 * | 1024 | 0.0189 | 0.2166 | 0.0180 | 0.2282 | 94.9% |
 * | 4096 | 0.0190 | 0.8641 | 0.0181 | 0.9030 | 95.7% |
 * | 16384 | 0.0198 | 3.3112 | 0.0181 | 3.6248 | 91.3% |
 * | 65536 | 0.0200 | 13.0758 | 0.0181 | 14.4480 | 90.5% |
 * | 262144 | 0.0259 | 40.4294 | 0.0190 | 55.2580 | 73.2% |
 * | 1048576 | 0.0451 | 93.0909 | 0.0449 | 93.4560 | 99.6% |
 * | 4194304 | 0.1154 | 145.3731 | 0.1430 | 117.3560 | 123.9% |
 * | 16777216 | 0.4040 | 166.0913 | 0.5895 | 113.8488 | 145.9% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. Higher means wgblas is closer to cuBLAS throughput.
 *
 * ## See also
 *
 * - [benchmark.snrm2.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/snrm2/benchmark.snrm2.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/snrm2/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/snrm2
 */
