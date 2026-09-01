/**
 * Benchmark results for sdot on Intel R Iris R Xe Graphics Tgl Gt2.
 *
 * ## Intel R Iris R Xe Graphics Tgl Gt2
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.1966 | 0.0013 |
 * | 64 | 0.1966 | 0.0026 |
 * | 128 | 0.1966 | 0.0052 |
 * | 512 | 0.1966 | 0.0208 |
 * | 1024 | 0.1966 | 0.0417 |
 * | 4096 | 0.1966 | 0.1667 |
 * | 16384 | 0.1966 | 0.6667 |
 * | 65536 | 0.1966 | 2.6667 |
 * | 262144 | 0.3932 | 5.3333 |
 * | 1048576 | 1.0486 | 8.0000 |
 * | 4194304 | 3.0802 | 10.8936 |
 * | 16777216 | 12.5829 | 10.6667 |
 *
 * ![sdot-default GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sdot/gbps-default.svg)
 *
 * ![sdot-default ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sdot/ms-default.svg)
 *
 * ## See also
 *
 * - [sdot.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sdot/wgblas/sdot.js) — WebGPU benchmark script
 *
 * ## Stride sweep
 *
 * Unless noted otherwise, every result above uses unit stride (`incx = incy = 1`) — the normal case, and the coalesced, best-case GPU access pattern. Real usage sometimes passes a non-unit stride (e.g. operating on a row or column of a larger matrix, where `incx = lda`), which breaks memory coalescing and costs measurably more. This section sweeps a few representative strides to characterize that cost separately, collapsed below by default — expand a stride to see its table and chart.
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 4</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.1966 | 0.0013 |
 * | 64 | 0.1966 | 0.0026 |
 * | 128 | 0.1966 | 0.0052 |
 * | 512 | 0.1966 | 0.0208 |
 * | 1024 | 0.1966 | 0.0417 |
 * | 4096 | 0.1966 | 0.1667 |
 * | 16384 | 0.1966 | 0.6667 |
 * | 65536 | 0.3277 | 1.6000 |
 * | 262144 | 0.9175 | 2.2857 |
 * | 1048576 | 2.1627 | 3.8788 |
 * | 4194304 | 7.1434 | 4.6972 |
 *
 * ![sdot-stride4 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sdot/gbps-stride4.svg)
 *
 * ![sdot-stride4 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sdot/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 5</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.1966 | 0.0013 |
 * | 64 | 0.1966 | 0.0026 |
 * | 128 | 0.1966 | 0.0052 |
 * | 512 | 0.1966 | 0.0208 |
 * | 1024 | 0.1966 | 0.0417 |
 * | 4096 | 0.1966 | 0.1667 |
 * | 16384 | 0.2621 | 0.5000 |
 * | 65536 | 0.3932 | 1.3333 |
 * | 262144 | 1.1141 | 1.8824 |
 * | 1048576 | 2.2610 | 3.7101 |
 * | 4194304 | 9.7649 | 3.4362 |
 *
 * ![sdot-stride5 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sdot/gbps-stride5.svg)
 *
 * ![sdot-stride5 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sdot/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 32</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.1966 | 0.0013 |
 * | 64 | 0.1966 | 0.0026 |
 * | 128 | 0.1966 | 0.0052 |
 * | 512 | 0.1966 | 0.0208 |
 * | 1024 | 0.1966 | 0.0417 |
 * | 4096 | 0.1966 | 0.1667 |
 * | 16384 | 0.3277 | 0.4000 |
 * | 65536 | 0.9175 | 0.5714 |
 * | 262144 | 1.5073 | 1.3913 |
 * | 1048576 | 6.0293 | 1.3913 |
 *
 * ![sdot-stride32 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sdot/gbps-stride32.svg)
 *
 * ![sdot-stride32 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sdot/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 33</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.1966 | 0.0026 |
 * | 128 | 0.1966 | 0.0052 |
 * | 512 | 0.1966 | 0.0208 |
 * | 1024 | 0.1966 | 0.0417 |
 * | 4096 | 0.1966 | 0.1667 |
 * | 16384 | 0.3277 | 0.4000 |
 * | 65536 | 0.9175 | 0.5714 |
 * | 262144 | 1.5073 | 1.3913 |
 *
 * ![sdot-stride33 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sdot/gbps-stride33.svg)
 *
 * ![sdot-stride33 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sdot/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 255</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 512 | 0.1966 | 0.0208 |
 * | 1024 | 0.1966 | 0.0417 |
 * | 4096 | 0.1966 | 0.1667 |
 * | 16384 | 0.3932 | 0.3333 |
 * | 65536 | 1.1141 | 0.4706 |
 *
 * ![sdot-stride255 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sdot/gbps-stride255.svg)
 *
 * ![sdot-stride255 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sdot/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 256</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 512 | 0.1966 | 0.0208 |
 * | 1024 | 0.1966 | 0.0417 |
 * | 4096 | 0.1966 | 0.1667 |
 * | 16384 | 0.4588 | 0.2857 |
 * | 65536 | 1.4418 | 0.3636 |
 *
 * ![sdot-stride256 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sdot/gbps-stride256.svg)
 *
 * ![sdot-stride256 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sdot/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.sdot.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sdot/wgblas/stride.sdot.js) — WebGPU stride-sweep benchmark script
 *
 * @module benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sdot
 */
