/**
 * Benchmark results for strmv on Amd Radeon 780M Graphics Radv Phoenix.
 *
 * ## Amd Radeon 780M Graphics Radv Phoenix
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0655 | 0.0361 |
 * | 64 | 0.0655 | 0.1348 |
 * | 128 | 0.0655 | 0.5195 |
 * | 256 | 0.0655 | 2.0391 |
 * | 512 | 0.0655 | 8.0781 |
 * | 1024 | 0.0655 | 32.1563 |
 * | 1280 | 0.0655 | 50.1953 |
 * | 2048 | 0.1311 | 64.1563 |
 * | 4096 | 0.5898 | 56.9583 |
 *
 * ![strmv-default GB/s chart](../../../assets/benchmarks/amd-radeon-780m-graphics-radv-phoenix/strmv/gbps-default.svg)
 *
 * ![strmv-default ms chart](../../../assets/benchmarks/amd-radeon-780m-graphics-radv-phoenix/strmv/ms-default.svg)
 *
 * ## See also
 *
 * - [strmv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmv/wgblas/strmv.js) — WebGPU benchmark script
 *
 * @module benchmarks/amd-radeon-780m-graphics-radv-phoenix/strmv
 */
