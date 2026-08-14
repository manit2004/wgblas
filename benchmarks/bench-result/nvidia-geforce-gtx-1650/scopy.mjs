/**
 * Benchmark results for scopy on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0060 | 0.0426 | 0.0026 | 0.1000 | 42.6% |
 * | 64 | 0.0060 | 0.0860 | 0.0026 | 0.1988 | 43.3% |
 * | 128 | 0.0060 | 0.1707 | 0.0026 | 0.3902 | 43.7% |
 * | 512 | 0.0060 | 0.6845 | 0.0026 | 1.5610 | 43.8% |
 * | 1024 | 0.0059 | 1.3838 | 0.0027 | 3.0843 | 44.9% |
 * | 4096 | 0.0061 | 5.4037 | 0.0027 | 12.3373 | 43.8% |
 * | 16384 | 0.0064 | 20.5829 | 0.0036 | 36.9009 | 55.8% |
 * | 65536 | 0.0082 | 64.0000 | 0.0043 | 121.3630 | 52.7% |
 * | 262144 | 0.0184 | 113.7778 | 0.0155 | 135.1258 | 84.2% |
 * | 1048576 | 0.0594 | 141.2414 | 0.0532 | 157.5385 | 89.7% |
 * | 4194304 | 0.2171 | 154.5660 | 0.2028 | 165.4949 | 93.4% |
 * | 16777216 | 0.8097 | 165.7598 | 0.8013 | 167.5075 | 99.0% |
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
 * | 32 | 0.0060 | 0.0427 | 0.0031 | 0.0833 | 51.2% |
 * | 64 | 0.0060 | 0.0847 | 0.0034 | 0.1495 | 56.6% |
 * | 128 | 0.0060 | 0.1702 | 0.0030 | 0.3422 | 49.7% |
 * | 512 | 0.0060 | 0.6772 | 0.0032 | 1.2929 | 52.4% |
 * | 1024 | 0.0060 | 1.3653 | 0.0034 | 2.3925 | 57.1% |
 * | 4096 | 0.0061 | 5.3333 | 0.0034 | 9.5701 | 55.7% |
 * | 16384 | 0.0069 | 18.8756 | 0.0041 | 32.0000 | 59.0% |
 * | 65536 | 0.0200 | 26.2775 | 0.0224 | 23.3723 | 112.4% |
 * | 262144 | 0.0778 | 26.9474 | 0.0793 | 26.4578 | 101.9% |
 * | 1048576 | 0.3070 | 27.3223 | 0.3087 | 27.1722 | 100.6% |
 * | 4194304 | 1.2220 | 27.4586 | 1.2173 | 27.5647 | 99.6% |
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
 * | 32 | 0.0071 | 0.0361 | 0.0028 | 0.0909 | 39.7% |
 * | 64 | 0.0061 | 0.0833 | 0.0029 | 0.1758 | 47.4% |
 * | 128 | 0.0061 | 0.1667 | 0.0030 | 0.3441 | 48.4% |
 * | 512 | 0.0061 | 0.6667 | 0.0034 | 1.1963 | 55.7% |
 * | 1024 | 0.0061 | 1.3333 | 0.0035 | 2.3273 | 57.3% |
 * | 4096 | 0.0082 | 4.0000 | 0.0044 | 7.5294 | 53.1% |
 * | 16384 | 0.0188 | 6.9838 | 0.0182 | 7.2113 | 96.8% |
 * | 65536 | 0.0676 | 7.7576 | 0.0654 | 8.0117 | 96.8% |
 * | 262144 | 0.2601 | 8.0630 | 0.2508 | 8.3613 | 96.4% |
 * | 1048576 | 1.0281 | 8.1594 | 0.9941 | 8.4380 | 96.7% |
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
 * | 512 | 0.0061 | 0.6667 | 0.0034 | 1.2075 | 55.2% |
 * | 1024 | 0.0063 | 1.2995 | 0.0035 | 2.3594 | 55.1% |
 * | 4096 | 0.0082 | 3.9922 | 0.0044 | 7.4203 | 53.8% |
 * | 16384 | 0.0286 | 4.5765 | 0.0310 | 4.2292 | 108.2% |
 * | 65536 | 0.1432 | 3.6604 | 0.1407 | 3.7274 | 98.2% |
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
