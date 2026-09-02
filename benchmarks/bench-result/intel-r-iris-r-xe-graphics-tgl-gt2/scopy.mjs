/**
 * Benchmark results for scopy on Intel R Iris R Xe Graphics Tgl Gt2.
 *
 * ## Intel R Iris R Xe Graphics Tgl Gt2
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0655 | 0.0039 |
 * | 64 | 0.0655 | 0.0078 |
 * | 128 | 0.0655 | 0.0156 |
 * | 512 | 0.0655 | 0.0625 |
 * | 1024 | 0.0655 | 0.1250 |
 * | 4096 | 0.0655 | 0.5000 |
 * | 16384 | 0.0655 | 2.0000 |
 * | 65536 | 0.1311 | 4.0000 |
 * | 262144 | 0.3277 | 6.4000 |
 * | 1048576 | 1.2452 | 6.7368 |
 * | 4194304 | 3.2113 | 10.4490 |
 * | 16777216 | 6.8813 | 19.5048 |
 *
 * ![scopy-default GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/scopy/gbps-default.svg)
 *
 * ![scopy-default ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/scopy/ms-default.svg)
 *
 * ## See also
 *
 * - [scopy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/scopy/wgblas/scopy.js) — WebGPU benchmark script
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
 * | 32 | 0.0655 | 0.0039 |
 * | 64 | 0.0655 | 0.0078 |
 * | 128 | 0.0655 | 0.0156 |
 * | 512 | 0.0655 | 0.0625 |
 * | 1024 | 0.0655 | 0.1250 |
 * | 4096 | 0.0655 | 0.5000 |
 * | 16384 | 0.0655 | 2.0000 |
 * | 65536 | 0.2621 | 2.0000 |
 * | 262144 | 1.0486 | 2.0000 |
 * | 1048576 | 2.3593 | 3.5556 |
 * | 4194304 | 10.0270 | 3.3464 |
 *
 * ![scopy-stride4 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/scopy/gbps-stride4.svg)
 *
 * ![scopy-stride4 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/scopy/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 5</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0655 | 0.0039 |
 * | 64 | 0.0655 | 0.0078 |
 * | 128 | 0.0655 | 0.0156 |
 * | 512 | 0.0655 | 0.0625 |
 * | 1024 | 0.0655 | 0.1250 |
 * | 4096 | 0.0655 | 0.5000 |
 * | 16384 | 0.0655 | 2.0000 |
 * | 65536 | 0.2621 | 2.0000 |
 * | 262144 | 1.3107 | 1.6000 |
 * | 1048576 | 3.0147 | 2.7826 |
 * | 4194304 | 12.7795 | 2.6256 |
 *
 * ![scopy-stride5 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/scopy/gbps-stride5.svg)
 *
 * ![scopy-stride5 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/scopy/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 32</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0655 | 0.0039 |
 * | 64 | 0.0655 | 0.0078 |
 * | 128 | 0.0655 | 0.0156 |
 * | 512 | 0.0655 | 0.0625 |
 * | 1024 | 0.0655 | 0.1250 |
 * | 4096 | 0.0655 | 0.5000 |
 * | 16384 | 0.1966 | 0.6667 |
 * | 65536 | 0.9830 | 0.5333 |
 * | 262144 | 2.4248 | 0.8649 |
 * | 1048576 | 10.0925 | 0.8312 |
 *
 * ![scopy-stride32 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/scopy/gbps-stride32.svg)
 *
 * ![scopy-stride32 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/scopy/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 33</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0655 | 0.0078 |
 * | 128 | 0.0655 | 0.0156 |
 * | 512 | 0.0655 | 0.0625 |
 * | 1024 | 0.0655 | 0.1250 |
 * | 4096 | 0.0655 | 0.5000 |
 * | 16384 | 0.1966 | 0.6667 |
 * | 65536 | 0.9830 | 0.5333 |
 * | 262144 | 2.4248 | 0.8649 |
 *
 * ![scopy-stride33 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/scopy/gbps-stride33.svg)
 *
 * ![scopy-stride33 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/scopy/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 255</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 512 | 0.0655 | 0.0625 |
 * | 1024 | 0.0655 | 0.1250 |
 * | 4096 | 0.0655 | 0.5000 |
 * | 16384 | 0.2621 | 0.5000 |
 * | 65536 | 1.0486 | 0.5000 |
 *
 * ![scopy-stride255 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/scopy/gbps-stride255.svg)
 *
 * ![scopy-stride255 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/scopy/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 256</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 512 | 0.0655 | 0.0625 |
 * | 1024 | 0.0655 | 0.1250 |
 * | 4096 | 0.0655 | 0.5000 |
 * | 16384 | 0.3277 | 0.4000 |
 * | 65536 | 0.8520 | 0.6154 |
 *
 * ![scopy-stride256 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/scopy/gbps-stride256.svg)
 *
 * ![scopy-stride256 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/scopy/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.scopy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/scopy/wgblas/stride.scopy.js) — WebGPU stride-sweep benchmark script
 *
 * @module benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/scopy
 */
