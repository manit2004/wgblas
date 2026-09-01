/**
 * Benchmark results for sasum on Intel R Iris R Xe Graphics Tgl Gt2.
 *
 * ## Intel R Iris R Xe Graphics Tgl Gt2
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.1966 | 0.0007 |
 * | 64 | 0.1966 | 0.0013 |
 * | 128 | 0.1966 | 0.0026 |
 * | 512 | 0.1966 | 0.0104 |
 * | 1024 | 0.1966 | 0.0208 |
 * | 4096 | 0.1966 | 0.0833 |
 * | 16384 | 0.1966 | 0.3333 |
 * | 65536 | 0.1966 | 1.3333 |
 * | 262144 | 0.2621 | 4.0000 |
 * | 1048576 | 0.5898 | 7.1111 |
 * | 4194304 | 1.2452 | 13.4737 |
 * | 16777216 | 6.0293 | 11.1304 |
 *
 * ![sasum-default GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sasum/gbps-default.svg)
 *
 * ![sasum-default ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sasum/ms-default.svg)
 *
 * ## See also
 *
 * - [sasum.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sasum/wgblas/sasum.js) — WebGPU benchmark script
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
 * | 32 | 0.1966 | 0.0007 |
 * | 64 | 0.1966 | 0.0013 |
 * | 128 | 0.1966 | 0.0026 |
 * | 512 | 0.1966 | 0.0104 |
 * | 1024 | 0.1966 | 0.0208 |
 * | 4096 | 0.1966 | 0.0833 |
 * | 16384 | 0.1966 | 0.3333 |
 * | 65536 | 0.2621 | 1.0000 |
 * | 262144 | 0.5243 | 2.0000 |
 * | 1048576 | 1.6384 | 2.5600 |
 * | 4194304 | 3.9977 | 4.1967 |
 *
 * ![sasum-stride4 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sasum/gbps-stride4.svg)
 *
 * ![sasum-stride4 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sasum/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 5</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0655 | 0.0020 |
 * | 64 | 0.0655 | 0.0039 |
 * | 128 | 0.0655 | 0.0078 |
 * | 512 | 0.1311 | 0.0156 |
 * | 1024 | 0.1311 | 0.0313 |
 * | 4096 | 0.1966 | 0.0833 |
 * | 16384 | 0.1966 | 0.3333 |
 * | 65536 | 0.2621 | 1.0000 |
 * | 262144 | 0.5898 | 1.7778 |
 * | 1048576 | 1.1141 | 3.7647 |
 * | 4194304 | 4.8497 | 3.4595 |
 *
 * ![sasum-stride5 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sasum/gbps-stride5.svg)
 *
 * ![sasum-stride5 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sasum/ms-stride5.svg)
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
 * | 512 | 0.1966 | 0.0104 |
 * | 1024 | 0.1966 | 0.0208 |
 * | 4096 | 0.1966 | 0.0833 |
 * | 16384 | 0.2621 | 0.2500 |
 * | 65536 | 0.5243 | 0.5000 |
 * | 262144 | 0.9175 | 1.1429 |
 * | 1048576 | 3.0802 | 1.3617 |
 *
 * ![sasum-stride32 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sasum/gbps-stride32.svg)
 *
 * ![sasum-stride32 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sasum/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 33</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.1966 | 0.0013 |
 * | 128 | 0.1966 | 0.0026 |
 * | 512 | 0.1966 | 0.0104 |
 * | 1024 | 0.1966 | 0.0208 |
 * | 4096 | 0.1966 | 0.0833 |
 * | 16384 | 0.2621 | 0.2500 |
 * | 65536 | 0.5243 | 0.5000 |
 * | 262144 | 0.8192 | 1.2800 |
 *
 * ![sasum-stride33 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sasum/gbps-stride33.svg)
 *
 * ![sasum-stride33 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sasum/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 255</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 512 | 0.1311 | 0.0156 |
 * | 1024 | 0.1966 | 0.0208 |
 * | 4096 | 0.1966 | 0.0833 |
 * | 16384 | 0.3277 | 0.2000 |
 * | 65536 | 0.6554 | 0.4000 |
 *
 * ![sasum-stride255 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sasum/gbps-stride255.svg)
 *
 * ![sasum-stride255 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sasum/ms-stride255.svg)
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
 * | 4096 | 0.1966 | 0.0833 |
 * | 16384 | 0.3277 | 0.2000 |
 * | 65536 | 0.7864 | 0.3333 |
 *
 * ![sasum-stride256 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sasum/gbps-stride256.svg)
 *
 * ![sasum-stride256 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sasum/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.sasum.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sasum/wgblas/stride.sasum.js) — WebGPU stride-sweep benchmark script
 *
 * @module benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sasum
 */
