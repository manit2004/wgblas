/**
 * Benchmark results for isamax on Intel R Iris R Xe Graphics Tgl Gt2.
 *
 * ## Intel R Iris R Xe Graphics Tgl Gt2
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.2621 | 0.0005 |
 * | 64 | 0.1966 | 0.0013 |
 * | 128 | 0.1966 | 0.0026 |
 * | 512 | 0.0655 | 0.0313 |
 * | 1024 | 0.1966 | 0.0208 |
 * | 4096 | 0.1966 | 0.0833 |
 * | 16384 | 0.2621 | 0.2500 |
 * | 65536 | 0.0655 | 4.0000 |
 * | 262144 | 0.0655 | 16.0000 |
 * | 1048576 | 0.3604 | 11.6364 |
 * | 4194304 | 1.6384 | 10.2400 |
 * | 16777216 | 6.1604 | 10.8936 |
 *
 * ![isamax-default GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/isamax/gbps-default.svg)
 *
 * ![isamax-default ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/isamax/ms-default.svg)
 *
 * ## See also
 *
 * - [isamax.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/isamax/wgblas/isamax.js) — WebGPU benchmark script
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
 * | 32 | 0.2621 | 0.0005 |
 * | 64 | 0.1966 | 0.0013 |
 * | 128 | 0.1966 | 0.0026 |
 * | 512 | 0.2621 | 0.0078 |
 * | 1024 | 0.2294 | 0.0179 |
 * | 4096 | 0.2294 | 0.0714 |
 * | 16384 | 0.2621 | 0.2500 |
 * | 65536 | 0.3277 | 0.8000 |
 * | 262144 | 0.5898 | 1.7778 |
 * | 1048576 | 1.6384 | 2.5600 |
 * | 4194304 | 3.6045 | 4.6545 |
 *
 * ![isamax-stride4 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/isamax/gbps-stride4.svg)
 *
 * ![isamax-stride4 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/isamax/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 5</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.1966 | 0.0007 |
 * | 64 | 0.1966 | 0.0013 |
 * | 128 | 0.2621 | 0.0020 |
 * | 512 | 0.1966 | 0.0104 |
 * | 1024 | 0.2294 | 0.0179 |
 * | 4096 | 0.2621 | 0.0625 |
 * | 16384 | 0.2621 | 0.2500 |
 * | 65536 | 0.3277 | 0.8000 |
 * | 262144 | 0.6554 | 1.6000 |
 * | 1048576 | 1.2452 | 3.3684 |
 * | 4194304 | 4.8497 | 3.4595 |
 *
 * ![isamax-stride5 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/isamax/gbps-stride5.svg)
 *
 * ![isamax-stride5 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/isamax/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 32</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.1966 | 0.0007 |
 * | 64 | 0.1966 | 0.0013 |
 * | 128 | 0.1966 | 0.0026 |
 * | 512 | 0.2621 | 0.0078 |
 * | 1024 | 0.2621 | 0.0156 |
 * | 4096 | 0.2621 | 0.0625 |
 * | 16384 | 0.3277 | 0.2000 |
 * | 65536 | 0.5898 | 0.4444 |
 * | 262144 | 0.9175 | 1.1429 |
 * | 1048576 | 3.1457 | 1.3333 |
 *
 * ![isamax-stride32 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/isamax/gbps-stride32.svg)
 *
 * ![isamax-stride32 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/isamax/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 33</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.1311 | 0.0020 |
 * | 128 | 0.1966 | 0.0026 |
 * | 512 | 0.1966 | 0.0104 |
 * | 1024 | 0.2621 | 0.0156 |
 * | 4096 | 0.2621 | 0.0625 |
 * | 16384 | 0.3277 | 0.2000 |
 * | 65536 | 0.2621 | 1.0000 |
 * | 262144 | 0.8520 | 1.2308 |
 *
 * ![isamax-stride33 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/isamax/gbps-stride33.svg)
 *
 * ![isamax-stride33 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/isamax/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 255</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 512 | 0.0655 | 0.0313 |
 * | 1024 | 0.0655 | 0.0625 |
 * | 4096 | 0.1311 | 0.1250 |
 * | 16384 | 0.3277 | 0.2000 |
 * | 65536 | 0.7209 | 0.3636 |
 *
 * ![isamax-stride255 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/isamax/gbps-stride255.svg)
 *
 * ![isamax-stride255 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/isamax/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 256</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 512 | 0.1966 | 0.0104 |
 * | 1024 | 0.1966 | 0.0208 |
 * | 4096 | 0.2621 | 0.0625 |
 * | 16384 | 0.3932 | 0.1667 |
 * | 65536 | 0.8192 | 0.3200 |
 *
 * ![isamax-stride256 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/isamax/gbps-stride256.svg)
 *
 * ![isamax-stride256 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/isamax/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.isamax.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/isamax/wgblas/stride.isamax.js) — WebGPU stride-sweep benchmark script
 *
 * @module benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/isamax
 */
