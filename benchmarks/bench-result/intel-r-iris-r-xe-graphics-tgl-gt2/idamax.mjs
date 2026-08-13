/**
 * Benchmark results for idamax on Intel R Iris R Xe Graphics Tgl Gt2.
 *
 * ## Intel R Iris R Xe Graphics Tgl Gt2
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0655 | 0.0039 |
 * | 64 | 0.0655 | 0.0078 |
 * | 128 | 0.1311 | 0.0078 |
 * | 512 | 0.0655 | 0.0625 |
 * | 1024 | 0.1311 | 0.0625 |
 * | 4096 | 0.1311 | 0.2500 |
 * | 16384 | 0.1311 | 1.0000 |
 * | 65536 | 0.1311 | 4.0000 |
 * | 262144 | 0.1311 | 16.0000 |
 * | 1048576 | 0.6554 | 12.8000 |
 * | 4194304 | 3.3751 | 9.9417 |
 * | 16777216 | 15.5648 | 8.6232 |
 *
 * ![idamax-default GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/idamax/gbps-default.svg)
 *
 * ![idamax-default ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/idamax/ms-default.svg)
 *
 * ## See also
 *
 * - [idamax.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/idamax/wgblas/idamax.js) — WebGPU benchmark script
 *
 * @module benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/idamax
 */
