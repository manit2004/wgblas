/**
 * Benchmark results for sgemv on Amd Radeon 780M Graphics Radv Phoenix.
 *
 * ## Amd Radeon 780M Graphics Radv Phoenix
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0655 | 0.0684 |
 * | 64 | 0.0655 | 0.2617 |
 * | 128 | 0.0655 | 1.0234 |
 * | 256 | 0.0655 | 4.0469 |
 * | 512 | 0.0655 | 16.0938 |
 * | 1024 | 0.0655 | 64.1875 |
 * | 1280 | 0.0655 | 100.2344 |
 * | 2048 | 0.2621 | 64.0938 |
 * | 4096 | 0.9830 | 68.3167 |
 *
 * ![sgemv-default GB/s chart](../../../assets/benchmarks/amd-radeon-780m-graphics-radv-phoenix/sgemv/gbps-default.svg)
 *
 * ![sgemv-default ms chart](../../../assets/benchmarks/amd-radeon-780m-graphics-radv-phoenix/sgemv/ms-default.svg)
 *
 * ## See also
 *
 * - [sgemv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemv/wgblas/sgemv.js) — WebGPU benchmark script
 *
 * @module benchmarks/amd-radeon-780m-graphics-radv-phoenix/sgemv
 */
