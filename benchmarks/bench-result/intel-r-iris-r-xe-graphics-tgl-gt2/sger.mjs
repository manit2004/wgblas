/**
 * Benchmark results for sger on Intel R Iris R Xe Graphics Tgl Gt2.
 *
 * ## Intel R Iris R Xe Graphics Tgl Gt2
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0655 | 0.1289 |
 * | 64 | 0.0655 | 0.5078 |
 * | 128 | 0.0655 | 2.0156 |
 * | 256 | 0.1311 | 4.0156 |
 * | 512 | 0.2621 | 8.0156 |
 * | 1024 | 0.7864 | 10.6771 |
 * | 1280 | 1.3763 | 9.5312 |
 * | 2048 | 2.0316 | 16.5242 |
 * | 4096 | 9.9615 | 13.4770 |
 *
 * ![sger-default GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sger/gbps-default.svg)
 *
 * ![sger-default ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sger/ms-default.svg)
 *
 * ## See also
 *
 * - [sger.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sger/wgblas/sger.js) — WebGPU benchmark script
 *
 * @module benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sger
 */
