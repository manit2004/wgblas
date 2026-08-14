/**
 * Benchmark results for sgemv on Intel R Iris R Xe Graphics Tgl Gt2.
 *
 * ## Intel R Iris R Xe Graphics Tgl Gt2
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0655 | 0.0684 |
 * | 64 | 0.0655 | 0.2617 |
 * | 128 | 0.1311 | 0.5117 |
 * | 256 | 0.1311 | 2.0234 |
 * | 512 | 0.2621 | 4.0234 |
 * | 1024 | 0.5898 | 7.1319 |
 * | 1280 | 0.9175 | 7.1596 |
 * | 2048 | 1.9005 | 8.8405 |
 * | 4096 | 5.5706 | 12.0559 |
 *
 * ![sgemv-default GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sgemv/gbps-default.svg)
 *
 * ![sgemv-default ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sgemv/ms-default.svg)
 *
 * ## See also
 *
 * - [sgemv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemv/wgblas/sgemv.js) — WebGPU benchmark script
 *
 * @module benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sgemv
 */
