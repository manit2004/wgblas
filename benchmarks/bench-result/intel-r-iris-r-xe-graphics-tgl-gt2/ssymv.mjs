/**
 * Benchmark results for ssymv on Intel R Iris R Xe Graphics Tgl Gt2.
 *
 * ## Intel R Iris R Xe Graphics Tgl Gt2
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.1311 | 0.0190 |
 * | 64 | 0.1311 | 0.0693 |
 * | 128 | 0.1966 | 0.1758 |
 * | 256 | 0.2621 | 0.5137 |
 * | 512 | 0.3932 | 1.3516 |
 * | 1024 | 1.4418 | 1.4645 |
 * | 1280 | 1.1141 | 2.9573 |
 * | 2048 | 1.5729 | 5.3516 |
 * | 4096 | 5.8327 | 5.7626 |
 *
 * ![ssymv-default GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/ssymv/gbps-default.svg)
 *
 * ![ssymv-default ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/ssymv/ms-default.svg)
 *
 * ## See also
 *
 * - [ssymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/wgblas/ssymv.js) — WebGPU benchmark script
 *
 * @module benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/ssymv
 */
