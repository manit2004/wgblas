/**
 * Benchmark results for sswap on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0060 | 0.0858 | 0.0039 | 0.1311 | 65.4% |
 * | 64 | 0.0059 | 0.1739 | 0.0039 | 0.2645 | 65.8% |
 * | 128 | 0.0060 | 0.3422 | 0.0036 | 0.5689 | 60.2% |
 * | 512 | 0.0059 | 1.3875 | 0.0041 | 2.0000 | 69.4% |
 * | 1024 | 0.0060 | 2.7380 | 0.0040 | 4.1124 | 66.6% |
 * | 4096 | 0.0061 | 10.6667 | 0.0038 | 17.3559 | 61.5% |
 * | 16384 | 0.0064 | 41.1658 | 0.0041 | 63.5039 | 64.8% |
 * | 65536 | 0.0081 | 129.0079 | 0.0082 | 128.0000 | 100.8% |
 * | 262144 | 0.0284 | 147.9368 | 0.0287 | 146.2857 | 101.1% |
 * | 1048576 | 0.1019 | 164.6892 | 0.1024 | 163.8400 | 100.5% |
 * | 4194304 | 0.3953 | 169.7824 | 0.4035 | 166.3350 | 102.1% |
 * | 16777216 | 1.5624 | 171.8114 | 1.6353 | 164.1462 | 104.7% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![sswap-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sswap/gbps-default.svg)
 *
 * ![sswap-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sswap/ms-default.svg)
 *
 * ## See also
 *
 * - [sswap.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sswap/wgblas/sswap.js) — WebGPU benchmark script
 * - [sswap.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sswap/cuda/sswap.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0060 | 0.0856 | 0.0030 | 0.1693 | 50.5% |
 * | 64 | 0.0061 | 0.1684 | 0.0031 | 0.3333 | 50.5% |
 * | 128 | 0.0059 | 0.3459 | 0.0032 | 0.6465 | 53.5% |
 * | 512 | 0.0061 | 1.3474 | 0.0035 | 2.3167 | 58.2% |
 * | 1024 | 0.0061 | 2.6667 | 0.0033 | 4.9709 | 53.6% |
 * | 4096 | 0.0067 | 9.7757 | 0.0036 | 18.2044 | 53.7% |
 * | 16384 | 0.0083 | 31.5077 | 0.0054 | 48.9075 | 64.4% |
 * | 65536 | 0.0273 | 38.3700 | 0.0269 | 39.0095 | 98.4% |
 * | 262144 | 0.1014 | 41.3803 | 0.1004 | 41.7959 | 99.0% |
 * | 1048576 | 0.3957 | 42.3993 | 0.3907 | 42.9463 | 98.7% |
 * | 4194304 | 1.5692 | 42.7659 | 1.5633 | 42.9287 | 99.6% |
 *
 * ![sswap-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sswap/gbps-stride4.svg)
 *
 * ![sswap-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sswap/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0836 | 0.0040 | 0.1285 | 65.0% |
 * | 64 | 0.0061 | 0.1667 | 0.0041 | 0.2500 | 66.7% |
 * | 128 | 0.0061 | 0.3351 | 0.0039 | 0.5246 | 63.9% |
 * | 512 | 0.0063 | 1.3061 | 0.0048 | 1.7239 | 75.8% |
 * | 1024 | 0.0065 | 2.5160 | 0.0050 | 3.2508 | 77.4% |
 * | 4096 | 0.0092 | 7.1483 | 0.0063 | 10.4224 | 68.6% |
 * | 16384 | 0.0351 | 7.4642 | 0.0342 | 7.6740 | 97.3% |
 * | 65536 | 0.1371 | 7.6507 | 0.1331 | 7.8769 | 97.1% |
 * | 262144 | 0.5448 | 7.6992 | 0.5262 | 7.9711 | 96.6% |
 * | 1048576 | 2.1811 | 7.6921 | 2.9476 | 5.6918 | 135.1% |
 *
 * ![sswap-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sswap/gbps-stride32.svg)
 *
 * ![sswap-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sswap/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0063 | 1.2962 | 0.0054 | 1.5193 | 85.3% |
 * | 1024 | 0.0066 | 2.4976 | 0.0051 | 3.2000 | 78.0% |
 * | 4096 | 0.0105 | 6.2630 | 0.0091 | 7.1860 | 87.2% |
 * | 16384 | 0.0643 | 4.0756 | 0.0712 | 3.6826 | 110.7% |
 * | 65536 | 0.2925 | 3.5853 | 0.2892 | 3.6264 | 98.9% |
 *
 * ![sswap-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sswap/gbps-stride256.svg)
 *
 * ![sswap-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sswap/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.sswap.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sswap/wgblas/stride.sswap.js) — WebGPU stride-sweep benchmark script
 * - [stride.sswap.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sswap/cuda/stride.sswap.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sswap
 */
