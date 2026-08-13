/**
 * Benchmark results for saxpy on Amd Radeon 780M Graphics Radv Phoenix.
 *
 * ## Amd Radeon 780M Graphics Radv Phoenix
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0655 | 0.0059 |
 * | 64 | 0.0655 | 0.0117 |
 * | 128 | 0.0655 | 0.0234 |
 * | 512 | 0.0655 | 0.0938 |
 * | 1024 | 0.0655 | 0.1875 |
 * | 4096 | 0.0655 | 0.7500 |
 * | 16384 | 0.0655 | 3.0000 |
 * | 65536 | 0.0655 | 12.0000 |
 * | 262144 | 0.0655 | 48.0000 |
 * | 1048576 | 0.1966 | 64.0000 |
 * | 4194304 | 0.7864 | 64.0000 |
 * | 16777216 | 3.2768 | 61.4400 |
 *
 * ![saxpy-default GB/s chart](../../../assets/benchmarks/amd-radeon-780m-graphics-radv-phoenix/saxpy/gbps-default.svg)
 *
 * ![saxpy-default ms chart](../../../assets/benchmarks/amd-radeon-780m-graphics-radv-phoenix/saxpy/ms-default.svg)
 *
 * ## See also
 *
 * - [saxpy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/saxpy/wgblas/saxpy.js) — WebGPU benchmark script
 *
 * @module benchmarks/amd-radeon-780m-graphics-radv-phoenix/saxpy
 */
