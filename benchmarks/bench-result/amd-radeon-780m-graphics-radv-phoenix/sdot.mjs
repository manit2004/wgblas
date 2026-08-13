/**
 * Benchmark results for sdot on Amd Radeon 780M Graphics Radv Phoenix.
 *
 * ## Amd Radeon 780M Graphics Radv Phoenix
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0655 | 0.0039 |
 * | 64 | 0.0655 | 0.0078 |
 * | 128 | 0.0655 | 0.0156 |
 * | 512 | 0.0655 | 0.0625 |
 * | 1024 | 0.0655 | 0.1250 |
 * | 4096 | 0.0655 | 0.5000 |
 * | 16384 | 0.0655 | 2.0000 |
 * | 65536 | 0.0655 | 8.0000 |
 * | 262144 | 0.0655 | 32.0000 |
 * | 1048576 | 0.1311 | 64.0000 |
 * | 4194304 | 0.4588 | 73.1429 |
 * | 16777216 | 1.9661 | 68.2667 |
 *
 * ![sdot-default GB/s chart](../../../assets/benchmarks/amd-radeon-780m-graphics-radv-phoenix/sdot/gbps-default.svg)
 *
 * ![sdot-default ms chart](../../../assets/benchmarks/amd-radeon-780m-graphics-radv-phoenix/sdot/ms-default.svg)
 *
 * ## See also
 *
 * - [sdot.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sdot/wgblas/sdot.js) — WebGPU benchmark script
 *
 * @module benchmarks/amd-radeon-780m-graphics-radv-phoenix/sdot
 */
