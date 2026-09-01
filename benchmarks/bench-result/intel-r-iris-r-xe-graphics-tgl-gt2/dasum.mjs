/**
 * Benchmark results for dasum on Intel R Iris R Xe Graphics Tgl Gt2.
 *
 * ## Intel R Iris R Xe Graphics Tgl Gt2
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.3932 | 0.0007 |
 * | 64 | 0.3932 | 0.0013 |
 * | 128 | 0.3932 | 0.0026 |
 * | 512 | 0.3932 | 0.0104 |
 * | 1024 | 0.3932 | 0.0208 |
 * | 4096 | 0.3932 | 0.0833 |
 * | 16384 | 0.3932 | 0.3333 |
 * | 65536 | 0.5243 | 1.0000 |
 * | 262144 | 0.9175 | 2.2857 |
 * | 1048576 | 1.5729 | 5.3333 |
 * | 4194304 | 2.6214 | 12.8000 |
 * | 16777216 | 9.9615 | 13.4737 |
 *
 * ![dasum-default GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/dasum/gbps-default.svg)
 *
 * ![dasum-default ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/dasum/ms-default.svg)
 *
 * ## See also
 *
 * - [dasum.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dasum/wgblas/dasum.js) — WebGPU benchmark script
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
 * | 32 | 0.3932 | 0.0007 |
 * | 64 | 0.3932 | 0.0013 |
 * | 128 | 0.3932 | 0.0026 |
 * | 512 | 0.3932 | 0.0104 |
 * | 1024 | 0.3932 | 0.0208 |
 * | 4096 | 0.3932 | 0.0833 |
 * | 16384 | 0.4588 | 0.2857 |
 * | 65536 | 0.5898 | 0.8889 |
 * | 262144 | 1.3107 | 1.6000 |
 * | 1048576 | 1.8350 | 4.5714 |
 * | 4194304 | 7.0779 | 4.7407 |
 *
 * ![dasum-stride4 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/dasum/gbps-stride4.svg)
 *
 * ![dasum-stride4 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/dasum/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 5</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.3932 | 0.0007 |
 * | 64 | 0.3932 | 0.0013 |
 * | 128 | 0.3932 | 0.0026 |
 * | 512 | 0.3932 | 0.0104 |
 * | 1024 | 0.3932 | 0.0208 |
 * | 4096 | 0.3932 | 0.0833 |
 * | 16384 | 0.4588 | 0.2857 |
 * | 65536 | 0.6554 | 0.8000 |
 * | 262144 | 1.5073 | 1.3913 |
 * | 1048576 | 2.2938 | 3.6571 |
 *
 * ![dasum-stride5 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/dasum/gbps-stride5.svg)
 *
 * ![dasum-stride5 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/dasum/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 32</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.3932 | 0.0007 |
 * | 64 | 0.3932 | 0.0013 |
 * | 128 | 0.3932 | 0.0026 |
 * | 512 | 0.3932 | 0.0104 |
 * | 1024 | 0.3932 | 0.0208 |
 * | 4096 | 0.3932 | 0.0833 |
 * | 16384 | 0.5898 | 0.2222 |
 * | 65536 | 1.1796 | 0.4444 |
 * | 262144 | 1.7039 | 1.2308 |
 *
 * ![dasum-stride32 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/dasum/gbps-stride32.svg)
 *
 * ![dasum-stride32 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/dasum/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 33</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.3932 | 0.0013 |
 * | 128 | 0.3932 | 0.0026 |
 * | 512 | 0.3932 | 0.0104 |
 * | 1024 | 0.3932 | 0.0208 |
 * | 4096 | 0.4588 | 0.0714 |
 * | 16384 | 0.5898 | 0.2222 |
 * | 65536 | 1.1796 | 0.4444 |
 * | 262144 | 1.7695 | 1.1852 |
 *
 * ![dasum-stride33 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/dasum/gbps-stride33.svg)
 *
 * ![dasum-stride33 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/dasum/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 255</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 512 | 0.3277 | 0.0125 |
 * | 1024 | 0.3932 | 0.0208 |
 * | 4096 | 0.4588 | 0.0714 |
 * | 16384 | 0.5898 | 0.2222 |
 * | 65536 | 1.3763 | 0.3810 |
 *
 * ![dasum-stride255 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/dasum/gbps-stride255.svg)
 *
 * ![dasum-stride255 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/dasum/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 256</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 512 | 0.3932 | 0.0104 |
 * | 1024 | 0.3932 | 0.0208 |
 * | 4096 | 0.4588 | 0.0714 |
 * | 16384 | 0.1966 | 0.6667 |
 * | 65536 | 0.6554 | 0.8000 |
 *
 * ![dasum-stride256 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/dasum/gbps-stride256.svg)
 *
 * ![dasum-stride256 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/dasum/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.dasum.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dasum/wgblas/stride.dasum.js) — WebGPU stride-sweep benchmark script
 *
 * @module benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/dasum
 */
