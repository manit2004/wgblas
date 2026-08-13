/**
 * Benchmark results for saxpy on Intel R Iris R Xe Graphics Tgl Gt2.
 *
 * ## Intel R Iris R Xe Graphics Tgl Gt2
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
 * | 65536 | 0.1311 | 6.0000 |
 * | 262144 | 0.3932 | 8.0000 |
 * | 1048576 | 1.3763 | 9.1429 |
 * | 4194304 | 2.4576 | 20.4800 |
 * | 16777216 | 10.4202 | 19.3208 |
 *
 * ![saxpy-default GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/saxpy/gbps-default.svg)
 *
 * ![saxpy-default ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/saxpy/ms-default.svg)
 *
 * ## See also
 *
 * - [saxpy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/saxpy/wgblas/saxpy.js) — WebGPU benchmark script
 *
 * @module benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/saxpy
 */
