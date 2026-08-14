/**
 * Benchmark results for sswap on Intel R Iris R Xe Graphics Tgl Gt2.
 *
 * ## Intel R Iris R Xe Graphics Tgl Gt2
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
 * | 65536 | 0.1311 | 8.0000 |
 * | 262144 | 0.3932 | 10.6667 |
 * | 1048576 | 1.7695 | 9.4815 |
 * | 4194304 | 3.3423 | 20.0784 |
 * | 16777216 | 14.6145 | 18.3677 |
 *
 * ![sswap-default GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sswap/gbps-default.svg)
 *
 * ![sswap-default ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sswap/ms-default.svg)
 *
 * ## See also
 *
 * - [sswap.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sswap/wgblas/sswap.js) — WebGPU benchmark script
 *
 * @module benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sswap
 */
