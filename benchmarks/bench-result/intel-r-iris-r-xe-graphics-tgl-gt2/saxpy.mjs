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
 * | 4194304 | 2.3593 | 21.3333 |
 * | 16777216 | 10.3547 | 19.4430 |
 *
 * ![saxpy-default GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/saxpy/gbps-default.svg)
 *
 * ![saxpy-default ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/saxpy/ms-default.svg)
 *
 * ## See also
 *
 * - [saxpy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/saxpy/wgblas/saxpy.js) — WebGPU benchmark script
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
 * | 32 | 0.0655 | 0.0059 |
 * | 64 | 0.0655 | 0.0117 |
 * | 128 | 0.0655 | 0.0234 |
 * | 512 | 0.0655 | 0.0938 |
 * | 1024 | 0.0655 | 0.1875 |
 * | 4096 | 0.0655 | 0.7500 |
 * | 16384 | 0.0655 | 3.0000 |
 * | 65536 | 0.2621 | 3.0000 |
 * | 262144 | 1.1796 | 2.6667 |
 * | 1048576 | 2.3593 | 5.3333 |
 * | 4194304 | 9.9615 | 5.0526 |
 *
 * ![saxpy-stride4 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/saxpy/gbps-stride4.svg)
 *
 * ![saxpy-stride4 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/saxpy/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 5</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0655 | 0.0059 |
 * | 64 | 0.0655 | 0.0117 |
 * | 128 | 0.0655 | 0.0234 |
 * | 512 | 0.0655 | 0.0938 |
 * | 1024 | 0.0655 | 0.1875 |
 * | 4096 | 0.0655 | 0.7500 |
 * | 16384 | 0.1311 | 1.5000 |
 * | 65536 | 0.3277 | 2.4000 |
 * | 262144 | 1.4418 | 2.1818 |
 * | 1048576 | 2.9491 | 4.2667 |
 * | 4194304 | 12.4518 | 4.0421 |
 *
 * ![saxpy-stride5 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/saxpy/gbps-stride5.svg)
 *
 * ![saxpy-stride5 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/saxpy/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 32</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0655 | 0.0059 |
 * | 64 | 0.0655 | 0.0117 |
 * | 128 | 0.0655 | 0.0234 |
 * | 512 | 0.0655 | 0.0938 |
 * | 1024 | 0.0655 | 0.1875 |
 * | 4096 | 0.0655 | 0.7500 |
 * | 16384 | 0.2621 | 0.7500 |
 * | 65536 | 0.7864 | 1.0000 |
 * | 262144 | 2.3593 | 1.3333 |
 * | 1048576 | 9.9615 | 1.2632 |
 *
 * ![saxpy-stride32 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/saxpy/gbps-stride32.svg)
 *
 * ![saxpy-stride32 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/saxpy/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 33</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0655 | 0.0117 |
 * | 128 | 0.0655 | 0.0234 |
 * | 512 | 0.0655 | 0.0938 |
 * | 1024 | 0.0655 | 0.1875 |
 * | 4096 | 0.0655 | 0.7500 |
 * | 16384 | 0.2621 | 0.7500 |
 * | 65536 | 1.1141 | 0.7059 |
 * | 262144 | 2.3593 | 1.3333 |
 *
 * ![saxpy-stride33 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/saxpy/gbps-stride33.svg)
 *
 * ![saxpy-stride33 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/saxpy/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 255</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 512 | 0.0655 | 0.0938 |
 * | 1024 | 0.0655 | 0.1875 |
 * | 4096 | 0.1311 | 0.3750 |
 * | 16384 | 0.3277 | 0.6000 |
 * | 65536 | 1.2452 | 0.6316 |
 *
 * ![saxpy-stride255 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/saxpy/gbps-stride255.svg)
 *
 * ![saxpy-stride255 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/saxpy/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — stride = 256</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 512 | 0.0655 | 0.0938 |
 * | 1024 | 0.0655 | 0.1875 |
 * | 4096 | 0.1311 | 0.3750 |
 * | 16384 | 0.3932 | 0.5000 |
 * | 65536 | 0.8520 | 0.9231 |
 *
 * ![saxpy-stride256 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/saxpy/gbps-stride256.svg)
 *
 * ![saxpy-stride256 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/saxpy/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.saxpy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/saxpy/wgblas/stride.saxpy.js) — WebGPU stride-sweep benchmark script
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
 * | 1024 | 0.0655 | 0.1875 |
 * | 65536 | 0.1311 | 6.0000 |
 * | 1048576 | 1.3763 | 9.1429 |
 * | 16777216 | 10.5513 | 19.0807 |
 *
 * ![saxpy-alphaneg3p75 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/saxpy/gbps-alphaneg3p75.svg)
 *
 * ![saxpy-alphaneg3p75 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/saxpy/ms-alphaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — alpha = 0</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 1024 | 0.0655 | 0.1875 |
 * | 65536 | 0.1311 | 6.0000 |
 * | 1048576 | 1.3763 | 9.1429 |
 * | 16777216 | 10.5513 | 19.0807 |
 *
 * ![saxpy-alpha0 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/saxpy/gbps-alpha0.svg)
 *
 * ![saxpy-alpha0 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/saxpy/ms-alpha0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — alpha = 1e-38</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 1024 | 0.0655 | 0.1875 |
 * | 65536 | 0.1311 | 6.0000 |
 * | 1048576 | 1.3763 | 9.1429 |
 * | 16777216 | 11.3377 | 17.7572 |
 *
 * ![saxpy-alpha1eneg38 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/saxpy/gbps-alpha1eneg38.svg)
 *
 * ![saxpy-alpha1eneg38 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/saxpy/ms-alpha1eneg38.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — alpha = 1</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 1024 | 0.0655 | 0.1875 |
 * | 65536 | 0.1311 | 6.0000 |
 * | 1048576 | 1.3763 | 9.1429 |
 * | 16777216 | 10.9773 | 18.3403 |
 *
 * ![saxpy-alpha1 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/saxpy/gbps-alpha1.svg)
 *
 * ![saxpy-alpha1 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/saxpy/ms-alpha1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — alpha = 2.5</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 1024 | 0.0655 | 0.1875 |
 * | 65536 | 0.1311 | 6.0000 |
 * | 1048576 | 1.3763 | 9.1429 |
 * | 16777216 | 10.5841 | 19.0217 |
 *
 * ![saxpy-alpha2p5 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/saxpy/gbps-alpha2p5.svg)
 *
 * ![saxpy-alpha2p5 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/saxpy/ms-alpha2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [alpha.saxpy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/saxpy/wgblas/alpha.saxpy.js) — WebGPU alpha-sweep benchmark script
 *
 * @module benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/saxpy
 */
