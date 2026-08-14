/**
 * Benchmark results for ssyr2 on Intel R Iris R Xe Graphics Tgl Gt2.
 *
 * ## Intel R Iris R Xe Graphics Tgl Gt2
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0655 | 0.0684 |
 * | 64 | 0.0655 | 0.2617 |
 * | 128 | 0.0655 | 1.0234 |
 * | 256 | 0.1311 | 2.0234 |
 * | 512 | 0.1966 | 5.3646 |
 * | 1024 | 0.5243 | 8.0234 |
 * | 1280 | 0.7864 | 8.3529 |
 * | 2048 | 2.0972 | 8.0117 |
 * | 4096 | 4.4564 | 15.0699 |
 *
 * ![ssyr2-default GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/ssyr2/gbps-default.svg)
 *
 * ![ssyr2-default ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/ssyr2/ms-default.svg)
 *
 * ## See also
 *
 * - [ssyr2.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2/wgblas/ssyr2.js) — WebGPU benchmark script
 *
 * @module benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/ssyr2
 */
