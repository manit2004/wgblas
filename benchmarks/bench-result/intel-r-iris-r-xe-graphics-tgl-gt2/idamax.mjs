/**
 * Benchmark results for idamax on Intel R Iris R Xe Graphics Tgl Gt2.
 *
 * ## Intel R Iris R Xe Graphics Tgl Gt2
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.1966 | 0.0013 |
 * | 64 | 0.2621 | 0.0020 |
 * | 128 | 0.2621 | 0.0039 |
 * | 512 | 0.1966 | 0.0208 |
 * | 1024 | 0.1966 | 0.0417 |
 * | 4096 | 0.1966 | 0.1667 |
 * | 16384 | 0.3277 | 0.4000 |
 * | 65536 | 0.3277 | 1.6000 |
 * | 262144 | 0.4588 | 4.5714 |
 * | 1048576 | 1.1141 | 7.5294 |
 * | 4194304 | 3.1457 | 10.6667 |
 * | 16777216 | 13.4349 | 9.9902 |
 *
 * ![idamax-default GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/idamax/gbps-default.svg)
 *
 * ![idamax-default ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/idamax/ms-default.svg)
 *
 * ## See also
 *
 * - [idamax.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/idamax/wgblas/idamax.js) — WebGPU benchmark script
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
 * | 32 | 0.2621 | 0.0010 |
 * | 64 | 0.2949 | 0.0017 |
 * | 128 | 0.2621 | 0.0039 |
 * | 512 | 0.2621 | 0.0156 |
 * | 1024 | 0.3277 | 0.0250 |
 * | 4096 | 0.2621 | 0.1250 |
 * | 16384 | 0.3277 | 0.4000 |
 * | 65536 | 0.4588 | 1.1429 |
 * | 262144 | 0.9830 | 2.1333 |
 * | 1048576 | 2.2938 | 3.6571 |
 * | 4194304 | 7.5366 | 4.4522 |
 *
 * ![idamax-stride4 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/idamax/gbps-stride4.svg)
 *
 * ![idamax-stride4 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/idamax/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 5</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.1966 | 0.0013 |
 * | 64 | 0.2621 | 0.0020 |
 * | 128 | 0.2621 | 0.0039 |
 * | 512 | 0.2621 | 0.0156 |
 * | 1024 | 0.2621 | 0.0313 |
 * | 4096 | 0.2621 | 0.1250 |
 * | 16384 | 0.3277 | 0.4000 |
 * | 65536 | 0.4588 | 1.1429 |
 * | 262144 | 1.1796 | 1.7778 |
 * | 1048576 | 2.3593 | 3.5556 |
 *
 * ![idamax-stride5 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/idamax/gbps-stride5.svg)
 *
 * ![idamax-stride5 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/idamax/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 32</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.2621 | 0.0010 |
 * | 64 | 0.2621 | 0.0020 |
 * | 128 | 0.2621 | 0.0039 |
 * | 512 | 0.3277 | 0.0125 |
 * | 1024 | 0.3277 | 0.0250 |
 * | 4096 | 0.3277 | 0.1000 |
 * | 16384 | 0.4588 | 0.2857 |
 * | 65536 | 0.9830 | 0.5333 |
 * | 262144 | 1.6384 | 1.2800 |
 *
 * ![idamax-stride32 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/idamax/gbps-stride32.svg)
 *
 * ![idamax-stride32 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/idamax/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 33</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.2621 | 0.0020 |
 * | 128 | 0.2621 | 0.0039 |
 * | 512 | 0.2621 | 0.0156 |
 * | 1024 | 0.2621 | 0.0313 |
 * | 4096 | 0.3277 | 0.1000 |
 * | 16384 | 0.4588 | 0.2857 |
 * | 65536 | 0.9830 | 0.5333 |
 * | 262144 | 1.5729 | 1.3333 |
 *
 * ![idamax-stride33 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/idamax/gbps-stride33.svg)
 *
 * ![idamax-stride33 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/idamax/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 255</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 512 | 0.1966 | 0.0208 |
 * | 1024 | 0.2621 | 0.0313 |
 * | 4096 | 0.3277 | 0.1000 |
 * | 16384 | 0.5243 | 0.2500 |
 * | 65536 | 0.8520 | 0.6154 |
 *
 * ![idamax-stride255 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/idamax/gbps-stride255.svg)
 *
 * ![idamax-stride255 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/idamax/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 256</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 512 | 0.1311 | 0.0313 |
 * | 1024 | 0.1966 | 0.0417 |
 * | 4096 | 0.2621 | 0.1250 |
 * | 16384 | 0.1966 | 0.6667 |
 * | 65536 | 0.9830 | 0.5333 |
 *
 * ![idamax-stride256 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/idamax/gbps-stride256.svg)
 *
 * ![idamax-stride256 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/idamax/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.idamax.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/idamax/wgblas/stride.idamax.js) — WebGPU stride-sweep benchmark script
 *
 * @module benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/idamax
 */
