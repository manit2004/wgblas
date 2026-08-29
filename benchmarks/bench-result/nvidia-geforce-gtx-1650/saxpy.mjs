/**
 * Benchmark results for saxpy on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0070 | 0.0548 | 0.0047 | 0.0819 | 66.9% |
 * | 64 | 0.0070 | 0.1093 | 0.0047 | 0.1622 | 67.4% |
 * | 128 | 0.0073 | 0.2115 | 0.0044 | 0.3478 | 60.8% |
 * | 512 | 0.0072 | 0.8514 | 0.0044 | 1.3913 | 61.2% |
 * | 1024 | 0.0070 | 1.7655 | 0.0048 | 2.5772 | 68.5% |
 * | 4096 | 0.0074 | 6.6350 | 0.0045 | 10.9714 | 60.5% |
 * | 16384 | 0.0081 | 24.2367 | 0.0046 | 42.6667 | 56.8% |
 * | 65536 | 0.0102 | 77.1617 | 0.0060 | 130.0317 | 59.3% |
 * | 262144 | 0.0246 | 128.0000 | 0.0555 | 56.6594 | 225.9% |
 * | 1048576 | 0.0779 | 161.5845 | 0.1677 | 75.0126 | 215.4% |
 * | 4194304 | 0.2924 | 172.1329 | 0.5234 | 96.1644 | 179.0% |
 * | 16777216 | 1.1510 | 174.9181 | 1.3654 | 147.4462 | 118.6% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![saxpy-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/gbps-default.svg)
 *
 * ![saxpy-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/ms-default.svg)
 *
 * ## See also
 *
 * - [saxpy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/saxpy/wgblas/saxpy.js) — WebGPU benchmark script
 * - [saxpy.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/saxpy/cuda/saxpy.c) — CUDA / cuBLAS reference script
 *
 * ## Stride sweep
 *
 * Unless noted otherwise, every result above uses unit stride (`incx = incy = 1`) — the normal case, and the coalesced, best-case GPU access pattern. Real usage sometimes passes a non-unit stride (e.g. operating on a row or column of a larger matrix, where `incx = lda`), which breaks memory coalescing and costs measurably more. This section sweeps a few representative strides to characterize that cost separately, collapsed below by default — expand a stride to see its table and chart.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 4</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0625 | 0.0039 | 0.0980 | 63.8% |
 * | 64 | 0.0061 | 0.1250 | 0.0037 | 0.2051 | 60.9% |
 * | 128 | 0.0061 | 0.2500 | 0.0039 | 0.3934 | 63.5% |
 * | 512 | 0.0061 | 1.0000 | 0.0038 | 1.6271 | 61.5% |
 * | 1024 | 0.0061 | 2.0000 | 0.0038 | 3.2681 | 61.2% |
 * | 4096 | 0.0064 | 7.6418 | 0.0040 | 12.1905 | 62.7% |
 * | 16384 | 0.0080 | 24.7243 | 0.0053 | 37.0120 | 66.8% |
 * | 65536 | 0.0224 | 35.1840 | 0.0471 | 16.6957 | 210.7% |
 * | 262144 | 0.0758 | 41.5135 | 0.1127 | 27.9233 | 148.7% |
 * | 1048576 | 0.2908 | 43.2676 | 0.3743 | 33.6140 | 128.7% |
 * | 4194304 | 1.1510 | 43.7283 | 1.3865 | 36.3013 | 120.5% |
 *
 * ![saxpy-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/gbps-stride4.svg)
 *
 * ![saxpy-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0628 | 0.0038 | 0.1000 | 62.8% |
 * | 64 | 0.0061 | 0.1253 | 0.0038 | 0.2025 | 61.9% |
 * | 128 | 0.0061 | 0.2500 | 0.0040 | 0.3840 | 65.1% |
 * | 512 | 0.0061 | 1.0000 | 0.0041 | 1.5000 | 66.7% |
 * | 1024 | 0.0063 | 1.9492 | 0.0041 | 2.9767 | 65.5% |
 * | 4096 | 0.0082 | 5.9767 | 0.0056 | 8.8276 | 67.7% |
 * | 16384 | 0.0247 | 7.9534 | 0.0512 | 3.8400 | 207.1% |
 * | 65536 | 0.0881 | 8.9302 | 0.1279 | 6.1486 | 145.2% |
 * | 262144 | 0.3400 | 9.2530 | 0.4078 | 7.7141 | 119.9% |
 * | 1048576 | 1.3435 | 9.3661 | 1.6242 | 7.7473 | 120.9% |
 *
 * ![saxpy-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/gbps-stride32.svg)
 *
 * ![saxpy-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0061 | 1.0000 | 0.0039 | 1.5610 | 64.1% |
 * | 1024 | 0.0064 | 1.9152 | 0.0040 | 3.0720 | 62.3% |
 * | 4096 | 0.0086 | 5.7207 | 0.0052 | 9.3659 | 61.1% |
 * | 16384 | 0.0415 | 4.7426 | 0.0819 | 2.4000 | 197.6% |
 * | 65536 | 0.1798 | 4.3733 | 0.2236 | 3.5169 | 124.4% |
 *
 * ![saxpy-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/gbps-stride256.svg)
 *
 * ![saxpy-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.saxpy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/saxpy/wgblas/stride.saxpy.js) — WebGPU stride-sweep benchmark script
 * - [stride.saxpy.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/saxpy/cuda/stride.saxpy.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * ## alpha sweep
 *
 * `alpha` is a plain multiplier here: the kernel applies it unconditionally, with no branch for any particular value. A flat sweep is therefore the expected result and is recorded as a measured null. Levels include `0`, `1` and a denormal-producing `1e-38` because those are the values a shader *could* special-case if it ever grew a branch — and `strsm` is the routine where one does.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = -3.75</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 1024 | 0.0061 | 2.0000 |
 * | 65536 | 0.0082 | 96.0000 |
 * | 1048576 | 0.0758 | 166.0541 |
 * | 16777216 | 1.1592 | 173.6820 |
 *
 * ![saxpy-alphaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/gbps-alphaneg3p75.svg)
 *
 * ![saxpy-alphaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/ms-alphaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 0</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 1024 | 0.0060 | 2.0645 |
 * | 65536 | 0.0082 | 96.0000 |
 * | 1048576 | 0.0758 | 166.0541 |
 * | 16777216 | 1.1592 | 173.6820 |
 *
 * ![saxpy-alpha0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/gbps-alpha0.svg)
 *
 * ![saxpy-alpha0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/ms-alpha0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1e-38</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 1024 | 0.0060 | 2.0426 |
 * | 65536 | 0.0082 | 96.0000 |
 * | 1048576 | 0.0758 | 166.0541 |
 * | 16777216 | 1.1590 | 173.7012 |
 *
 * ![saxpy-alpha1eneg38 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/gbps-alpha1eneg38.svg)
 *
 * ![saxpy-alpha1eneg38 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/ms-alpha1eneg38.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 1024 | 0.0060 | 2.0426 |
 * | 65536 | 0.0082 | 96.0000 |
 * | 1048576 | 0.0758 | 166.0541 |
 * | 16777216 | 1.1592 | 173.6820 |
 *
 * ![saxpy-alpha1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/gbps-alpha1.svg)
 *
 * ![saxpy-alpha1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/ms-alpha1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 2.5</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 1024 | 0.0061 | 2.0211 |
 * | 65536 | 0.0082 | 96.0000 |
 * | 1048576 | 0.0758 | 166.0541 |
 * | 16777216 | 1.1592 | 173.6820 |
 *
 * ![saxpy-alpha2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/gbps-alpha2p5.svg)
 *
 * ![saxpy-alpha2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/ms-alpha2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [alpha.saxpy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/saxpy/wgblas/alpha.saxpy.js) — WebGPU alpha-sweep benchmark script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/saxpy
 */
