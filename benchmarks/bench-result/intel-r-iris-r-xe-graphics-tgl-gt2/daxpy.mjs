/**
 * Benchmark results for daxpy on Intel R Iris R Xe Graphics Tgl Gt2.
 *
 * ## Intel R Iris R Xe Graphics Tgl Gt2
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0655 | 0.0117 |
 * | 64 | 0.0655 | 0.0234 |
 * | 128 | 0.0655 | 0.0469 |
 * | 512 | 0.0655 | 0.1875 |
 * | 1024 | 0.0655 | 0.3750 |
 * | 4096 | 0.0655 | 1.5000 |
 * | 16384 | 0.1311 | 3.0000 |
 * | 65536 | 0.2621 | 6.0000 |
 * | 262144 | 0.9175 | 6.8571 |
 * | 1048576 | 2.4248 | 10.3784 |
 * | 4194304 | 5.1118 | 19.6923 |
 * | 16777216 | 22.0201 | 18.2857 |
 *
 * ![daxpy-default GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/daxpy/gbps-default.svg)
 *
 * ![daxpy-default ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/daxpy/ms-default.svg)
 *
 * ## See also
 *
 * - [daxpy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/daxpy/wgblas/daxpy.js) — WebGPU benchmark script
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
 * | 32 | 0.0655 | 0.0117 |
 * | 64 | 0.0655 | 0.0234 |
 * | 128 | 0.0655 | 0.0469 |
 * | 512 | 0.0655 | 0.1875 |
 * | 1024 | 0.0655 | 0.3750 |
 * | 4096 | 0.0655 | 1.5000 |
 * | 16384 | 0.1966 | 2.0000 |
 * | 65536 | 0.5898 | 2.6667 |
 * | 262144 | 2.4248 | 2.5946 |
 * | 1048576 | 5.1773 | 4.8608 |
 * | 4194304 | 21.3320 | 4.7189 |
 *
 * ![daxpy-stride4 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/daxpy/gbps-stride4.svg)
 *
 * ![daxpy-stride4 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/daxpy/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 5</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0655 | 0.0117 |
 * | 64 | 0.0655 | 0.0234 |
 * | 128 | 0.0655 | 0.0469 |
 * | 512 | 0.0655 | 0.1875 |
 * | 1024 | 0.0655 | 0.3750 |
 * | 4096 | 0.0655 | 1.5000 |
 * | 16384 | 0.1966 | 2.0000 |
 * | 65536 | 0.7209 | 2.1818 |
 * | 262144 | 2.7525 | 2.2857 |
 * | 1048576 | 6.4225 | 3.9184 |
 *
 * ![daxpy-stride5 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/daxpy/gbps-stride5.svg)
 *
 * ![daxpy-stride5 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/daxpy/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 32</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0655 | 0.0117 |
 * | 64 | 0.0655 | 0.0234 |
 * | 128 | 0.0655 | 0.0469 |
 * | 512 | 0.0655 | 0.1875 |
 * | 1024 | 0.0655 | 0.3750 |
 * | 4096 | 0.1966 | 0.5000 |
 * | 16384 | 0.5243 | 0.7500 |
 * | 65536 | 1.6384 | 0.9600 |
 * | 262144 | 5.1118 | 1.2308 |
 *
 * ![daxpy-stride32 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/daxpy/gbps-stride32.svg)
 *
 * ![daxpy-stride32 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/daxpy/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 33</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0655 | 0.0234 |
 * | 128 | 0.0655 | 0.0469 |
 * | 512 | 0.0655 | 0.1875 |
 * | 1024 | 0.0655 | 0.3750 |
 * | 4096 | 0.1966 | 0.5000 |
 * | 16384 | 0.5243 | 0.7500 |
 * | 65536 | 2.3593 | 0.6667 |
 * | 262144 | 5.2429 | 1.2000 |
 *
 * ![daxpy-stride33 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/daxpy/gbps-stride33.svg)
 *
 * ![daxpy-stride33 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/daxpy/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 255</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 512 | 0.0655 | 0.1875 |
 * | 1024 | 0.1311 | 0.1875 |
 * | 4096 | 0.1966 | 0.5000 |
 * | 16384 | 0.6554 | 0.6000 |
 * | 65536 | 1.9988 | 0.7869 |
 *
 * ![daxpy-stride255 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/daxpy/gbps-stride255.svg)
 *
 * ![daxpy-stride255 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/daxpy/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 256</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 512 | 0.0655 | 0.1875 |
 * | 1024 | 0.1311 | 0.1875 |
 * | 4096 | 0.1966 | 0.5000 |
 * | 16384 | 0.7209 | 0.5455 |
 * | 65536 | 1.9661 | 0.8000 |
 *
 * ![daxpy-stride256 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/daxpy/gbps-stride256.svg)
 *
 * ![daxpy-stride256 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/daxpy/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.daxpy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/daxpy/wgblas/stride.daxpy.js) — WebGPU stride-sweep benchmark script
 *
 * ## alpha sweep
 *
 * `alpha` is a plain multiplier here: the kernel applies it unconditionally, with no branch for any particular value. A flat sweep is therefore the expected result and is recorded as a measured null. Levels include `0`, `1` and a denormal-producing `1e-38` because those are the values a shader *could* special-case if it ever grew a branch — and `strsm` is the routine where one does.
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — alpha = -3.75</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 1024 | 0.0655 | 0.3750 |
 * | 65536 | 0.2621 | 6.0000 |
 * | 1048576 | 2.3593 | 10.6667 |
 * | 16777216 | 21.8235 | 18.4505 |
 *
 * ![daxpy-alphaneg3p75 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/daxpy/gbps-alphaneg3p75.svg)
 *
 * ![daxpy-alphaneg3p75 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/daxpy/ms-alphaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — alpha = 0</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 1024 | 0.0655 | 0.3750 |
 * | 65536 | 0.2621 | 6.0000 |
 * | 1048576 | 3.0474 | 8.2581 |
 * | 16777216 | 22.3478 | 18.0176 |
 *
 * ![daxpy-alpha0 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/daxpy/gbps-alpha0.svg)
 *
 * ![daxpy-alpha0 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/daxpy/ms-alpha0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — alpha = 1e-38</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 1024 | 0.0655 | 0.3750 |
 * | 65536 | 0.2621 | 6.0000 |
 * | 1048576 | 2.9491 | 8.5333 |
 * | 16777216 | 22.0856 | 18.2315 |
 *
 * ![daxpy-alpha1eneg38 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/daxpy/gbps-alpha1eneg38.svg)
 *
 * ![daxpy-alpha1eneg38 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/daxpy/ms-alpha1eneg38.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — alpha = 1</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 1024 | 0.0655 | 0.3750 |
 * | 65536 | 0.2621 | 6.0000 |
 * | 1048576 | 2.3593 | 10.6667 |
 * | 16777216 | 22.3478 | 18.0176 |
 *
 * ![daxpy-alpha1 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/daxpy/gbps-alpha1.svg)
 *
 * ![daxpy-alpha1 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/daxpy/ms-alpha1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — alpha = 2.5</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 1024 | 0.0655 | 0.3750 |
 * | 65536 | 0.2621 | 6.0000 |
 * | 1048576 | 3.4734 | 7.2453 |
 * | 16777216 | 21.8890 | 18.3952 |
 *
 * ![daxpy-alpha2p5 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/daxpy/gbps-alpha2p5.svg)
 *
 * ![daxpy-alpha2p5 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/daxpy/ms-alpha2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [alpha.daxpy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/daxpy/wgblas/alpha.daxpy.js) — WebGPU alpha-sweep benchmark script
 *
 * @module benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/daxpy
 */
