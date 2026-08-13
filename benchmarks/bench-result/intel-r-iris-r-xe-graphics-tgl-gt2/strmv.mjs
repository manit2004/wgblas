/**
 * Benchmark results for strmv on Intel R Iris R Xe Graphics Tgl Gt2.
 *
 * ## Intel R Iris R Xe Graphics Tgl Gt2
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0655 | 0.0361 |
 * | 64 | 0.0655 | 0.1348 |
 * | 128 | 0.1311 | 0.2598 |
 * | 256 | 0.1311 | 1.0195 |
 * | 512 | 0.0655 | 8.0781 |
 * | 1024 | 0.5898 | 3.5729 |
 * | 1280 | 0.7209 | 4.5632 |
 * | 2048 | 1.4418 | 5.8324 |
 * | 4096 | 3.2113 | 10.4617 |
 *
 * ![strmv-default GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/strmv/gbps-default.svg)
 *
 * ![strmv-default ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/strmv/ms-default.svg)
 *
 * ## See also
 *
 * - [strmv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmv/wgblas/strmv.js) — WebGPU benchmark script
 *
 * @module benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/strmv
 */
