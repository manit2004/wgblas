/**
 * Benchmark results for srot on Amd Radeon 780M Graphics Radv Phoenix.
 *
 * ## Amd Radeon 780M Graphics Radv Phoenix
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0655 | 0.0078 |
 * | 64 | 0.0655 | 0.0156 |
 * | 128 | 0.0655 | 0.0313 |
 * | 512 | 0.0655 | 0.1250 |
 * | 1024 | 0.0655 | 0.2500 |
 * | 4096 | 0.0655 | 1.0000 |
 * | 16384 | 0.0655 | 4.0000 |
 * | 65536 | 0.0655 | 16.0000 |
 * | 262144 | 0.0655 | 64.0000 |
 * | 1048576 | 0.5243 | 32.0000 |
 * | 4194304 | 1.3107 | 51.2000 |
 * | 16777216 | 5.1118 | 52.5128 |
 *
 * ![srot-default GB/s chart](../../../assets/benchmarks/amd-radeon-780m-graphics-radv-phoenix/srot/gbps-default.svg)
 *
 * ![srot-default ms chart](../../../assets/benchmarks/amd-radeon-780m-graphics-radv-phoenix/srot/ms-default.svg)
 *
 * ## See also
 *
 * - [srot.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/srot/wgblas/srot.js) — WebGPU benchmark script
 *
 * @module benchmarks/amd-radeon-780m-graphics-radv-phoenix/srot
 */
