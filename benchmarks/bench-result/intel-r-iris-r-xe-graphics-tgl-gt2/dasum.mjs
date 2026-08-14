/**
 * Benchmark results for dasum on Intel R Iris R Xe Graphics Tgl Gt2.
 *
 * ## Intel R Iris R Xe Graphics Tgl Gt2
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.1311 | 0.0020 |
 * | 64 | 0.3932 | 0.0013 |
 * | 128 | 0.3277 | 0.0031 |
 * | 512 | 0.3277 | 0.0125 |
 * | 1024 | 0.1966 | 0.0417 |
 * | 4096 | 0.3932 | 0.0833 |
 * | 16384 | 0.3932 | 0.3333 |
 * | 65536 | 0.5243 | 1.0000 |
 * | 262144 | 0.7537 | 2.7826 |
 * | 1048576 | 1.2452 | 6.7368 |
 * | 4194304 | 2.6214 | 12.8000 |
 * | 16777216 | 10.7807 | 12.4498 |
 *
 * ![dasum-default GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/dasum/gbps-default.svg)
 *
 * ![dasum-default ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/dasum/ms-default.svg)
 *
 * ## See also
 *
 * - [dasum.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dasum/wgblas/dasum.js) — WebGPU benchmark script
 *
 * @module benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/dasum
 */
