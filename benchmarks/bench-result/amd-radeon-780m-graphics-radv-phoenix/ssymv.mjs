/**
 * Benchmark results for ssymv on Amd Radeon 780M Graphics Radv Phoenix.
 *
 * ## Amd Radeon 780M Graphics Radv Phoenix
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0655 | 0.0381 |
 * | 64 | 0.0655 | 0.1387 |
 * | 128 | 0.0655 | 0.5273 |
 * | 256 | 0.0655 | 2.0547 |
 * | 512 | 0.0655 | 8.1094 |
 * | 1024 | 0.1311 | 16.1094 |
 * | 1280 | 0.1966 | 16.7578 |
 * | 2048 | 0.7209 | 11.6761 |
 * | 4096 | 3.8011 | 8.8427 |
 *
 * ![ssymv-default GB/s chart](../../../assets/benchmarks/amd-radeon-780m-graphics-radv-phoenix/ssymv/gbps-default.svg)
 *
 * ![ssymv-default ms chart](../../../assets/benchmarks/amd-radeon-780m-graphics-radv-phoenix/ssymv/ms-default.svg)
 *
 * ## See also
 *
 * - [ssymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/wgblas/ssymv.js) — WebGPU benchmark script
 *
 * @module benchmarks/amd-radeon-780m-graphics-radv-phoenix/ssymv
 */
