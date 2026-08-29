/**
 * Benchmark results for scopy on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0059 | 0.0435 | 0.0026 | 0.0970 | 44.8% |
 * | 64 | 0.0059 | 0.0863 | 0.0026 | 0.1951 | 44.2% |
 * | 128 | 0.0061 | 0.1675 | 0.0027 | 0.3855 | 43.5% |
 * | 512 | 0.0061 | 0.6702 | 0.0033 | 1.2308 | 54.4% |
 * | 1024 | 0.0060 | 1.3545 | 0.0027 | 3.0476 | 44.4% |
 * | 4096 | 0.0061 | 5.3895 | 0.0028 | 11.9070 | 45.3% |
 * | 16384 | 0.0063 | 20.7919 | 0.0030 | 43.5745 | 47.7% |
 * | 65536 | 0.0081 | 64.7589 | 0.0045 | 116.1986 | 55.7% |
 * | 262144 | 0.0186 | 112.9931 | 0.0160 | 131.2032 | 86.1% |
 * | 1048576 | 0.0594 | 141.2414 | 0.0531 | 158.0133 | 89.4% |
 * | 4194304 | 0.2171 | 154.5660 | 0.2045 | 164.0836 | 94.2% |
 * | 16777216 | 0.8437 | 159.0770 | 0.8041 | 166.9175 | 95.3% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![scopy-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/scopy/gbps-default.svg)
 *
 * ![scopy-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/scopy/ms-default.svg)
 *
 * ## See also
 *
 * - [scopy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/scopy/wgblas/scopy.js) — WebGPU benchmark script
 * - [scopy.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/scopy/cuda/scopy.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0072 | 0.0357 | 0.0028 | 0.0930 | 38.4% |
 * | 64 | 0.0073 | 0.0697 | 0.0032 | 0.1576 | 44.2% |
 * | 128 | 0.0072 | 0.1432 | 0.0036 | 0.2832 | 50.6% |
 * | 512 | 0.0071 | 0.5792 | 0.0033 | 1.2249 | 47.3% |
 * | 1024 | 0.0074 | 1.1058 | 0.0031 | 2.6667 | 41.5% |
 * | 4096 | 0.0078 | 4.1796 | 0.0033 | 9.7990 | 42.7% |
 * | 16384 | 0.0086 | 15.2268 | 0.0041 | 32.0000 | 47.6% |
 * | 65536 | 0.0207 | 25.2840 | 0.0221 | 23.6934 | 106.7% |
 * | 262144 | 0.0782 | 26.8151 | 0.0794 | 26.4045 | 101.6% |
 * | 1048576 | 0.3069 | 27.3323 | 0.3070 | 27.3209 | 100.0% |
 * | 4194304 | 1.2207 | 27.4889 | 1.2108 | 27.7126 | 99.2% |
 *
 * ![scopy-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/scopy/gbps-stride4.svg)
 *
 * ![scopy-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/scopy/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0070 | 0.0365 | 0.0030 | 0.0847 | 43.1% |
 * | 64 | 0.0072 | 0.0713 | 0.0031 | 0.1658 | 43.0% |
 * | 128 | 0.0070 | 0.1461 | 0.0032 | 0.3168 | 46.1% |
 * | 512 | 0.0073 | 0.5602 | 0.0036 | 1.1278 | 49.7% |
 * | 1024 | 0.0076 | 1.0756 | 0.0036 | 2.2555 | 47.7% |
 * | 4096 | 0.0096 | 3.4020 | 0.0045 | 7.2113 | 47.2% |
 * | 16384 | 0.0205 | 6.4000 | 0.0181 | 7.2367 | 88.4% |
 * | 65536 | 0.0695 | 7.5433 | 0.0652 | 8.0412 | 93.8% |
 * | 262144 | 0.2662 | 7.8769 | 0.2519 | 8.3252 | 94.6% |
 * | 1048576 | 1.0463 | 8.0175 | 0.9955 | 8.4262 | 95.1% |
 *
 * ![scopy-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/scopy/gbps-stride32.svg)
 *
 * ![scopy-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/scopy/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0068 | 0.5995 | 0.0043 | 0.9446 | 63.5% |
 * | 1024 | 0.0063 | 1.2929 | 0.0041 | 2.0000 | 64.6% |
 * | 4096 | 0.0082 | 4.0000 | 0.0044 | 7.3669 | 54.3% |
 * | 16384 | 0.0284 | 4.6178 | 0.0319 | 4.1145 | 112.2% |
 * | 65536 | 0.1377 | 3.8080 | 0.1430 | 3.6674 | 103.8% |
 *
 * ![scopy-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/scopy/gbps-stride256.svg)
 *
 * ![scopy-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/scopy/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.scopy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/scopy/wgblas/stride.scopy.js) — WebGPU stride-sweep benchmark script
 * - [stride.scopy.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/scopy/cuda/stride.scopy.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/scopy
 */
